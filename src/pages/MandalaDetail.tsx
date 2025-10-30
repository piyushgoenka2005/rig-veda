import React, { useEffect, useMemo, useState } from 'react';
import SectionOverlay from '../components/SectionOverlay';
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

  // Lazy-load mandala JSON using Vite's glob imports
  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    const loaders = import.meta.glob('../data/rigveda_mandala_*.json');
    const key = `../data/rigveda_mandala_${mandalaNum}.json` as const;
    const load = loaders[key];

    if (!load) {
      setError(`Data file not found for mandala ${mandalaNum}`);
      setSuktas([]);
      setLoading(false);
      return;
    }

    load()
      .then((mod: any) => {
        // Vite JSON imports expose the data as default export
        const data: MandalaSukta[] = (mod?.default || []) as MandalaSukta[];
        if (!isActive) return;
        const sorted = [...data].sort((a, b) => (a.sukta || 0) - (b.sukta || 0));
        setSuktas(sorted);
        setLoading(false);
      })
      .catch((e: any) => {
        if (!isActive) return;
        setError(e?.message || 'Failed to load mandala data');
        setLoading(false);
      });

    return () => { isActive = false; };
  }, [mandalaNum]);

  return (
    <div className="min-h-screen bg-transparent relative">
      <SectionOverlay opacity={48} blur="sm" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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


