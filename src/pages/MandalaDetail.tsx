import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import TextBook from '../components/TextBook';
import { MandalaSukta } from '../types/vedic';

const MandalaDetail: React.FC = () => {
  const { mandalaId } = useParams<{ mandalaId: string }>();
  const navigate = useNavigate();
  const mandalaNum = parseInt(mandalaId || '1', 10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suktas, setSuktas] = useState<MandalaSukta[]>([]);

  // Lazy-load mandala JSON using dynamic imports
  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    // Dynamically import the mandala JSON file
    const loadMandala = async () => {
      try {
        let mod: any;
        switch (mandalaNum) {
          case 1:
            mod = await import('../data/rigveda_mandala_1.json');
            break;
          case 2:
            mod = await import('../data/rigveda_mandala_2.json');
            break;
          case 3:
            mod = await import('../data/rigveda_mandala_3.json');
            break;
          case 4:
            mod = await import('../data/rigveda_mandala_4.json');
            break;
          case 5:
            mod = await import('../data/rigveda_mandala_5.json');
            break;
          case 6:
            mod = await import('../data/rigveda_mandala_6.json');
            break;
          case 7:
            mod = await import('../data/rigveda_mandala_7.json');
            break;
          case 8:
            mod = await import('../data/rigveda_mandala_8.json');
            break;
          case 9:
            mod = await import('../data/rigveda_mandala_9.json');
            break;
          case 10:
            mod = await import('../data/rigveda_mandala_10.json');
            break;
          default:
            throw new Error(`Mandala ${mandalaNum} not found`);
        }

        if (!isActive) return;
        
        // Vite JSON imports expose the data as default export
        const data: MandalaSukta[] = (mod?.default || mod || []) as MandalaSukta[];
        const sorted = [...data].sort((a, b) => (a.sukta || 0) - (b.sukta || 0));
        setSuktas(sorted);
        setLoading(false);
      } catch (e: any) {
        if (!isActive) return;
        setError(e?.message || `Failed to load mandala ${mandalaNum} data`);
        setSuktas([]);
        setLoading(false);
      }
    };

    loadMandala();

    return () => { isActive = false; };
  }, [mandalaNum]);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Video overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-vedic-deep/48 via-vedic-deep/48 to-vedic-deep/94 -z-[9] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-lg bg-vedic-gold/10 border border-vedic-gold/20 text-vedic-gold hover:bg-vedic-gold/20 transition-colors">
            ← Back
          </button>
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-vedic-gold">MANDALA {mandalaNum}</h1>
          <div className="opacity-0">.</div>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {!loading && error && (
          <div className="card text-center">
            <div className="text-vedic-gold font-semibold mb-1">Could not load data</div>
            <div className="text-vedic-light/70">{error}</div>
          </div>
        )}

        {!loading && !error && suktas.length === 0 && (
          <div className="card text-center">
            <div className="text-vedic-gold font-semibold mb-1">No suktas available</div>
            <div className="text-vedic-light/70">This mandala has no entries in the dataset.</div>
          </div>
        )}

        {!loading && !error && suktas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <TextBook
              title={`Mandala ${mandalaNum}`}
              subtitle="Rig Veda – Sanskrit & English"
              startOnLeft={true}
              pages={(() => {
                // Build pages in spreads: left (Sanskrit) and right (English)
                // Each sukta starts on a new left page; chunk into 8-line groups
                const result: { title: string; body: string }[] = [];

                const chunkBy = (arr: string[], size: number) => {
                  const chunks: string[][] = [];
                  let current: string[] = [];
                  for (const item of arr) {
                    if (current.length >= size) {
                      chunks.push(current);
                      current = [];
                    }
                    current.push(item);
                  }
                  if (current.length) chunks.push(current);
                  return chunks;
                };

                for (const s of suktas) {
                  const title = `Sukta ${s.sukta}`;
                  const saLines = (s.text || '').split('\n').map(l => l.trim()).filter(l => l.length > 0);
                  const enLines = (s.translation || '')
                    .split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0);
                  const saChunks = chunkBy(saLines, 8);
                  const enChunks = chunkBy(enLines.length ? enLines : ['Translation coming soon.'], 8);

                  const maxChunks = Math.max(saChunks.length, enChunks.length);
                  for (let i = 0; i < maxChunks; i++) {
                    const sa = saChunks[i] || [];
                    const en = enChunks[i] || [];
                    const pageTitle = i === 0 ? title : `${title} — continued`;

                    // Ensure sukta starts on a left page: if result length is odd, add a blank page
                    if (result.length % 2 !== 0) {
                      result.push({ title: '', body: '' });
                    }
                    // Left page Sanskrit
                    result.push({ title: pageTitle, body: sa.join('\n') });
                    // Right page English
                    result.push({ title: pageTitle, body: en.join('\n') });
                  }
                }

                return result;
              })()}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MandalaDetail;


