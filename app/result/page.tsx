'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scene } from '@/lib/mockScenes';
import { Track } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

export default function ResultPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  const [concept, setConcept] = useState('');
  const [format, setFormat] = useState('');
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem('clipspark_scenes');
    const t = sessionStorage.getItem('clipspark_track');
    const c = sessionStorage.getItem('clipspark_concept') || '';
    const f = sessionStorage.getItem('clipspark_format') || 'reels';
    if (!s || !t) { router.push('/'); return; }
    setScenes(JSON.parse(s));
    setTrack(JSON.parse(t));
    setConcept(c);
    setFormat(f);
  }, [router]);

  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return;
    const interval = setInterval(() => {
      setActiveScene(prev => (prev + 1) % scenes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const saveProject = () => {
    const project = {
      id: Date.now().toString(),
      title: concept.slice(0, 40) || 'Untitled project',
      format,
      track: track?.title,
      sceneCount: scenes.length,
      createdAt: Date.now(),
    };
    const existing = JSON.parse(localStorage.getItem('clipspark_projects') || '[]');
    localStorage.setItem('clipspark_projects', JSON.stringify([project, ...existing]));
    setSaved(true);
  };

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  if (!track || scenes.length === 0) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.15)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
    </div>
  );

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
        <Link href="/music" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Video</span>
        <button
          onClick={saveProject}
          disabled={saved}
          style={{
            padding: '7px 14px', borderRadius: 999,
            background: saved ? 'rgba(232,68,90,0.12)' : 'linear-gradient(135deg, #E8445A, #FF8FA3)',
            color: saved ? '#E8445A' : '#fff',
            fontSize: 13, fontWeight: 600,
            border: 'none', cursor: saved ? 'default' : 'pointer',
          }}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      <main style={{ padding: '16px 20px 0' }}>

        {/* Step indicator — complete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ flex: 'none', height: 3, borderRadius: 999, background: '#E8445A', width: 24 }} />
          ))}
          <span style={{ fontSize: 11, color: '#E8445A', fontWeight: 700, whiteSpace: 'nowrap' }}>Complete ✓</span>
        </div>

        {/* Video preview */}
        <div style={{ ...glass, borderRadius: 'var(--r-xl)', overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow)' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9' }}>
            <img
              src={`https://images.unsplash.com/${scenes[activeScene]?.unsplashId}?w=800&h=450&fit=crop&q=80`}
              alt={`Scene ${activeScene + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
            />
            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))' }} />

            {/* Play button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Scene counter */}
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 999, padding: '4px 10px',
              fontSize: 11, fontWeight: 600, color: '#fff',
            }}>
              {activeScene + 1} / {scenes.length}
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center' }}>
            {scenes.map((_, i) => (
              <button key={i} onClick={() => setActiveScene(i)} style={{
                flex: 1, height: 3, borderRadius: 999,
                background: i === activeScene ? '#E8445A' : 'rgba(232,68,90,0.2)',
                border: 'none', cursor: 'pointer', transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>

        {/* Meta */}
        <div style={{ ...glass, borderRadius: 'var(--r-lg)', padding: '14px 16px', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Concept</p>
              <p style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{concept || 'Untitled'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Duration</p>
              <p style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{totalDuration}s · {scenes.length} scenes</p>
            </div>
          </div>
          {/* Track */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(232,68,90,0.07)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{track.title}</p>
              <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{track.genre} · {track.bpm} BPM · {track.duration}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => router.push('/')}
            style={{
              flex: 1, padding: '14px 0',
              borderRadius: 'var(--r-xl)',
              background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(232,68,90,0.35)',
            }}
          >
            New Video
          </button>
          <button
            onClick={saveProject}
            disabled={saved}
            style={{
              flex: 1, padding: '14px 0',
              borderRadius: 'var(--r-xl)',
              ...glass,
              color: saved ? 'var(--text-3)' : 'var(--text-1)',
              fontSize: 15, fontWeight: 700,
              border: saved ? '1px solid var(--glass-border)' : '1px solid var(--glass-border)',
              cursor: saved ? 'default' : 'pointer',
            }}
          >
            {saved ? '✓ Saved' : 'Save Project'}
          </button>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
