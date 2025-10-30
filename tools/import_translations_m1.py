import os
import re
import json
import html
import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HYMNS_DIR = os.path.join(ROOT, "hymns")
JSON_PATH = os.path.join(ROOT, "src", "data", "rigveda_mandala_1.json")


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def backup_json(json_path: str) -> str:
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = json_path + "." + ts + ".bak"
    data = read_file(json_path)
    write_file(backup_path, data)
    return backup_path


def extract_translation_from_html(html_text: str) -> str:
    # Find the first <div class="box hymn"> ... </div>
    m = re.search(r'<div\s+class="box\s+hymn"[^>]*>([\s\S]*?)</div>', html_text, re.IGNORECASE)
    if not m:
        return ""
    inner = m.group(1)
    # Replace <p> and </p> with newlines boundaries
    inner = re.sub(r'<\s*/\s*p\s*>', "\n", inner, flags=re.IGNORECASE)
    inner = re.sub(r'<\s*p[^>]*>', "", inner, flags=re.IGNORECASE)
    # Convert <br> variants to newlines
    inner = re.sub(r'<\s*br\s*/?\s*>', "\n", inner, flags=re.IGNORECASE)
    # Strip any remaining tags
    inner = re.sub(r'<[^>]+>', "", inner)
    # Unescape HTML entities and normalize whitespace
    text = html.unescape(inner)
    # Normalize CRLF to LF, strip trailing spaces per line
    lines = [ln.rstrip() for ln in text.splitlines()]
    # Remove leading/trailing empty lines and collapse multiple blanks to single blank line
    cleaned_lines = []
    prev_blank = False
    for ln in lines:
        is_blank = (ln.strip() == "")
        if is_blank and prev_blank:
            continue
        cleaned_lines.append(ln)
        prev_blank = is_blank
    text = "\n".join(cleaned_lines).strip()
    return text


def escape_json_string(s: str) -> str:
    # JSON string escaping, ensure we don't alter indentation style outside values
    return json.dumps(s, ensure_ascii=False)


def update_translation_in_json_text(json_text: str, sukta: int, new_translation: str) -> tuple[str, bool]:
    # Locate the object block for mandala 1 and given sukta, then replace or insert translation
    # Pattern to find block starting at "mandala":  1 then "sukta":  N (order in file shows veda, mandala, sukta)
    # We will search by sukta first within an object boundary
    # Rough object matcher: { ... "mandala":  1, ... "sukta":  N, ... }
    obj_pattern = re.compile(
        r'(\{[\s\S]*?"mandala"\s*:\s*1\b[\s\S]*?"sukta"\s*:\s*' + str(sukta) + r'\b[\s\S]*?\})',
        re.MULTILINE
    )
    m = obj_pattern.search(json_text)
    if not m:
        return json_text, False
    obj_text = m.group(1)

    # Determine indentation for fields inside the object (look at existing keys)
    indent_match = re.search(r'\n(\s+)"[^"]+"\s*:', obj_text)
    field_indent = indent_match.group(1) if indent_match else "        "  # default 8 spaces

    # Build replacement for translation field
    translation_line = f'{field_indent}"translation":  {escape_json_string(new_translation)}'

    # If translation present, replace its value; else insert before closing }
    trans_pattern = re.compile(r'\n' + re.escape(field_indent) + r'"translation"\s*:\s*"[\s\S]*?"\s*(,?)')
    if trans_pattern.search(obj_text):
        obj_text_new = trans_pattern.sub("\n" + translation_line + r"\1", obj_text)
    else:
        # Insert with a preceding comma after the last field (if needed)
        # Place before the last \n}\n in the object
        insert_pos = obj_text.rfind("}")
        # Ensure preceding line ends with comma
        obj_body, closing = obj_text[:insert_pos], obj_text[insert_pos:]
        # Add comma to previous non-empty line if not present
        lines = obj_body.splitlines()
        # Find last non-empty line
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip():
                if not lines[i].rstrip().endswith(','):
                    lines[i] = lines[i] + ','
                break
        obj_body = "\n".join(lines)
        obj_text_new = obj_body + "\n" + translation_line + "\n" + closing

    # Replace in whole json text
    new_json_text = json_text[:m.start(1)] + obj_text_new + json_text[m.end(1):]
    return new_json_text, True


def main():
    if not os.path.isdir(HYMNS_DIR):
        raise SystemExit(f"Hymns directory not found: {HYMNS_DIR}")

    json_text = read_file(JSON_PATH)
    backup_path = backup_json(JSON_PATH)

    # Collect hymns 01xxx
    files = [f for f in os.listdir(HYMNS_DIR) if re.match(r'^01\d{3}\.html$', f)]
    files.sort()

    updated = []
    for fname in files:
        path = os.path.join(HYMNS_DIR, fname)
        html_text = read_file(path)
        translation = extract_translation_from_html(html_text)
        if not translation:
            continue
        sukta = int(fname[2:5])  # last three digits
        new_text, changed = update_translation_in_json_text(json_text, sukta, translation)
        if changed and new_text != json_text:
            json_text = new_text
            updated.append(sukta)

    if updated:
        write_file(JSON_PATH, json_text)

    # Simple JSON validation
    try:
        json.loads(json_text)
        status = "ok"
    except Exception as e:
        status = f"invalid: {e}"

    report = {
        "backup": backup_path,
        "updated_count": len(updated),
        "updated_suktas": updated,
        "validation": status,
    }
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()


