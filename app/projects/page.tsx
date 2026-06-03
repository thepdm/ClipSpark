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

interface Project {
  id: string;
  title: string;
  format: string;
  track?: string;
  sceneCount: number;
  createdAt: number;
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

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 96 }}>
      <main style={{ padding: '52px 20px 0' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.8, color: 'var(--text-1)', lineHeight: 1.08 }}>
            Projects
          </h1>
          {projects.length > 0 && (
            <div style={{ background: 'rgba(232,68,90,0.12)', borderRadius: 999, padding: '5px 12px', fontSize: 13, fontWeight: 600, color: '#E8445A' }}>
              {projects.length}
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '55svh', textAlign: 'center', gap: 16 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(232,68,90,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>
              🎬
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>No projects yet</h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>Create your first video clip</p>
            </div>
            <button
              onClick={() => router.push('/')}
              style={{
                marginTop: 8, padding: '13px 32px', borderRadius: 999,
                background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
                color: '#fff', fontSize: 15, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(232,68,90,0.35)',
              }}
            >
              Create Video
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.map(p => (
              <div key={p.id} style={{ ...glass, borderRadius: 'var(--r-xl)', padding: '16px', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: 'rgba(232,68,90,0.10)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                    }}>
                      {FORMAT_EMOJI[p.format] || '🎬'}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{p.title}</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'capitalize' }}>{p.format}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{p.sceneCount} scenes</span>
                        {p.track && (
                          <>
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
                            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>🎵 {p.track}</span>
                          </>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(p.id)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.06)', color: 'var(--text-3)',
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
