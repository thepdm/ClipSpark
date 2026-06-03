'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const FORMATS = [
  { id: 'reels', label: 'Reels', emoji: '📱', desc: 'Vertical, 9:16' },
  { id: 'ad', label: 'Ad', emoji: '🎯', desc: 'Promo, 15-30s' },
  { id: 'cinematic', label: 'Cinematic', emoji: '🎬', desc: 'Widescreen' },
];

const EXAMPLES = [
  'A morning coffee ritual for a cozy café brand',
  'Sports energy drink launch — feel the rush',
  'Minimal fashion brand, summer collection',
  'Tech product reveal — sleek and futuristic',
];

export default function ScriptPage() {
  const router = useRouter();
  const [concept, setConcept] = useState('');
  const [format, setFormat] = useState('reels');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('clipspark_format');
    if (saved) setFormat(saved);
  }, []);

  const handleGenerate = () => {
    if (!concept.trim()) return;
    setIsGenerating(true);
    sessionStorage.setItem('clipspark_concept', concept);
    sessionStorage.setItem('clipspark_format', format);
    setTimeout(() => router.push('/scenes'), 2000);
  };

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 96 }}>
      {/* Nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,232,240,0.70)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.4)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Concept</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{
              flex: n === 1 ? 'none' : 1,
              height: 3, borderRadius: 999,
              background: n === 1 ? '#E8445A' : 'rgba(232,68,90,0.18)',
              width: n === 1 ? 24 : undefined,
            }} />
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>Step 1 / 4</span>
        </div>

        {/* Concept input */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Describe your video
          </p>
          <textarea
            value={concept}
            onChange={e => setConcept(e.target.value)}
            placeholder="E.g. A morning coffee ritual for a cozy café brand..."
            rows={4}
            style={{
              width: '100%', padding: '14px 16px',
              borderRadius: 'var(--r-lg)',
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              fontSize: 15, color: 'var(--text-1)',
              lineHeight: 1.5, resize: 'none', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {/* Quick examples */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setConcept(ex)} style={{
                padding: '5px 11px', borderRadius: 999,
                background: 'rgba(232,68,90,0.08)', color: '#E8445A',
                fontSize: 11, fontWeight: 500,
                border: 'none', cursor: 'pointer',
              }}>
                {ex.length > 28 ? ex.slice(0, 28) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Format picker */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Format
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {FORMATS.map(f => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                style={{
                  flex: 1, padding: '14px 8px',
                  borderRadius: 'var(--r-lg)',
                  background: format === f.id ? 'linear-gradient(135deg, #E8445A, #FF8FA3)' : 'var(--glass)',
                  backdropFilter: format === f.id ? 'none' : 'blur(24px)',
                  WebkitBackdropFilter: format === f.id ? 'none' : 'blur(24px)',
                  border: format === f.id ? 'none' : '1px solid var(--glass-border)',
                  color: format === f.id ? '#fff' : 'var(--text-2)',
                  cursor: 'pointer', textAlign: 'center',
                  boxShadow: format === f.id ? '0 4px 18px rgba(232,68,90,0.32)' : 'var(--shadow-sm)',
                  transition: 'all 0.18s',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 5 }}>{f.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 10, opacity: 0.75 }}>{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!concept.trim() || isGenerating}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 'var(--r-xl)',
            background: concept.trim() && !isGenerating
              ? 'linear-gradient(135deg, #E8445A, #FF8FA3)'
              : 'rgba(0,0,0,0.08)',
            color: concept.trim() && !isGenerating ? '#fff' : 'var(--text-3)',
            fontSize: 16, fontWeight: 700,
            border: 'none', cursor: concept.trim() ? 'pointer' : 'default',
            boxShadow: concept.trim() && !isGenerating ? '0 6px 24px rgba(232,68,90,0.35)' : 'none',
            transition: 'all 0.18s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {isGenerating ? (
            <>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.85s linear infinite' }} />
              Generating scenes...
            </>
          ) : (
            <>
              Generate Scenes →
            </>
          )}
        </button>
      </main>

      <TabBar />
    </div>
  );
}
