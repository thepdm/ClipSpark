'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CHARACTER_IMAGES } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const FEATURED = [
  { name: 'Снегурочка', tag: 'Fantasy', imageId: CHARACTER_IMAGES[0] },
  { name: 'Street dancer', tag: 'Urban', imageId: CHARACTER_IMAGES[1] },
  { name: 'Space explorer', tag: 'Sci-Fi', imageId: CHARACTER_IMAGES[2] },
  { name: 'Young chef', tag: 'Lifestyle', imageId: CHARACTER_IMAGES[3] },
  { name: 'Cyber rider', tag: 'Action', imageId: CHARACTER_IMAGES[4] },
];

const TRENDING = ['🔥 Trending', 'Cinematic', 'Lo-fi vibe', 'Action', 'Fantasy', 'Anime', 'Dark'];

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [recentProjects, setRecentProjects] = useState<{ id: string; title: string; format: string; createdAt: number; exportMode?: string }[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('clipspark_projects');
    if (data) setRecentProjects(JSON.parse(data).slice(0, 3));
  }, []);

  const handleStart = (prefill?: string) => {
    if (prefill) sessionStorage.setItem('clipspark_prefill_character', prefill);
    router.push('/character');
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) { router.push('/character'); return; }
    sessionStorage.setItem('clipspark_prefill_character', prompt);
    router.push('/character');
  };

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 96 }}>
      <main style={{ padding: '52px 20px 0' }}>

        {/* Logo */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(232,68,90,0.15)',
          borderRadius: 999, padding: '5px 12px 5px 8px', marginBottom: 20,
          border: '1px solid rgba(232,68,90,0.25)',
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

        {/* Headline */}
        <h1 style={{
          fontSize: 38, fontWeight: 800, letterSpacing: -1,
          color: 'var(--text-1)', lineHeight: 1.05, marginBottom: 28,
        }}>
          Turn ideas into<br />
          <span style={{ color: '#E8445A' }}>music videos</span>
        </h1>

        {/* Prompt input bar */}
        <div style={{
          ...glass, borderRadius: 'var(--r-xl)',
          padding: '4px 4px 4px 18px',
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 14,
          boxShadow: '0 0 0 1px rgba(232,68,90,0.0)',
          transition: 'box-shadow 0.2s',
        }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePromptSubmit()}
            placeholder="Describe your character or idea..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 15, color: 'var(--text-1)', fontFamily: 'inherit',
              padding: '10px 0',
            }}
          />
          <button
            onClick={handlePromptSubmit}
            style={{
              width: 44, height: 44, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(232,68,90,0.40)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Trending chips */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 32, paddingBottom: 2 }}>
          {TRENDING.map((t, i) => (
            <button
              key={t}
              onClick={() => handleStart(i === 0 ? undefined : t)}
              style={{
                padding: '7px 14px', borderRadius: 999, flexShrink: 0,
                background: i === 0 ? 'linear-gradient(135deg, #E8445A, #FF8FA3)' : 'var(--glass)',
                border: i === 0 ? 'none' : '1px solid var(--glass-border)',
                color: i === 0 ? '#fff' : 'var(--text-2)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                boxShadow: i === 0 ? '0 3px 14px rgba(232,68,90,0.35)' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Featured characters */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 14 }}>
            Featured characters
          </p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginLeft: -20, paddingLeft: 20, marginRight: -20, paddingRight: 20 }}>
            {FEATURED.map(char => (
              <div
                key={char.name}
                onClick={() => handleStart(char.name)}
                style={{
                  width: 150, height: 220, borderRadius: 18, overflow: 'hidden',
                  flexShrink: 0, cursor: 'pointer', position: 'relative',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                }}
              >
                <img
                  src={`https://images.unsplash.com/${char.imageId}?w=300&h=440&fit=crop&q=80`}
                  alt={char.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.15) brightness(0.9)' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF', marginBottom: 3, lineHeight: 1.2 }}>{char.name}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#E8445A',
                    background: 'rgba(232,68,90,0.18)', borderRadius: 999,
                    padding: '2px 7px', border: '1px solid rgba(232,68,90,0.3)',
                  }}>
                    {char.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent projects */}
        {recentProjects.length > 0 && (
          <div style={{ marginTop: 32 }}>
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
                      {p.format}{p.exportMode === 'synced' ? ' · 🎵 Beat-synced' : ''}
                    </p>
                  </div>
                  <div style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(232,68,90,0.12)', color: '#E8445A', fontSize: 12, fontWeight: 600, border: '1px solid rgba(232,68,90,0.2)' }}>
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
