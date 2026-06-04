'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoryScenes, Scene, REGEN_POOL } from '@/lib/mockScenes';
import { TRACKS, Track, generateAITracks } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const PX_PER_SEC = 22;
const BAR_HEIGHTS = [40,65,30,80,55,45,70,35,85,50,45,75,30,60,85,40,55,70,45,65];

function StepBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, margin: '0 12px' }}>
      {[1,2,3,4].map(n => (
        <div key={n} style={{
          height: 3, borderRadius: 999,
          flex: n === 3 ? 2 : 1,
          background: n <= 3 ? '#8B5CF6' : 'rgba(139,92,246,0.15)',
        }} />
      ))}
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function Waveform({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 22, flex: 1 }}>
      {BAR_HEIGHTS.slice(0, 16).map((h, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2, height: `${h}%`,
          background: active ? color : `${color}55`,
          animation: active ? `pulse ${0.6 + (i % 3) * 0.15}s ease-in-out infinite alternate` : 'none',
          animationDelay: `${i * 0.04}s`,
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  );
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
  const [track, setTrack] = useState<Track>(TRACKS[0]);
  const [showMusicSheet, setShowMusicSheet] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [dialogues, setDialogues] = useState<Record<string, { speaker: string; text: string }[]>>({});
  const [showDialogueFor, setShowDialogueFor] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<NodeJS.Timeout | null>(null);

  const addDialogueLine = (sceneId: string, speaker: string) => {
    setDialogues(prev => ({
      ...prev,
      [sceneId]: [...(prev[sceneId] || []), { speaker, text: '' }],
    }));
  };

  const updateDialogueLine = (sceneId: string, idx: number, field: 'speaker' | 'text', value: string) => {
    setDialogues(prev => ({
      ...prev,
      [sceneId]: prev[sceneId].map((l, i) => i === idx ? { ...l, [field]: value } : l),
    }));
  };

  const removeDialogueLine = (sceneId: string, idx: number) => {
    setDialogues(prev => ({
      ...prev,
      [sceneId]: prev[sceneId].filter((_, i) => i !== idx),
    }));
  };

  useEffect(() => {
    const desc = sessionStorage.getItem('clipspark_description') || sessionStorage.getItem('clipspark_story') || '';
    const c = sessionStorage.getItem('clipspark_character');
    if (c) setCharacter(JSON.parse(c));
    setStory(desc);
    setTimeout(() => {
      setScenes(getStoryScenes(desc.split(' ').slice(0, 3).join(' ')));
      const idx = (desc.length % TRACKS.length);
      setTrack(TRACKS[idx]);
      setLoading(false);
    }, 1800);
  }, []);

  const totalDuration = scenes.reduce((s, sc) => s + sc.duration, 0);
  const sceneStartTimes = scenes.reduce<number[]>((acc, sc, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].duration);
    return acc;
  }, []);

  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return;
    playRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1;
        if (next >= totalDuration) { setIsPlaying(false); setMusicPlaying(false); return 0; }
        const idx = sceneStartTimes.findLastIndex(t => t <= next);
        if (idx >= 0) setActiveIdx(idx);
        return next;
      });
    }, 100);
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, scenes, totalDuration]);

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

  const handleRegenTrack = () => {
    setGenLoading(true);
    setTimeout(() => {
      const [a] = generateAITracks(story, ['Energetic'], 'Medium');
      setTrack({ ...a, id: 'regen-' + Date.now() });
      setGenLoading(false);
    }, 1800);
  };

  const handleExport = () => {
    sessionStorage.setItem('clipspark_scenes', JSON.stringify(scenes));
    sessionStorage.setItem('clipspark_track', JSON.stringify(track));
    router.push('/result');
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
        <Link href="/story" style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500, flexShrink: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <StepBar />
        <button
          onClick={handleExport}
          disabled={loading || scenes.length === 0}
          style={{
            flexShrink: 0, padding: '8px 16px', borderRadius: 999,
            background: loading ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            color: loading ? '#8B5CF6' : '#fff',
            fontSize: 13, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(139,92,246,0.35)',
          }}
        >
          Export →
        </button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2.5px solid rgba(139,92,246,0.18)', borderTopColor: '#8B5CF6', animation: 'spin 0.85s linear infinite' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#F0F0FF' }}>Building your storyboard...</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Scenes + music are being generated</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>

            {/* Character row */}
            {character && (
              <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={`https://images.unsplash.com/${character.imageId}?w=80&h=80&fit=crop&q=80`} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6' }}>{character.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{story}</p>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{scenes.length} scenes · {totalDuration}s</p>
              </div>
            )}

            {/* Video preview */}
            <div style={{ padding: '0 16px' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#000', width: '52%', aspectRatio: '9/16', margin: '0 auto' }}>
                {isRegen ? (
                  <div style={{ width: '100%', height: '100%', background: 'rgba(139,92,246,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6', animation: 'spin 0.85s linear infinite' }} />
                    <p style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 600 }}>Regenerating...</p>
                  </div>
                ) : activeScene ? (
                  <>
                    <img src={`https://images.unsplash.com/${activeScene.unsplashId}?w=600&h=900&fit=crop&q=80`} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.6))' }} />
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
                      <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 7, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                        {activeIdx + 1}/{scenes.length}
                      </span>
                      <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 7, padding: '3px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>
                        {activeScene.duration}s
                      </span>
                    </div>
                    {character && (
                      <div style={{ position: 'absolute', bottom: 10, left: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '3px 7px 3px 3px' }}>
                        <img src={`https://images.unsplash.com/${character.imageId}?w=40&h=40&fit=crop&q=80`} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: 9, fontWeight: 600, color: '#fff' }}>{character.name}</span>
                      </div>
                    )}
                    {/* Dialogue subtitle overlay */}
                    {dialogues[activeScene?.id]?.[0]?.text && (
                      <div style={{
                        position: 'absolute', bottom: 36, left: 8, right: 8,
                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                        borderRadius: 10, padding: '6px 10px', textAlign: 'center',
                      }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: '#8B5CF6', marginBottom: 2 }}>
                          {dialogues[activeScene.id][0].speaker}
                        </p>
                        <p style={{ fontSize: 11, color: '#fff', lineHeight: 1.3, fontStyle: 'italic' }}>
                          "{dialogues[activeScene.id][0].text}"
                        </p>
                      </div>
                    )}
                  </>
                ) : null}

                <button
                  onClick={() => {
                    const next = !isPlaying;
                    setIsPlaying(next);
                    setMusicPlaying(next);
                    if (next && currentTime === 0) setCurrentTime(sceneStartTimes[activeIdx] || 0);
                  }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  {isPlaying
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Playbar */}
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums', minWidth: 36 }}>
                {formatTime(currentTime)}
              </span>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 999, cursor: 'pointer', position: 'relative' }}
                onClick={e => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  const t = ((e.clientX - rect.left) / rect.width) * totalDuration;
                  setCurrentTime(t);
                  const idx = sceneStartTimes.findLastIndex(st => st <= t);
                  if (idx >= 0) setActiveIdx(idx);
                }}
              >
                <div style={{ height: '100%', width: `${(currentTime / totalDuration) * 100}%`, background: '#8B5CF6', borderRadius: 999, transition: 'width 0.1s linear' }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
                {formatTime(totalDuration)}
              </span>
            </div>

            {/* Scene prompt + actions */}
            <div style={{ padding: '0 16px 14px' }}>
              {editingId === activeScene?.id ? (
                <div>
                  <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} autoFocus rows={3}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1.5px solid #8B5CF6', color: '#F0F0FF', fontSize: 13, lineHeight: 1.5, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={saveEdit} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <p style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    {activeScene?.prompt}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => { if (activeScene) { setEditingId(activeScene.id); setEditPrompt(activeScene.prompt); } }}
                      style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => activeScene && handleRegen(activeScene.id)} disabled={isRegen}
                      style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#8B5CF6', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isRegen ? 'default' : 'pointer' }}>↻</button>
                    <button onClick={() => activeScene && handleDelete(activeScene.id)} disabled={scenes.length <= 1}
                      style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: scenes.length <= 1 ? 'default' : 'pointer' }}>🗑</button>
                  </div>
                </div>
              )}
            </div>

            {/* Dialogue panel */}
            {activeScene && (
              <div style={{ margin: '0 16px 14px' }}>
                <button
                  onClick={() => setShowDialogueFor(showDialogueFor === activeScene.id ? null : activeScene.id)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 12,
                    background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                    color: '#8B5CF6', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span>
                    💬 Dialogue
                    {(dialogues[activeScene.id]?.length || 0) > 0 && (
                      <span style={{ marginLeft: 8, fontSize: 11, background: 'rgba(139,92,246,0.2)', borderRadius: 999, padding: '1px 7px' }}>
                        {dialogues[activeScene.id].length} line{dialogues[activeScene.id].length > 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{showDialogueFor === activeScene.id ? '▲' : '▼'}</span>
                </button>

                {showDialogueFor === activeScene.id && (
                  <div style={{ marginTop: 8, background: 'rgba(139,92,246,0.06)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(139,92,246,0.15)' }}>
                    {(dialogues[activeScene.id] || []).map((line, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <input
                          value={line.speaker}
                          onChange={e => updateDialogueLine(activeScene.id, i, 'speaker', e.target.value)}
                          placeholder={character?.name || 'Speaker'}
                          style={{
                            width: 90, flexShrink: 0, padding: '7px 10px', borderRadius: 8,
                            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                            color: '#8B5CF6', fontSize: 11, fontWeight: 700, outline: 'none',
                            fontFamily: 'inherit',
                          }}
                        />
                        <input
                          value={line.text}
                          onChange={e => updateDialogueLine(activeScene.id, i, 'text', e.target.value)}
                          placeholder="What do they say..."
                          style={{
                            flex: 1, padding: '7px 10px', borderRadius: 8,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#F0F0FF', fontSize: 12, outline: 'none',
                            fontFamily: 'inherit', fontStyle: 'italic',
                          }}
                        />
                        <button onClick={() => removeDialogueLine(activeScene.id, i)} style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button
                        onClick={() => addDialogueLine(activeScene.id, character?.name || 'Character')}
                        style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(139,92,246,0.1)', border: '1px dashed rgba(139,92,246,0.3)', color: '#8B5CF6', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        + {character?.name || 'Character'}
                      </button>
                      <button
                        onClick={() => addDialogueLine(activeScene.id, 'Narrator')}
                        style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        + Narrator
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Music panel */}
            <div style={{ margin: '0 16px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 12px ${track.color}44` }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
                    {track.source === 'ai_generated' && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#8B5CF6', background: 'rgba(139,92,246,0.15)', borderRadius: 999, padding: '2px 5px', flexShrink: 0 }}>AI</span>
                    )}
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{track.genre} · {track.bpm} BPM</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={handleRegenTrack} disabled={genLoading}
                    style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', color: genLoading ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: genLoading ? 'default' : 'pointer' }}>
                    {genLoading ? <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'rgba(255,255,255,0.4)', animation: 'spin 0.85s linear infinite' }} /> : '↻'}
                  </button>
                  <button onClick={() => setShowMusicSheet(true)}
                    style={{ padding: '0 10px', height: 30, borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#8B5CF6', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Change
                  </button>
                </div>
              </div>
              {/* Waveform */}
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Waveform color={track.color} active={musicPlaying} />
              </div>
            </div>
          </div>

          {/* Fixed timeline */}
          <div style={{ flexShrink: 0, background: '#0D0D14', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Timeline</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>Tap to select · ↻ to regenerate</span>
            </div>
            <div ref={timelineRef} style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 12, position: 'relative' }}>
              {/* Time ruler */}
              <div style={{ display: 'flex', paddingLeft: 16, paddingRight: 16, marginBottom: 4 }}>
                {scenes.map((sc, i) => (
                  <div key={sc.id} style={{ width: sc.duration * PX_PER_SEC, flexShrink: 0, fontSize: 9, color: 'rgba(255,255,255,0.18)', paddingLeft: 4, fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(sceneStartTimes[i])}
                  </div>
                ))}
              </div>
              {/* Clips */}
              <div style={{ display: 'flex', gap: 3, paddingLeft: 16, paddingRight: 16, position: 'relative' }}>
                {/* Playhead */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 16 + playheadX, width: 2, background: '#FFD600', zIndex: 10, borderRadius: 1, pointerEvents: 'none', transition: 'left 0.1s linear' }}>
                  <div style={{ width: 8, height: 8, background: '#FFD600', borderRadius: '50%', position: 'absolute', top: -4, left: -3 }} />
                </div>
                {scenes.map((scene, i) => {
                  const isActive = i === activeIdx;
                  const isRegenThis = regenLoading.has(scene.id);
                  const clipW = scene.duration * PX_PER_SEC;
                  return (
                    <div key={scene.id} onClick={() => { setActiveIdx(i); setCurrentTime(sceneStartTimes[i]); }}
                      style={{ width: clipW, height: 72, flexShrink: 0, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: isActive ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.06)', boxShadow: isActive ? '0 0 14px rgba(139,92,246,0.35)' : 'none', transition: 'all 0.15s' }}>
                      {isRegenThis ? (
                        <div style={{ width: '100%', height: '100%', background: 'rgba(139,92,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6', animation: 'spin 0.85s linear infinite' }} />
                        </div>
                      ) : (
                        <>
                          <img src={`https://images.unsplash.com/${scene.unsplashId}?w=160&h=120&fit=crop&q=60`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isActive ? 'brightness(1)' : 'brightness(0.5)' }} />
                          <div style={{ position: 'absolute', inset: 0, background: isActive ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.35)' }} />
                        </>
                      )}
                      <span style={{ position: 'absolute', bottom: 4, left: 5, fontSize: 10, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.35)' }}>{i + 1}</span>
                      {clipW > 45 && <span style={{ position: 'absolute', bottom: 4, right: 5, fontSize: 9, color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }}>{scene.duration}s</span>}
                      <button onClick={e => { e.stopPropagation(); setActiveIdx(i); handleRegen(scene.id); }}
                        style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 5, background: 'rgba(0,0,0,0.6)', border: 'none', color: isActive ? '#8B5CF6' : 'rgba(255,255,255,0.35)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>↻</button>
                    </div>
                  );
                })}
                <div style={{ width: 44, height: 72, flexShrink: 0, borderRadius: 10, border: '2px dashed rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.18)', fontSize: 20 }}>+</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Music bottom sheet */}
      {showMusicSheet && (
        <>
          <div onClick={() => setShowMusicSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
            background: '#12121A', borderRadius: '20px 20px 0 0',
            border: '1px solid rgba(255,255,255,0.09)',
            padding: '16px 20px 40px',
            maxHeight: '70svh', overflowY: 'auto',
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.12)', margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F0FF' }}>Choose Music</p>
              <button onClick={() => setShowMusicSheet(false)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✕</button>
            </div>

            {/* AI Generate button */}
            <button onClick={() => { handleRegenTrack(); setShowMusicSheet(false); }}
              style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              ✨ Generate AI Track
            </button>

            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 10 }}>Library</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TRACKS.map(t => {
                const isSelected = track.id === t.id;
                return (
                  <div key={t.id} onClick={() => { setTrack(t); setShowMusicSheet(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: isSelected ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)', border: isSelected ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0FF', marginBottom: 2 }}>{t.title}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.genre} · {t.bpm} BPM · {t.duration}</p>
                    </div>
                    {isSelected && (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
