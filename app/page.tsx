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

const FORMATS = [
  { id: 'reels', label: 'Reels', emoji: '📱', desc: 'Vertical short-form, 9:16' },
  { id: 'ad',    label: 'Ad',    emoji: '🎯', desc: 'Product promo, 15-30s' },
  { id: 'cinematic', label: 'Cinematic', emoji: '🎬', desc: 'Widescreen, dramatic' },
];

export default function Home() {
  const router = useRouter();
  const [recentProjects, setRecentProjects] = useState<{id:string; title:string; format:string; createdAt:number}[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('clipai_projects');
    if (data) setRecentProjects(JSON.parse(data).slice(0, 3));
  }, []);

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
            <span style={{ fontSize: 12, fontWeight: 600, color: '#E8445A' }}>ClipAI</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.8, color: 'var(--text-1)', lineHeight: 1.08, marginBottom: 8 }}>
            Turn ideas into<br />video clips
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.5 }}>
            Describe your concept, generate scenes and music — get a ready clip
          </p>
        </div>

        {/* Create button */}
        <button
          onClick={() => router.push('/script')}
          style={{
            width: '100%', padding: '18px 24px',
            borderRadius: 'var(--r-xl)',
            background: 'linear-gradient(135deg, #E8445A 0%, #FF8FA3 100%)',
            color: '#fff', fontSize: 17, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(232,68,90,0.38)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            letterSpacing: -0.2, marginBottom: 20,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create New Video
        </button>

        {/* Format cards */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          {FORMATS.map(f => (
            <div
              key={f.id}
              onClick={() => { sessionStorage.setItem('clipai_format', f.id); router.push('/script'); }}
              style={{
                flex: 1, ...glass,
                borderRadius: 'var(--r-lg)',
                padding: '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-2)', lineHeight: 1.3 }}>{f.desc}</div>
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
                  ...glass, borderRadius: 'var(--r-lg)',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-2)', textTransform: 'capitalize' }}>{p.format}</p>
                  </div>
                  <div style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: 'rgba(232,68,90,0.09)', color: '#E8445A',
                    fontSize: 12, fontWeight: 600,
                  }}>
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
