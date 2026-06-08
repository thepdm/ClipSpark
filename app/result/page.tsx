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

const BAR_HEIGHTS = [40, 65, 30, 80, 55, 45, 70, 35, 85, 50, 45, 75, 30, 60, 85, 40, 55, 70, 45, 65];

type ExportMode = null | 'syncing' | 'synced' | 'custom';

export default function ResultPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  const [story, setStory] = useState('');
  const [format, setFormat] = useState('');
  const [character, setCharacter] = useState<{ name: string; imageId: string } | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exportMode, setExportMode] = useState<ExportMode>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem('clipspark_scenes');
    const t = sessionStorage.getItem('clipspark_track');
    const st = sessionStorage.getItem('clipspark_story') || '';
    const f = sessionStorage.getItem('clipspark_format') || 'reels';
    const c = sessionStorage.getItem('clipspark_character');
    if (!s || !t) { router.push('/'); return; }
    setScenes(JSON.parse(s));
    setTrack(JSON.parse(t));
    setStory(st);
    setFormat(f);
    if (c) setCharacter(JSON.parse(c));
  }, [router]);

  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return;
    const interval = setInterval(() => {
      setActiveScene(prev => (prev + 1) % scenes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const handleSyncToMusic = () => {
    setExportMode('syncing');
    setIsPlaying(false);
    setTimeout(() => setExportMode('synced'), 2500);
  };

  const handleCustomVideo = () => {
    setExportMode('custom');
  };

  const handleSave = () => {
    const project = {
      id: Date.now().toString(),
      title: character?.name || story.slice(0, 40) || 'Untitled project',
      format,
      track: track?.title,
      sceneCount: scenes.length,
      exportMode: exportMode === 'synced' ? 'synced' : 'custom',
      createdAt: Date.now(),
    };
    const existing = JSON.parse(localStorage.getItem('clipspark_projects') || '[]');
    localStorage.setItem('clipspark_projects', JSON.stringify([project, ...existing]));
    setSaved(true);
  };

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const aspectRatio = format === 'reels' ? '9/16' : format === 'cinematic' ? '21/9' : '16/9';
  const maxHeight = format === 'reels' ? 420 : 220;

  if (!track || scenes.length === 0) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2.5px solid rgba(139,92,246,0.15)', borderTopColor: '#8B5CF6', animation: 'spin 0.85s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 96 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <Link href="/scenes" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Video</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '16px 20px 0' }}>
        {/* Video preview */}
        <div style={{ ...glass, borderRadius: 'var(--r-xl)', overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow)' }}>
          <div style={{ position: 'relative', aspectRatio, maxHeight, overflow: 'hidden', margin: '0 auto' }}>
            {exportMode === 'syncing' ? (
              <div style={{
                width: '100%', height: '100%', minHeight: 200,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(255,143,163,0.12))',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
                  {BAR_HEIGHTS.slice(0, 10).map((h, i) => (
                    <div key={i} style={{
                      width: 6, borderRadius: 3, height: `${h}%`,
                      background: `linear-gradient(to top, #8B5CF6, #EC4899)`,
                      animation: `pulse ${0.5 + (i % 3) * 0.15}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.07}s`,
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#8B5CF6' }}>Syncing to beat...</p>
                <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Matching scenes to {track.bpm} BPM</p>
              </div>
            ) : (
              <>
                <img
                  src={`https://images.unsplash.com/${scenes[activeScene]?.unsplashId}?w=800&h=600&fit=crop&q=80`}
                  alt={`Scene ${activeScene + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))' }} />

                {/* Beat-synced badge */}
                {exportMode === 'synced' && (
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(139,92,246,0.85)', backdropFilter: 'blur(8px)',
                    borderRadius: 999, padding: '4px 10px',
                    fontSize: 10, fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    🎵 Beat-synced
                  </div>
                )}

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

                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: 999, padding: '4px 10px',
                  fontSize: 11, fontWeight: 600, color: '#fff',
                }}>
                  {activeScene + 1} / {scenes.length}
                </div>
              </>
            )}
          </div>

          {/* Scene timeline */}
          {exportMode !== 'syncing' && (
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {scenes.map((scene, i) => (
                  <button key={i} onClick={() => { setActiveScene(i); setIsPlaying(false); }} style={{
                    flex: scene.duration,
                    height: exportMode === 'synced' ? 6 : 3,
                    borderRadius: 999,
                    background: i === activeScene ? '#8B5CF6' : 'rgba(139,92,246,0.2)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                  }} />
                ))}
              </div>
              {exportMode === 'synced' && (
                <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                  {BAR_HEIGHTS.slice(0, 20).map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 1,
                      background: `rgba(139,92,246,${h / 100})`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ ...glass, borderRadius: 'var(--r-lg)', padding: '14px 16px', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
          {character && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--glass-border)' }}>
              <img
                src={`https://images.unsplash.com/${character.imageId}?w=60&h=60&fit=crop&q=80`}
                alt={character.name}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', filter: 'saturate(1.1)' }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{character.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{format} · {scenes.length} scenes · {totalDuration}s</p>
              </div>
            </div>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(139,92,246,0.07)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{track.title}</p>
              <p style={{ fontSize: 11, color: 'var(--text-2)' }}>
                {track.source === 'ai_generated' ? '✨ AI Generated · ' : ''}{track.genre} · {track.bpm} BPM
              </p>
            </div>
          </div>
        </div>

        {/* Export path chooser */}
        {exportMode === null && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 12 }}>
              Finalize your video
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSyncToMusic}
                style={{
                  flex: 1, padding: '18px 12px',
                  borderRadius: 'var(--r-xl)',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(139,92,246,0.35)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>🎵</div>
                <div>Sync to Music</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 3 }}>Scenes cut to beat</div>
              </button>
              <button
                onClick={handleCustomVideo}
                style={{
                  flex: 1, padding: '18px 12px',
                  borderRadius: 'var(--r-xl)',
                  ...glass, color: 'var(--text-1)', fontSize: 14, fontWeight: 700,
                  border: '1px solid var(--glass-border)', cursor: 'pointer',
                  boxShadow: 'var(--shadow)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>🎬</div>
                <div>Custom Video</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-2)', marginTop: 3 }}>Keep your timing</div>
              </button>
            </div>
          </div>
        )}

        {/* Post-choice actions */}
        {exportMode !== null && exportMode !== 'syncing' && (
          <>
            <div style={{
              ...glass, borderRadius: 'var(--r-lg)', padding: '12px 16px', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: exportMode === 'synced' ? 'rgba(139,92,246,0.1)' : 'rgba(28,28,30,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                {exportMode === 'synced' ? '🎵' : '🎬'}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                  {exportMode === 'synced' ? 'Beat-synced video ready' : 'Custom video ready'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-2)' }}>
                  {exportMode === 'synced' ? 'Scenes matched to ' + track.bpm + ' BPM' : 'Original scene timing preserved'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={saved}
                style={{
                  flex: 1, padding: '14px 0',
                  borderRadius: 'var(--r-xl)',
                  background: saved ? 'rgba(16,185,129,0.12)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  color: saved ? '#10B981' : '#fff', fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: saved ? 'default' : 'pointer',
                  boxShadow: saved ? 'none' : '0 6px 24px rgba(139,92,246,0.35)',
                }}
              >
                {saved ? '✓ Saved' : 'Save Project'}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: character?.name || 'My ClipSpark Video', text: story });
                  }
                }}
                style={{
                  flex: 1, padding: '14px 0',
                  borderRadius: 'var(--r-xl)', ...glass,
                  color: 'var(--text-1)', fontSize: 15, fontWeight: 700,
                  border: '1px solid var(--glass-border)', cursor: 'pointer',
                  boxShadow: 'var(--shadow)',
                }}
              >
                Share ↗
              </button>
            </div>

            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%', padding: '14px', marginTop: 10,
                borderRadius: 'var(--r-xl)', background: 'transparent',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-2)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              New Video
            </button>
          </>
        )}
      </main>

      <TabBar />
    </div>
  );
}
