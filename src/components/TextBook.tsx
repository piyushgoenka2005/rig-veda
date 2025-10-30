// TextBook.tsx – Generic Turn.js flipbook for rendering Sanskrit pages
import { useEffect, useRef, useState } from 'react';

const DEFAULT_TURN_JS = 'https://cdn.jsdelivr.net/gh/blasten/turn.js@4/turn.min.js';

type Page = {
  title?: string;
  body: string; // Sanskrit text or any content; will be rendered as plain text
};

interface TextBookProps {
  title?: string;
  subtitle?: string;
  pages: Page[];
  turnJsSrc?: string;
  startOnLeft?: boolean; // ensure first content page appears on a left leaf
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const jq: any = (window as any).jQuery || (window as any).$;
    if (typeof window !== 'undefined' && jq && jq.fn && jq.fn.turn) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[data-turnjs-src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.turnjsSrc = src;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e as any);
    document.body.appendChild(s);
  });
}

export default function TextBook({ title = 'Rig Veda', subtitle = '~ Sacred Verses ~', pages, turnJsSrc = DEFAULT_TURN_JS, startOnLeft = true }: TextBookProps) {
  const width = 1000;
  const height = 600;
  const bookRef = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const autoAdvanceMs = 9000;

  // Auto-fit content per page (shrink font until it fits once rendered)
  const PageContent: React.FC<{ heading?: string; text: string; index: number }> = ({ heading, text, index }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [fontSize, setFontSize] = useState<number>(26);

    useEffect(() => {
      const node = containerRef.current;
      if (!node) return;
      // Give layout a tick to settle after turn.js sizes the page
      const id = window.setTimeout(() => {
        try {
          const pageEl = node.closest('.page') as HTMLElement | null;
          if (!pageEl) return;
          const maxHeight = pageEl.clientHeight - 80; // padding allowance
          let current = fontSize;
          // Iteratively reduce font-size until content fits or minimum reached
          const min = 16;
          const step = 1;
          // Prevent infinite loops
          let guard = 0;
          while (node.scrollHeight > maxHeight && current > min && guard < 50) {
            current -= step;
            (node.style as any).fontSize = `${current}px`;
            guard += 1;
          }
          setFontSize(current);
        } catch {}
      }, 60);
      return () => window.clearTimeout(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, index]);

    return (
      <div className="leaf-frame">
        {heading && <div className="leaf-title">{heading}</div>}
        <div className="divider"></div>
        <div ref={containerRef} className="sa leaf-text" style={{ fontSize }}>
          {text}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const jq: any = (window as any).jQuery || (window as any).$;
    (window as any).$ = (window as any).jQuery = jq;

    let cleanup = () => {};
    let isMounted = true;

    const init = async () => {
      try {
        await loadScriptOnce(turnJsSrc);
        if (!isMounted) return;

        const node = bookRef.current as HTMLElement | null;
        const jq2: any = (window as any).jQuery || (window as any).$;
        const $el = jq2(node as any);
        if (!$el.length) return;

        if (node) (node as HTMLElement).style.visibility = 'hidden';

        $el.turn({ width, height, display: 'double', autoCenter: true, gradients: true });

        let lastDisplay: 'single' | 'double' | null = null;
        const updateDisplay = (page: number) => {
          try {
            const pagesCount = $el.turn('pages');
            const edge = page === 1 || page === pagesCount;
            const desired: 'single' | 'double' = edge ? 'single' : 'double';
            if (desired !== lastDisplay) {
              $el.turn('display', desired);
              lastDisplay = desired;
            }
            $el.turn('center');
          } catch {}
        };
        updateDisplay($el.turn('page'));
        if (node) (node as HTMLElement).style.visibility = 'visible';

        const startAuto = () => {
          if (autoTimerRef.current != null) return;
          autoTimerRef.current = window.setInterval(() => {
            try {
              const pagesCount = $el.turn('pages');
              const current = $el.turn('page');
              if (current >= pagesCount) {
                $el.turn('page', 1);
              } else {
                $el.turn('next');
              }
              updateDisplay($el.turn('page'));
            } catch {}
          }, autoAdvanceMs);
        };

        const stopAuto = () => {
          if (autoTimerRef.current != null) {
            window.clearInterval(autoTimerRef.current);
            autoTimerRef.current = null;
          }
        };

        observerRef.current = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            startAuto();
          } else {
            stopAuto();
          }
        }, { threshold: [0, 0.6, 1] });
        if (node) observerRef.current.observe(node as Element);

        $el.on('turning', (_e: any, page: number) => { stopAuto(); updateDisplay(page); });
        $el.on('turned', (_e: any, page: number) => { updateDisplay(page); startAuto(); });

        const onResize = () => { try { $el.turn('center'); } catch {} };
        window.addEventListener('resize', onResize);
        cleanup = () => {
          try {
            window.removeEventListener('resize', onResize);
            if (observerRef.current) observerRef.current.disconnect();
            if (autoTimerRef.current != null) window.clearInterval(autoTimerRef.current);
            $el.turn('destroy');
          } catch {}
        };
      } catch {
        // ignore load errors
      }
    };

    init();
    return () => { isMounted = false; cleanup(); };
  }, [width, height, turnJsSrc]);

  const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
