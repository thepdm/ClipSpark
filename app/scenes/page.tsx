'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoryScenes, Scene, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.10)',
};

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} style={{
          height: 3, borderRadius: 999, transition: 'flex 0.3s',
          flex: n === current ? 2 : 1,
          background: n <= current ? '#E8445A' : 'rgba(232,68,90,0.15)',
        }} />
      ))}
    </div>
  );
}

export default function ScenesPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState('');
  const [character, setCharacter] = useState<{ name: string; imageId: string } | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [regenLoading, setRegenLoading] = useState<Set<string>>(new Set());
  const [regenPool, setRegenPool] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');

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
        return { ...s, unsplashId: REGEN_POOL[poolIndex], regenCount: s.regenCount + 1 };
      }));
      setRegenLoading(prev => { const n = new Set(prev); n.delete(sceneId); return n; });
    }, 1500);
  };

  const startEdit = (scene: Scene) => {
    setEditingId(scene.id);
    setEditPrompt(scene.prompt);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setScenes(prev => prev.map(s => s.id === editingId ? { ...s, prompt: editPrompt } : s));
    setEditingId(null);
  };

  const handleNext = () => {
    sessionStorage.setItem('clipspark_scenes', JSON.stringify(scenes));
    router.push('/music');
  };

  const activeScene = scenes[activeIdx];
  const isRegen = activeScene && regenLoading.has(activeScene.id);
  const totalDuration = scenes.reduce((s, sc) => s + sc.duration, 0);

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#0A0A0F' }}>

      {/* Nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Link href="/story" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <div style={{ flex: 1, margin: '0 16px' }}>
          <StepBar current={3} />
        </div>
        <button
          onClick={handleNext}
          disabled={loading}
          style={{
            padding: '7px 16px', borderRadius: 999,
            background: loading ? 'rgba(232,68,90,0.15)' : 'linear-gradient(135deg, #E8445A, #FF8FA3)',
            color: loading ? '#E8445A' : '#fff',
            fontSize: 13, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer',
          }}
        >
          Music →
        </button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.18)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>Building your storyboard...</p>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI is generating scenes from your story</p>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 96 }}>

          {/* Character + story summary */}
          {character && (
            <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={`https://images.unsplash.com/${character.imageId}?w=80&h=80&fit=crop&q=80`}
                alt={character.name}
                style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#E8445A', marginBottom: 1 }}>{character.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {story || 'Your story'}
                </p>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                {scenes.length} scenes · {totalDuration}s
              </span>
            </div>
          )}

          {/* Active scene large preview */}
          {activeScene && (
            <div style={{ padding: '14px 20px 0' }}>
              <div style={{ ...glass, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
                {isRegen ? (
                  <div style={{
                    width: '100%', aspectRatio: '16/9',
                    background: 'rgba(232,68,90,0.08)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.2)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
                    <p style={{ fontSize: 13, color: '#E8445A', fontWeight: 600 }}>Regenerating...</p>
                  </div>
                ) : (
                  <>
                    <img
                      src={`https://images.unsplash.com/${activeScene.unsplashId}?w=800&h=450&fit=crop&q=80`}
                      alt={`Scene ${activeIdx + 1}`}
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(10,10,15,0.7))' }} />
                  </>
                )}

                {/* Scene number + duration */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                  <span style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                    Scene {activeIdx + 1} / {scenes.length}
                  </span>
                  <span style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#fff' }}>
                    {activeScene.duration}s
                  </span>
                </div>

                {/* Character avatar */}
                {character && !isRegen && (
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '4px 10px 4px 4px' }}>
                    <img src={`https://images.unsplash.com/${character.imageId}?w=40&h=40&fit=crop&q=80`} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{character.name}</span>
                  </div>
                )}

                {/* Regen count */}
                {activeScene.regenCount > 0 && !isRegen && (
                  <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(232,68,90,0.8)', borderRadius: 999, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                    ↻ ×{activeScene.regenCount}
                  </div>
                )}
              </div>

              {/* Prompt + actions */}
              <div style={{ marginTop: 12 }}>
                {editingId === activeScene.id ? (
                  <div>
                    <textarea
                      value={editPrompt}
                      onChange={e => setEditPrompt(e.target.value)}
                      rows={3}
                      autoFocus
                      style={{
                        width: '100%', padding: '12px 14px',
                        borderRadius: 14, background: 'rgba(255,255,255,0.07)',
                        border: '1.5px solid #E8445A',
                        fontSize: 13, color: '#F0F0FF', lineHeight: 1.5,
                        resize: 'none', outline: 'none', fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={saveEdit} style={{
                        flex: 1, padding: '10px', borderRadius: 12,
                        background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
                        color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                      }}>Save changes</button>
                      <button onClick={() => setEditingId(null)} style={{
                        flex: 1, padding: '10px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
                        color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <p style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, fontStyle: 'italic' }}>
                      {activeScene.prompt}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => startEdit(activeScene)}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
                          color: 'rgba(255,255,255,0.55)', fontSize: 15,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Edit prompt"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleRegen(activeScene.id)}
                        disabled={isRegen}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: 'rgba(232,68,90,0.12)', border: '1px solid rgba(232,68,90,0.25)',
                          color: '#E8445A', fontSize: 16,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: isRegen ? 'default' : 'pointer',
                        }}
                        title="Regenerate"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <div style={{ padding: '0 20px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                Timeline
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Tap to preview · ↻ to regenerate</p>
            </div>

            {/* Duration bar */}
            <div style={{ padding: '0 20px', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 2, height: 3, borderRadius: 999, overflow: 'hidden' }}>
                {scenes.map((sc, i) => (
                  <div key={sc.id} style={{
                    flex: sc.duration,
                    background: i === activeIdx ? '#E8445A' : 'rgba(255,255,255,0.12)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
            </div>

            {/* Scene thumbnails */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
              {scenes.map((scene, i) => {
                const isActive = i === activeIdx;
                const isRegenThis = regenLoading.has(scene.id);
                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      width: 80, flexShrink: 0, cursor: 'pointer',
                      borderRadius: 12, overflow: 'hidden',
                      border: isActive ? '2px solid #E8445A' : '2px solid transparent',
                      boxShadow: isActive ? '0 0 0 1px rgba(232,68,90,0.3)' : 'none',
                      transition: 'all 0.18s', position: 'relative',
                    }}
                  >
                    {isRegenThis ? (
                      <div style={{ width: '100%', aspectRatio: '4/3', background: 'rgba(232,68,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(232,68,90,0.2)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
                      </div>
                    ) : (
                      <>
                        <img
                          src={`https://images.unsplash.com/${scene.unsplashId}?w=160&h=120&fit=crop&q=70`}
                          alt={`Scene ${i + 1}`}
                          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', filter: isActive ? 'none' : 'brightness(0.6)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: isActive ? 'none' : 'rgba(10,10,15,0.3)' }} />
                      </>
                    )}

                    {/* Scene number */}
                    <div style={{
                      position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center',
                      fontSize: 10, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}>
                      {i + 1}
                    </div>

                    {/* Regen button on thumbnail */}
                    <button
                      onClick={e => { e.stopPropagation(); setActiveIdx(i); handleRegen(scene.id); }}
                      style={{
                        position: 'absolute', top: 3, right: 3,
                        width: 20, height: 20, borderRadius: 6,
                        background: 'rgba(0,0,0,0.55)', border: 'none',
                        color: '#E8445A', fontSize: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', opacity: isActive ? 1 : 0.7,
                      }}
                    >
                      ↻
                    </button>
                  </div>
                );
              })}

              {/* Add scene button */}
              <div style={{
                width: 80, flexShrink: 0, aspectRatio: '4/3',
                borderRadius: 12, border: '2px dashed rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: 22,
              }}>
                +
              </div>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
