const fs = require('fs');
const path = require('path');

function readFileSafe(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractHymnText(html) {
  const divStart = html.indexOf('<div class="box hymn">');
  if (divStart === -1) return null;
  const divEnd = html.indexOf('</div>', divStart);
  if (divEnd === -1) return null;
  const inner = html.slice(divStart, divEnd);
  const paragraphs = [];
  const pRegex = /<p>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(inner)) !== null) {
    let text = match[1];
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+$/g, '')
      .replace(/^\s+/g, '');
    paragraphs.push(text);
  }
  if (paragraphs.length === 0) {
    const plain = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return plain || null;
  }
  const joined = paragraphs.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return joined;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const hymnsDir = path.join(repoRoot, 'hymns');
  const dataFile = path.join(repoRoot, 'src', 'data', 'rigveda_mandala_1.json');

  const files = fs
    .readdirSync(hymnsDir)
    .filter((f) => /^01\d{3}\.html$/.test(f))
    .sort();

  const mapSuktaToText = new Map();
  for (const file of files) {
    const code = path.basename(file, '.html');
    const suktaStr = code.slice(-3);
    const sukta = parseInt(suktaStr, 10);
    if (!Number.isInteger(sukta)) continue;
    const html = readFileSafe(path.join(hymnsDir, file));
    const text = extractHymnText(html);
    if (text && text.length > 0) {
      mapSuktaToText.set(sukta, text);
    }
  }

  let jsonRaw = readFileSafe(dataFile);
  if (jsonRaw.charCodeAt(0) === 0xFEFF) {
    jsonRaw = jsonRaw.slice(1);
  }

  let updatedCount = 0;
  const updatedSuktas = [];
  let content = jsonRaw;

  for (const [sukta, newText] of mapSuktaToText.entries()) {
    const mandalaIdx = content.search(new RegExp(
      String.raw`\{[\s\S]*?"mandala"\s*:\s*1[\s\S]*?"sukta"\s*:\s*${sukta}\b`,
      'm'
    ));
    if (mandalaIdx === -1) continue;

    let objStart = mandalaIdx;
    while (objStart > 0 && content[objStart] !== '{') objStart--;
    let depth = 0;
    let i = objStart;
    let objEnd = -1;
    while (i < content.length) {
      const ch = content[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { objEnd = i; break; }
      }
      i++;
    }
    if (objEnd === -1) continue;

    const before = content.slice(0, objStart);
    const objectSlice = content.slice(objStart, objEnd + 1);
    const after = content.slice(objEnd + 1);

    const escaped = JSON.stringify(newText);
    let newObjectSlice;
    const translationKeyRegex = /"translation"\s*:\s*"[\s\S]*?"/m;
    if (translationKeyRegex.test(objectSlice)) {
      newObjectSlice = objectSlice.replace(translationKeyRegex, `"translation": ${escaped}`);
    } else {
      const textFieldMatch = /("text"\s*:\s*"[\s\S]*?")/m.exec(objectSlice);
      if (textFieldMatch) {
        const insertPos = textFieldMatch.index + textFieldMatch[0].length;
        newObjectSlice = objectSlice.slice(0, insertPos) + `,\n        "translation": ${escaped}` + objectSlice.slice(insertPos);
      } else {
        const suktaFieldMatch = /("sukta"\s*:\s*\d+)/m.exec(objectSlice);
        if (suktaFieldMatch) {
          const insertPos2 = suktaFieldMatch.index + suktaFieldMatch[0].length;
          newObjectSlice = objectSlice.slice(0, insertPos2) + `,\n        "translation": ${escaped}` + objectSlice.slice(insertPos2);
        } else {
          continue;
        }
      }
    }

    if (newObjectSlice && newObjectSlice !== objectSlice) {
      content = before + newObjectSlice + after;
      updatedCount++;
      updatedSuktas.push(sukta);
    }
  }

  fs.writeFileSync(dataFile, content, 'utf8');
  console.log(JSON.stringify({ updatedCount, updatedSuktas: updatedSuktas.sort((a, b) => a - b) }));
}

main();


