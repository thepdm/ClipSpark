'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoryScenes, Scene, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const PX_PER_SEC = 22;

function StepBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, margin: '0 12px' }}>
      {[1,2,3,4,5].map(n => (
        <div key={n} style={{
          height: 3, borderRadius: 999,
          flex: n === 3 ? 2 : 1,
          background: n <= 3 ? '#E8445A' : 'rgba(232,68,90,0.15)',
        }} />
      ))}
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ScenesPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<{ name: string; imageId: string } | null>(null);
  const [story, setStory] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [regenLoading, setRegenLoading] = useState<Set<string>>(new Set());
  const [regenPool, setRegenPool] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<NodeJS.Timeout | null>(null);

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

  const totalDuration = scenes.reduce((s, sc) => s + sc.duration, 0);

  const sceneStartTimes = scenes.reduce<number[]>((acc, sc, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].duration);
    return acc;
  }, []);

  // Advance playhead
  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return;
    playRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1;
        if (next >= totalDuration) { setIsPlaying(false); return 0; }
        // Update active scene
        const idx = sceneStartTimes.findLastIndex(t => t <= next);
        if (idx >= 0) setActiveIdx(idx);
        return next;
      });
    }, 100);
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, scenes, totalDuration]);

  // Scroll timeline to active clip
  useEffect(() => {
    if (!timelineRef.current || scenes.length === 0) return;
    const offset = sceneStartTimes[activeIdx] * PX_PER_SEC;
    timelineRef.current.scrollTo({ left: offset - 20, behavior: 'smooth' });
  }, [activeIdx]);

  const handleRegen = (sceneId: string) => {
    setRegenLoading(prev => new Set(prev).add(sceneId));
    setTimeout(() => {
      setScenes(prev => prev.map(s => {
        if (s.id !== sceneId) return s;
        const idx = (regenPool[sceneId] || 0) % REGEN_POOL.length;
        setRegenPool(p => ({ ...p, [sceneId]: idx + 1 }));
        return { ...s, unsplashId: REGEN_POOL[idx], regenCount: s.regenCount + 1 };
      }));
      setRegenLoading(prev => { const n = new Set(prev); n.delete(sceneId); return n; });
    }, 1500);
  };

  const handleDelete = (sceneId: string) => {
    const idx = scenes.findIndex(s => s.id === sceneId);
    setScenes(prev => prev.filter(s => s.id !== sceneId));
    setActiveIdx(Math.max(0, idx - 1));
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
  const playheadX = currentTime * PX_PER_SEC;

  return (
    <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: '#0A0A0F', overflow: 'hidden' }}>

      {/* Nav */}
      <div style={{
        flexShrink: 0, padding: '12px 16px 10px',
        display: 'flex', alignItems: 'center',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Link href="/story" style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500, flexShrink: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <StepBar />
        <button
          onClick={handleNext}
          disabled={loading || scenes.length === 0}
          style={{
            flexShrink: 0, padding: '8px 16px', borderRadius: 999,
            background: loading ? 'rgba(232,68,90,0.15)' : 'linear-gradient(135deg, #E8445A, #FF8FA3)',
            color: loading ? '#E8445A' : '#fff',
            fontSize: 13, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(232,68,90,0.35)',
          }}
        >
          Music →
        </button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.18)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>Building your storyboard...</p>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI is generating scenes from your story</p>
        </div>
      ) : (
        <>
          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>

            {/* Character row */}
            {character && (
              <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={`https://images.unsplash.com/${character.imageId}?w=80&h=80&fit=crop&q=80`} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E8445A' }}>{character.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{story}</p>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{scenes.length} scenes · {totalDuration}s</p>
              </div>
            )}

            {/* Video preview */}
            <div style={{ padding: '0 16px' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#000', width: '52%', aspectRatio: '9/16', margin: '0 auto' }}>
                {isRegen ? (
                  <div style={{ width: '100%', height: '100%', background: 'rgba(232,68,90,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.2)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
                    <p style={{ fontSize: 13, color: '#E8445A', fontWeight: 600 }}>Regenerating scene {activeIdx + 1}...</p>
                  </div>
                ) : activeScene ? (
                  <>
                    <img
                      src={`https://images.unsplash.com/${activeScene.unsplashId}?w=800&h=450&fit=crop&q=80`}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.6))' }} />
                    {/* Scene badge */}
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                      <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        Scene {activeIdx + 1} / {scenes.length}
                      </span>
                      <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#fff' }}>
                        {activeScene.duration}s
                      </span>
                    </div>
                    {/* Character avatar */}
                    {character && (
                      <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '3px 8px 3px 3px' }}>
                        <img src={`https://images.unsplash.com/${character.imageId}?w=40&h=40&fit=crop&q=80`} alt="" style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{character.name}</span>
                      </div>
                    )}
                  </>
                ) : null}

                {/* Play button overlay */}
                <button
                  onClick={() => { setIsPlaying(p => !p); if (!isPlaying) setCurrentTime(sceneStartTimes[activeIdx]); }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  {isPlaying
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Playbar */}
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(Math.round(currentTime))} / {formatTime(totalDuration)}
              </span>
              <div
                style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 999, cursor: 'pointer', position: 'relative' }}
                onClick={e => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  const t = ratio * totalDuration;
                  setCurrentTime(t);
                  const idx = sceneStartTimes.findLastIndex(st => st <= t);
                  if (idx >= 0) setActiveIdx(idx);
                }}
              >
                <div style={{ height: '100%', width: `${(currentTime / totalDuration) * 100}%`, background: '#E8445A', borderRadius: 999, transition: 'width 0.1s linear' }} />
              </div>
            </div>

            {/* Active scene prompt + actions */}
            <div style={{ padding: '0 16px 12px' }}>
              {editingId === activeScene?.id ? (
                <div>
                  <textarea
                    value={editPrompt}
                    onChange={e => setEditPrompt(e.target.value)}
                    autoFocus
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.07)', border: '1.5px solid #E8445A',
                      color: '#F0F0FF', fontSize: 13, lineHeight: 1.5,
                      resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={saveEdit} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#E8445A,#FF8FA3)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <p style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    {activeScene?.prompt}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => { if (activeScene) { setEditingId(activeScene.id); setEditPrompt(activeScene.prompt); } }}
                      style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      ✏️
                    </button>
                    <button onClick={() => activeScene && handleRegen(activeScene.id)} disabled={isRegen}
                      style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,68,90,0.12)', border: '1px solid rgba(232,68,90,0.25)', color: '#E8445A', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isRegen ? 'default' : 'pointer' }}>
                      ↻
                    </button>
                    <button onClick={() => activeScene && handleDelete(activeScene.id)} disabled={scenes.length <= 1}
                      style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: scenes.length <= 1 ? 'default' : 'pointer' }}>
                      🗑
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed timeline */}
          <div style={{
            flexShrink: 0,
            background: '#0D0D14',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Timeline label */}
            <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Timeline</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Tap scene to select</span>
            </div>

            {/* Time ruler + clips */}
            <div
              ref={timelineRef}
              style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 12, position: 'relative' }}
            >
              {/* Time ruler */}
              <div style={{ display: 'flex', paddingLeft: 16, paddingRight: 16, marginBottom: 4, position: 'sticky', top: 0, zIndex: 2 }}>
                {scenes.map((sc, i) => (
                  <div key={sc.id} style={{ width: sc.duration * PX_PER_SEC, flexShrink: 0, fontSize: 9, color: 'rgba(255,255,255,0.2)', paddingLeft: 4, fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(sceneStartTimes[i])}
                  </div>
                ))}
              </div>

              {/* Clips row */}
              <div style={{ display: 'flex', gap: 3, paddingLeft: 16, paddingRight: 16, position: 'relative' }}>
                {/* Playhead */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: 16 + playheadX,
                  width: 2, background: '#FFD600', zIndex: 10,
                  borderRadius: 1, pointerEvents: 'none',
                  transition: 'left 0.1s linear',
                }}>
                  <div style={{ width: 8, height: 8, background: '#FFD600', borderRadius: '50%', position: 'absolute', top: -4, left: -3 }} />
                </div>

                {scenes.map((scene, i) => {
                  const isActive = i === activeIdx;
                  const isRegenThis = regenLoading.has(scene.id);
                  const clipW = scene.duration * PX_PER_SEC;
                  return (
                    <div
                      key={scene.id}
                      onClick={() => { setActiveIdx(i); setCurrentTime(sceneStartTimes[i]); }}
                      style={{
                        width: clipW, height: 72, flexShrink: 0, borderRadius: 10,
                        overflow: 'hidden', cursor: 'pointer', position: 'relative',
                        border: isActive ? '2px solid #E8445A' : '2px solid rgba(255,255,255,0.06)',
                        boxShadow: isActive ? '0 0 14px rgba(232,68,90,0.35)' : 'none',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                      }}
                    >
                      {isRegenThis ? (
                        <div style={{ width: '100%', height: '100%', background: 'rgba(232,68,90,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(232,68,90,0.2)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
                        </div>
                      ) : (
                        <>
                          <img
                            src={`https://images.unsplash.com/${scene.unsplashId}?w=160&h=120&fit=crop&q=60`}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isActive ? 'brightness(1)' : 'brightness(0.55)' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: isActive ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.35)' }} />
                        </>
                      )}

                      {/* Scene number */}
                      <span style={{ position: 'absolute', bottom: 4, left: 5, fontSize: 10, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                        {i + 1}
                      </span>

                      {/* Duration */}
                      {clipW > 45 && (
                        <span style={{ position: 'absolute', bottom: 4, right: 5, fontSize: 9, color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
                          {scene.duration}s
                        </span>
                      )}

                      {/* Regen button */}
                      <button
                        onClick={e => { e.stopPropagation(); setActiveIdx(i); handleRegen(scene.id); }}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 18, height: 18, borderRadius: 5,
                          background: 'rgba(0,0,0,0.6)', border: 'none',
                          color: isActive ? '#E8445A' : 'rgba(255,255,255,0.4)',
                          fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        ↻
                      </button>
                    </div>
                  );
                })}

                {/* Add scene */}
                <div style={{
                  width: 44, height: 72, flexShrink: 0, borderRadius: 10,
                  border: '2px dashed rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 20,
                }}>
                  +
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
