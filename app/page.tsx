'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const EXAMPLES = [
  { emoji: '❄️', title: 'Снегурочка', desc: 'New Year forest night walk' },
  { emoji: '💃', title: 'Street dancer', desc: 'Neon city midnight performance' },
  { emoji: '🚀', title: 'Space explorer', desc: 'Alien planet discovery' },
  { emoji: '🍳', title: 'Chef', desc: 'Magical kitchen creation' },
];

export default function Home() {
  const router = useRouter();
  const [recentProjects, setRecentProjects] = useState<{ id: string; title: string; format: string; createdAt: number; exportMode?: string }[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('clipspark_projects');
    if (data) setRecentProjects(JSON.parse(data).slice(0, 3));
  }, []);

  const handleStart = (example?: string) => {
    if (example) sessionStorage.setItem('clipspark_prefill_character', example);
    router.push('/character');
  };

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 96 }}>
      <main style={{ padding: '52px 20px 0' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(232,68,90,0.10)',
            borderRadius: 999, padding: '5px 12px 5px 8px', marginBottom: 14,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#E8445A' }}>ClipSpark</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.8, color: 'var(--text-1)', lineHeight: 1.08, marginBottom: 8 }}>
            Turn ideas into<br />music videos
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.5 }}>
            Create a character, describe your story, generate scenes and music — get a ready clip
          </p>
        </div>

        {/* Flow steps hint */}
        <div style={{ ...glass, borderRadius: 'var(--r-xl)', padding: '16px 18px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>How it works</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {[
              { step: '1', label: 'Character', icon: '✨' },
              { step: '2', label: 'Story', icon: '📝' },
              { step: '3', label: 'Scenes', icon: '🎬' },
              { step: '4', label: 'Music', icon: '🎵' },
              { step: '5', label: 'Export', icon: '🚀' },
            ].map((s, i) => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-2)' }}>{s.label}</div>
                </div>
                {i < 4 && (
                  <div style={{ fontSize: 12, color: 'var(--text-3)', flexShrink: 0 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <button
          onClick={() => handleStart()}
          style={{
            width: '100%', padding: '18px 24px',
            borderRadius: 'var(--r-xl)',
            background: 'linear-gradient(135deg, #E8445A 0%, #FF8FA3 100%)',
            color: '#fff', fontSize: 17, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(232,68,90,0.38)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            letterSpacing: -0.2, marginBottom: 16,
          }}
        >
          ✨ Start Creating
        </button>

        {/* Example characters */}
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 12 }}>
          Try an example
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {EXAMPLES.map(ex => (
            <div
              key={ex.title}
              onClick={() => handleStart(ex.title)}
              style={{
                ...glass, borderRadius: 'var(--r-lg)', padding: '14px',
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>{ex.emoji}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>{ex.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.3 }}>{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent projects */}
        {recentProjects.length > 0 && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 12 }}>
              Recent
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentProjects.map(p => (
                <div key={p.id} style={{
                  ...glass, borderRadius: 'var(--r-lg)', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-2)', textTransform: 'capitalize' }}>
                      {p.format} {p.exportMode === 'synced' ? '· 🎵 Beat-synced' : ''}
                    </p>
                  </div>
                  <div style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(232,68,90,0.09)', color: '#E8445A', fontSize: 12, fontWeight: 600 }}>
                    Open →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <TabBar />
    </div>
  );
}