*{ margin:0; padding:0; box-sizing:border-box; font-family:"Poppins",sans-serif; }
.wrapper { display:flex; justify-content:center; align-items:center; padding:2rem; }
.flipbook { width:${width}px; height:${height}px; visibility:hidden; overflow:hidden; border-radius:10px; background:transparent; position:relative; }
.flipbook .hard { color:#fff; font-weight:bold; border:none; position:relative; overflow:hidden; border-radius:8px; z-index:1; }
.flipbook .hard.cover { z-index:5; }
.flipbook .page { z-index:2; }
.flipbook .hard.cover {
  background:
    radial-gradient( circle at 25% 25%, rgba(212,175,55,0.18), transparent 42% ),
    radial-gradient( circle at 75% 75%, rgba(212,175,55,0.14), transparent 48% ),
    linear-gradient(135deg, #0B1220 0%, #152642 55%, #0B1220 100%) !important;
  box-shadow: inset 0 0 0 4px #D4AF37, 0 10px 25px rgba(0,0,0,0.35);
}
.flipbook .hard.cover.end {
  background:
    radial-gradient( circle at 25% 25%, rgba(212,175,55,0.18), transparent 42% ),
    radial-gradient( circle at 75% 75%, rgba(212,175,55,0.14), transparent 48% ),
    linear-gradient(135deg, #152642 0%, #0B1220 55%, #152642 100%) !important;
}
.flipbook .hard.cover::after { content:''; position:absolute; inset:10px; border:2px solid rgba(212,175,55,0.8); pointer-events:none; border-radius:4px; }
.cover-inner { text-align:center; }
.cover-inner h1{ font-size:42px; letter-spacing:1px; color:#F4D36C; text-shadow:0 2px 6px rgba(0,0,0,0.45); }
.cover-inner .subtitle{ margin-top:8px; color:#F0E0A0; font-style:italic; }
.cover-inner .emblem{ width:80px; height:80px; margin:0 auto 16px; border-radius:50%;
  background:
    conic-gradient(from 0deg, #D4AF37, #F7E27E, #D4AF37, #B38E2E, #D4AF37);
  -webkit-mask: radial-gradient(circle 32px, transparent 30px, black 31px);
  box-shadow: 0 0 20px rgba(212,175,55,0.4);
}
.flipbook .hard small { font-style:italic; font-weight:lighter; opacity:0.85; font-size:14px; }
.flipbook .page {
  /* Palm leaf manuscript look */
  background:
    linear-gradient(180deg, rgba(184,149,74,0.08), rgba(184,149,74,0.12)),
    repeating-linear-gradient(180deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 24px),
    radial-gradient(1200px 400px at 50% -20%, rgba(212,175,55,0.08), transparent),
    linear-gradient(135deg, #FFF9E9 0%, #FBEFD4 100%);
  position:relative;
  display:flex; flex-direction:column; justify-content:flex-start; align-items:stretch;
  gap:10px; color:#2C1810;
  padding:28px 24px; /* ensures equal top/bottom breathing room */
  border: 2px solid rgba(140, 103, 36, 0.55);
  box-shadow: inset 0 0 0 4px rgba(212,175,55,0.35), inset 0 0 0 8px rgba(124, 84, 20, 0.15), 0 8px 20px rgba(0,0,0,0.25);
  border-radius: 8px; overflow:hidden;
}
/* Balanced upper and lower leaf bands */
.flipbook .page::before, .flipbook .page::after {
  content:''; position:absolute; left:10px; right:10px; height:14px; pointer-events:none;
  background: linear-gradient(180deg, rgba(124,84,20,0.15), rgba(124,84,20,0));
  border-left:1px solid rgba(124,84,20,0.25);
  border-right:1px solid rgba(124,84,20,0.25);
}
.flipbook .page::before { top:10px; border-top:1px solid rgba(124,84,20,0.35); border-bottom:none; }
.flipbook .page::after  { bottom:10px; transform:rotate(180deg); border-top:1px solid rgba(124,84,20,0.35); border-bottom:none; }
.flipbook .page small { color:#2C1810; opacity:0.95; font-weight:600; }
.leaf-frame { position:relative; width:100%; max-width:100%; margin:0 auto; padding:18px 22px 18px; border:2px solid rgba(124,84,20,0.35); border-radius:6px; background: linear-gradient(0deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08)); box-shadow: inset 0 0 0 2px rgba(212,175,55,0.28); }
.leaf-title { text-align:center; font-family:'Playfair Display', serif; color:#8C6724; font-weight:700; letter-spacing:0.6px; margin-bottom:6px; }
.quote { text-align:center; padding:0.25rem 0; max-width:100%; margin:0 auto; }
.leaf-text { font-family:'Noto Sans Devanagari', serif; line-height:1.85; color:#2C1810; white-space:pre-wrap; }
.quote .divider { width:160px; height:2px; background:linear-gradient(90deg, transparent, #D4AF37, transparent); margin:14px auto; opacity:0.9; }
.quote .rf { color:#D4AF37; font-weight:700; margin-top:0.2rem; letter-spacing:0.4px; }
`;

  return (
    <div className="wrapper">
      <style>{styles}</style>

      <div className="flipbook" ref={bookRef}>
        <div className="hard cover">
          <div className="cover-inner">
            <div className="emblem"></div>
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="hard"></div>

        {/* optional alignment page so first content opens on the left leaf */}
        {startOnLeft && (
          <div>
            <div className="quote">
              <div className="sa"></div>
            </div>
          </div>
        )}

        {pages.map((p, idx) => (
          <div key={idx}>
            <div className="quote">
              <PageContent heading={p.title} text={p.body} index={idx} />
            </div>
          </div>
        ))}

        <div className="hard cover end">
          <div className="cover-inner">
            <div className="emblem"></div>
            <h1>धन्यवाद</h1>
            <p className="subtitle">~ Thank you for reading ~</p>
          </div>
        </div>
      </div>
    </div>
  );
}


