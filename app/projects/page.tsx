'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/TabBar';

interface Project {
  id: string;
  title: string;
  format: string;
  track?: string;
  sceneCount: number;
  createdAt: number;
  exportMode?: string;
}

const FORMAT_EMOJI: Record<string, string> = { reels: '📱', ad: '🎯', cinematic: '🎬' };

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('clipspark_projects');
    if (data) setProjects(JSON.parse(data));
  }, []);

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('clipspark_projects', JSON.stringify(updated));
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 100, background: '#0A0A0F' }}>

      {/* Nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '14px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.90)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: '#F0F0FF' }}>Projects</span>
        {projects.length > 0 && (
          <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 999, padding: '4px 12px', fontSize: 13, fontWeight: 600, color: '#8B5CF6' }}>
            {projects.length}
          </div>
        )}
      </div>

      <main style={{ padding: '20px 20px 0' }}>

        {projects.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '55svh', textAlign: 'center', gap: 14 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
              🎬
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F0F0FF', marginBottom: 6 }}>No projects yet</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>Your saved videos will appear here</p>
            </div>
            <button
              onClick={() => router.push('/create')}
              style={{
                marginTop: 8, padding: '14px 36px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(139,92,246,0.40)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Video
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.map(p => (
              <div key={p.id} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18, padding: '16px', cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>
                      {FORMAT_EMOJI[p.format] || '🎬'}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF', marginBottom: 5 }}>{p.title}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{p.format}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{p.sceneCount} scenes</span>
                        {p.track && (
                          <>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🎵 {p.track}</span>
                          </>
                        )}
                        {p.exportMode === 'synced' && (
                          <>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#8B5CF6', background: 'rgba(139,92,246,0.12)', borderRadius: 999, padding: '2px 7px' }}>Beat-synced</span>
                          </>
                        )}
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteProject(p.id); }}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)',
                      fontSize: 12, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <TabBar />
    </div>
  );
}
