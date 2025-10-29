// Loader.tsx – Turn.js flipbook adapted for Rig Veda quotes
import { useEffect, useRef } from 'react';

// A reliable CDN build of turn.js v4:
const DEFAULT_TURN_JS = 'https://cdn.jsdelivr.net/gh/blasten/turn.js@4/turn.min.js';

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

export default function Loader({ turnJsSrc = DEFAULT_TURN_JS }) {
  const quotes = [
    {
      sanskrit:
        'अग्निमीळे पुरोहितं यज्ञस्य देवं रत्वीजम | होतारं रत्नधातमम ||',
      translation:
        'I praise Agni, the domestic priest, divine ministrant of the sacrifice, the hotar, most rich in treasure.',
      ref: 'Rig Veda 1.1.1',
    },
    {
      sanskrit:
        'वायवा याहि दर्शत एहि पवमान उक्थ्यः | इह श्रुधी हवं मम ||',
      translation:
        'Come, Vāyu, conspicuous, purifying, worthy of praise; here listen to my invocation.',
      ref: 'Rig Veda 1.2.1',
    },
    {
      sanskrit:
        'इन्द्रं वर्धन्तो अप्तुरः कृण्वन्तो विश्वमायुः | पुरुहूतं पुरुष्टुतम् ||',
      translation:
        'Indra, mighty and much-invoked, protector of all—let us extol him.',
      ref: 'Rig Veda 1.1.2',
    },
    {
      sanskrit:
        'सोमं मन्दन्तु नो यज्ञं विश्वे देवासो अग्नयः | पवमानस्य रेतसा ||',
      translation:
        'May all the gods with Agni gladden our rite by the essence of the purifying Soma.',
      ref: 'Rig Veda 1.1.3',
    },
    {
      sanskrit:
        'उषाः शुभ्रा व्युष्यन्ती रश्मिभिर्ज्योतिषा तमो व्यभवद् |',
      translation:
        'Dawn the bright, advancing with her rays, has driven away the darkness with her light.',
      ref: 'Rig Veda (Uṣas hymn)',
    },
  ];

  const width = 1000;
  const height = 600;
  const bookRef = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const autoAdvanceMs = 9000; // slower auto page change

  useEffect(() => {
    // Ensure globals exist (jQuery is provided via index.html script)
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

        // Prepare: keep hidden until initialized to avoid first-paint glitch
        if (node) (node as HTMLElement).style.visibility = 'hidden';

        $el.turn({
          width,
          height,
          display: 'double',
          autoCenter: true,
          gradients: true,
        });

        // Toggle single/double display at edges to avoid blank half-page and keep centered
        let lastDisplay: 'single' | 'double' | null = null;
        const updateDisplay = (page: number) => {
          try {
            const pages = $el.turn('pages');
            const edge = page === 1 || page === pages;
            const desired: 'single' | 'double' = edge ? 'single' : 'double';
            if (desired !== lastDisplay) {
              $el.turn('display', desired);
              lastDisplay = desired;
            }
            $el.turn('center');
          } catch {}
        };
        updateDisplay($el.turn('page'));
        // Reveal only after layout is correct
        if (node) (node as HTMLElement).style.visibility = 'visible';

        const startAuto = () => {
          if (autoTimerRef.current != null) return;
          autoTimerRef.current = window.setInterval(() => {
            try {
              const pages = $el.turn('pages');
              const current = $el.turn('page');
              if (current >= pages) {
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

        observerRef.current = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry && entry.isIntersecting && entry.intersectionRatio >= 0.6) {
              startAuto();
            } else {
              stopAuto();
            }
          },
          { threshold: [0, 0.6, 1] }
        );
        observerRef.current.observe(node as Element);

        // Keep centered and switch single/double at edges; also manage auto timer
        $el.on('turning', (_e: any, page: number) => {
          stopAuto();
          updateDisplay(page);
        });
        $el.on('turned', (_e: any, page: number) => {
          updateDisplay(page);
          startAuto();
        });

        const onResize = () => {
          try { $el.turn('center'); } catch {}
        };
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
    return () => {
      isMounted = false;
      cleanup();
    };
  }, [width, height, turnJsSrc]);

  const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
*{ margin:0; padding:0; box-sizing:border-box; font-family:"Poppins",sans-serif; }
.wrapper { display:flex; justify-content:center; align-items:center; padding:2rem; }
.flipbook { width:${width}px; height:${height}px; visibility:hidden; }
.flipbook .hard { color:#fff; font-weight:bold; border:none; position:relative; }
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
.flipbook .hard.cover::after { content:''; position:absolute; inset:10px; border:2px solid rgba(212,175,55,0.8); pointer-events:none; }
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
  background: linear-gradient(135deg, #FFFDF5 0%, #FFF7E8 100%);
  display:flex; flex-direction:column; justify-content:center; align-items:center;
  gap:10px; border:1px solid rgba(44,24,16,0.12);
  color:#2C1810;
}
.flipbook .page small { color:#2C1810; opacity:0.95; font-weight:600; }
.quote { text-align:center; padding:2rem; max-width:80%; margin:0 auto; }
.quote .sa { font-family:'Noto Sans Devanagari', serif; font-size:1.7rem; line-height:1.8; color:#2C1810; }
.quote .divider { width:160px; height:2px; background:linear-gradient(90deg, transparent, #D4AF37, transparent); margin:14px auto; opacity:0.9; }
.quote .tr { font-style:italic; color:#5B4638; margin-top:0.9rem; }
.quote .rf { color:#D4AF37; font-weight:700; margin-top:0.6rem; letter-spacing:0.4px; }
`;

  return (
    <div className="wrapper">
      <style>{styles}</style>

      <div className="flipbook" ref={bookRef}>
        <div className="hard cover">
          <div className="cover-inner">
            <div className="emblem"></div>
            <h1>Rig Veda</h1>
            <p className="subtitle">~ Sacred Verses ~</p>
          </div>
        </div>
        <div className="hard"></div>

        <div>
          <small>Explore the ancient wisdom of the Rig Veda</small>
          <small>Turn the pages to read select verses</small>
        </div>

        {quotes.map((q, idx) => (
          <div key={idx}>
            <div className="quote">
              <div className="sa">{q.sanskrit}</div>
              <div className="divider"></div>
              <div className="tr">{q.translation}</div>
              <div className="rf">{q.ref}</div>
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