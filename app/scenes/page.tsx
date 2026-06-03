'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getScenesForFormat, Scene } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

export default function ScenesPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [concept, setConcept] = useState('');
  const [format, setFormat] = useState('');

  useEffect(() => {
    const c = sessionStorage.getItem('clipspark_concept') || '';
    const f = sessionStorage.getItem('clipspark_format') || 'reels';
    setConcept(c);
    setFormat(f);
    setTimeout(() => {
      setScenes(getScenesForFormat(f));
      setLoading(false);
    }, 1500);
  }, []);

  const handleNext = () => {
    sessionStorage.setItem('clipspark_scenes', JSON.stringify(scenes));
    router.push('/music');
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
        <Link href="/script" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Scenes</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{
              flex: n <= 2 ? 'none' : 1,
              height: 3, borderRadius: 999,
              background: n <= 2 ? '#E8445A' : 'rgba(232,68,90,0.18)',
              width: n <= 2 ? 24 : undefined,
            }} />
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>Step 2 / 4</span>
        </div>

        {/* Concept summary */}
        {concept && (
          <div style={{ ...glass, borderRadius: 'var(--r-lg)', padding: '12px 14px', marginBottom: 18, boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Your concept · {format}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.4 }}>{concept}</p>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.18)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>Generating scenes...</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI is building your storyboard</p>
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 12 }}>
              {scenes.length} Scenes generated
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {scenes.map((scene, i) => (
                <div key={scene.id} style={{ ...glass, borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={`https://images.unsplash.com/${scene.unsplashId}?w=800&h=400&fit=crop&q=80`}
                      alt={`Scene ${i + 1}`}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: 999, padding: '4px 10px',
                      fontSize: 11, fontWeight: 700, color: '#fff',
                    }}>
                      Scene {i + 1}
                    </div>
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: 999, padding: '4px 10px',
                      fontSize: 11, fontWeight: 600, color: '#fff',
                    }}>
                      {scene.duration}s
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45, fontStyle: 'italic' }}>
                      {scene.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                width: '100%', padding: '16px',
                borderRadius: 'var(--r-xl)',
                background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(232,68,90,0.35)',
              }}
            >
              Choose Music →
            </button>
          </>
        )}
      </main>

      <TabBar />
    </div>
  );
}
