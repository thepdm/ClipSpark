'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoryScenes, Scene, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} style={{
          height: 4, borderRadius: 999, transition: 'flex 0.3s',
          flex: n === current ? 2 : 1,
          background: n <= current ? '#E8445A' : 'rgba(232,68,90,0.15)',
        }} />
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 4 }}>
        {current} / 5
      </span>
    </div>
  );
}

export default function ScenesPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState('');
  const [character, setCharacter] = useState<{ name: string; imageId: string } | null>(null);
  const [regenLoading, setRegenLoading] = useState<Set<string>>(new Set());
  const [regenPool, setRegenPool] = useState<Record<string, number>>({});

  useEffect(() => {
    const c = sessionStorage.getItem('clipspark_character');
    const s = sessionStorage.getItem('clipspark_story') || '';
    if (c) setCharacter(JSON.parse(c));
    setStory(s);

    const charData = c ? JSON.parse(c) : null;
    setTimeout(() => {
      setScenes(getStoryScenes(charData?.name || ''));
      setLoading(false);
    }, 1800);
  }, []);

  const handleRegen = (sceneId: string) => {
    setRegenLoading(prev => new Set(prev).add(sceneId));
    setTimeout(() => {
      setScenes(prev => prev.map(s => {
        if (s.id !== sceneId) return s;
        const poolIndex = (regenPool[sceneId] || 0) % REGEN_POOL.length;
        setRegenPool(p => ({ ...p, [sceneId]: poolIndex + 1 }));
        return { ...s, unsplashId: REGEN_POOL[poolIndex], regenCount: s.regenCount + 1, status: 'done' };
      }));
      setRegenLoading(prev => { const n = new Set(prev); n.delete(sceneId); return n; });
    }, 1500);
  };

  const handleNext = () => {
    sessionStorage.setItem('clipspark_scenes', JSON.stringify(scenes));
    router.push('/music');
  };

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
        <Link href="/story" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Scenes</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>
        <StepBar current={3} />

        {/* Character + story summary */}
        {character && (
          <div style={{ ...glass, borderRadius: 'var(--r-lg)', padding: '12px 14px', marginBottom: 18, boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={`https://images.unsplash.com/${character.imageId}?w=80&h=80&fit=crop&q=80`}
              alt={character.name}
              style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, filter: 'saturate(1.1)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#E8445A', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                ✨ {character.name}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {story || 'Your story'}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.18)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>Building your storyboard...</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI is generating scenes from your story</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase' }}>
                {scenes.length} Scenes generated
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Tap ↻ to regenerate any scene</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {scenes.map((scene, i) => {
                const isRegen = regenLoading.has(scene.id);
                return (
                  <div key={scene.id} style={{
                    ...glass, borderRadius: 'var(--r-xl)', overflow: 'hidden',
                    boxShadow: 'var(--shadow)',
                    border: isRegen ? '1.5px solid rgba(232,68,90,0.4)' : '1px solid var(--glass-border)',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ position: 'relative' }}>
                      {isRegen ? (
                        <div style={{
                          width: '100%', height: 170,
                          background: 'linear-gradient(135deg, rgba(232,68,90,0.08), rgba(255,143,163,0.08))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10,
                        }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.2)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
                          <p style={{ fontSize: 12, color: '#E8445A', fontWeight: 600 }}>Regenerating scene {i + 1}...</p>
                        </div>
                      ) : (
                        <img
                          src={`https://images.unsplash.com/${scene.unsplashId}?w=800&h=450&fit=crop&q=80`}
                          alt={`Scene ${i + 1}`}
                          style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }}
                        />
                      )}

                      {/* Scene badge */}
                      <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: 999, padding: '4px 10px',
                        fontSize: 11, fontWeight: 700, color: '#fff',
                      }}>
                        Scene {i + 1}
                      </div>

                      {/* Duration */}
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: 999, padding: '4px 10px',
                        fontSize: 11, fontWeight: 600, color: '#fff',
                      }}>
                        {scene.duration}s
                      </div>

                      {/* Character avatar in scene */}
                      {character && !isRegen && (
                        <div style={{
                          position: 'absolute', bottom: 10, left: 10,
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          borderRadius: 999, padding: '4px 10px 4px 4px',
                        }}>
                          <img
                            src={`https://images.unsplash.com/${character.imageId}?w=40&h=40&fit=crop&q=80`}
                            alt=""
                            style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{character.name}</span>
                        </div>
                      )}

                      {/* Regen count badge */}
                      {scene.regenCount > 0 && !isRegen && (
                        <div style={{
                          position: 'absolute', bottom: 10, right: 10,
                          background: 'rgba(232,68,90,0.85)', borderRadius: 999,
                          padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#fff',
                        }}>
                          ↻ ×{scene.regenCount}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <p style={{ flex: 1, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45, fontStyle: 'italic' }}>
                        {scene.prompt}
                      </p>
                      <button
                        onClick={() => handleRegen(scene.id)}
                        disabled={isRegen}
                        style={{
                          flexShrink: 0,
                          width: 36, height: 36, borderRadius: 10,
                          background: isRegen ? 'rgba(232,68,90,0.08)' : 'rgba(232,68,90,0.10)',
                          border: '1px solid rgba(232,68,90,0.2)',
                          color: '#E8445A', fontSize: 16,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: isRegen ? 'default' : 'pointer',
                          transition: 'all 0.15s',
                        }}
                        title="Regenerate this scene"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                );
              })}
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
              Create Music →
            </button>
          </>
        )}
      </main>

      <TabBar />
    </div>
  );
}
