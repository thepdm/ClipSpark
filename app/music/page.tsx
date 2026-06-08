'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TRACKS, Track, generateAITracks } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const MOODS = ['Energetic', 'Calm', 'Confident', 'Dark', 'Playful', 'Epic', 'Romantic', 'Mysterious'];
const TEMPOS = ['Slow', 'Medium', 'Fast'];
const BAR_HEIGHTS = [40, 65, 30, 80, 55, 45, 70, 35, 85, 50, 45, 75, 30, 60, 85, 40, 55, 70, 45, 65];

function Waveform({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28, flex: 1 }}>
      {BAR_HEIGHTS.map((h, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          height: `${h}%`,
          background: active ? color : `${color}66`,
          animation: active ? `pulse ${0.6 + (i % 3) * 0.15}s ease-in-out infinite alternate` : 'none',
          animationDelay: `${i * 0.04}s`,
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  );
}

export default function MusicPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'library' | 'generate'>('library');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [activeMood, setActiveMood] = useState('All');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Generate tab state
  const [genDescription, setGenDescription] = useState('');
  const [genMoods, setGenMoods] = useState<string[]>([]);
  const [genTempo, setGenTempo] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<[Track, Track] | null>(null);

  const libraryMoods = ['All', ...Array.from(new Set(TRACKS.map(t => t.mood)))];
  const filtered = activeMood === 'All' ? TRACKS : TRACKS.filter(t => t.mood === activeMood);

  const handleGenerate = () => {
    if (genMoods.length === 0 && !genDescription.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedTracks(generateAITracks(genDescription, genMoods.length ? genMoods : ['Energetic'], genTempo));
      setIsGenerating(false);
    }, 2200);
  };

  const toggleGenMood = (mood: string) => {
    setGenMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  };

  const handleNext = () => {
    if (!selectedTrack) return;
    sessionStorage.setItem('clipspark_track', JSON.stringify(selectedTrack));
    router.push('/result');
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
        <Link href="/scenes" style={{ display: 'flex', alignItems: 'center', color: '#8B5CF6', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Music</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: '4px', background: 'rgba(139,92,246,0.07)', borderRadius: 14 }}>
          {(['library', 'generate'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#8B5CF6' : 'var(--text-2)',
                fontSize: 14, fontWeight: 700,
                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.18s',
              }}
            >
              {t === 'library' ? '🎵 Library' : '✨ Generate AI'}
            </button>
          ))}
        </div>

        {/* Selected track badge */}
        {selectedTrack && (
          <div style={{
            ...glass, borderRadius: 999, padding: '8px 14px 8px 8px',
            marginBottom: 16, boxShadow: 'var(--shadow-sm)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${selectedTrack.color}, ${selectedTrack.color}88)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{selectedTrack.title}</p>
              <p style={{ fontSize: 10, color: 'var(--text-2)' }}>{selectedTrack.source === 'ai_generated' ? '✨ AI Generated' : 'Library'} · {selectedTrack.bpm} BPM</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </div>
        )}

        {/* LIBRARY TAB */}
        {tab === 'library' && (
          <>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
              {libraryMoods.map(m => (
                <button key={m} onClick={() => setActiveMood(m)} style={{
                  padding: '6px 14px', borderRadius: 999, flexShrink: 0,
                  background: activeMood === m ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'var(--glass)',
                  backdropFilter: activeMood === m ? 'none' : 'blur(24px)',
                  WebkitBackdropFilter: activeMood === m ? 'none' : 'blur(24px)',
                  border: activeMood === m ? 'none' : '1px solid var(--glass-border)',
                  color: activeMood === m ? '#fff' : 'var(--text-2)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  boxShadow: activeMood === m ? '0 3px 12px rgba(139,92,246,0.28)' : 'none',
                  transition: 'all 0.18s',
                }}>
                  {m}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {filtered.map(track => {
                const isSelected = selectedTrack?.id === track.id;
                const isPlaying = playingId === track.id;
                return (
                  <div key={track.id} onClick={() => setSelectedTrack(track)} style={{
                    ...glass, borderRadius: 'var(--r-lg)', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                    border: isSelected ? '1.5px solid #8B5CF6' : '1px solid var(--glass-border)',
                    boxShadow: isSelected ? '0 4px 18px rgba(139,92,246,0.2)' : 'var(--shadow-sm)',
                    transition: 'all 0.18s',
                  }}>
                    <button
                      onClick={e => { e.stopPropagation(); setPlayingId(isPlaying ? null : track.id); setSelectedTrack(track); }}
                      style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${track.color}, ${track.color}99)`,
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 14px ${track.color}44`,
                      }}
                    >
                      {isPlaying ? (
                        <div style={{ display: 'flex', gap: 3 }}>
                          {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: 3, height: 12, background: '#fff', borderRadius: 2, animation: 'pulse 0.8s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      )}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>{track.title}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{track.genre}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{track.bpm} BPM</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{track.duration}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* GENERATE AI TAB */}
        {tab === 'generate' && (
          <div style={{ marginBottom: 24 }}>
            {!generatedTracks && !isGenerating && (
              <>
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Describe your track
                  </p>
                  <input
                    value={genDescription}
                    onChange={e => setGenDescription(e.target.value)}
                    placeholder="Upbeat summer pop, female vocals, 120bpm..."
                    style={{
                      width: '100%', padding: '13px 16px',
                      borderRadius: 'var(--r-lg)',
                      background: 'rgba(255,255,255,0.07)',
                      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid var(--glass-border)',
                      fontSize: 15, color: 'var(--text-1)', outline: 'none',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Mood <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--text-3)' }}>(pick one or more)</span>
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {MOODS.map(m => {
                      const active = genMoods.includes(m);
                      return (
                        <button key={m} onClick={() => toggleGenMood(m)} style={{
                          padding: '7px 14px', borderRadius: 999,
                          background: active ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'var(--glass)',
                          backdropFilter: active ? 'none' : 'blur(24px)',
                          WebkitBackdropFilter: active ? 'none' : 'blur(24px)',
                          border: active ? 'none' : '1px solid var(--glass-border)',
                          color: active ? '#fff' : 'var(--text-2)',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          boxShadow: active ? '0 3px 12px rgba(139,92,246,0.28)' : 'none',
                          transition: 'all 0.18s',
                        }}>
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Tempo
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {TEMPOS.map(t => (
                      <button key={t} onClick={() => setGenTempo(t)} style={{
                        flex: 1, padding: '12px 8px',
                        borderRadius: 'var(--r-lg)',
                        background: genTempo === t ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'var(--glass)',
                        backdropFilter: genTempo === t ? 'none' : 'blur(24px)',
                        WebkitBackdropFilter: genTempo === t ? 'none' : 'blur(24px)',
                        border: genTempo === t ? 'none' : '1px solid var(--glass-border)',
                        color: genTempo === t ? '#fff' : 'var(--text-2)',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}>
                        {t === 'Slow' ? '🐢 Slow' : t === 'Fast' ? '⚡ Fast' : '〰️ Medium'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={genMoods.length === 0 && !genDescription.trim()}
                  style={{
                    width: '100%', padding: '16px',
                    borderRadius: 'var(--r-xl)',
                    background: (genMoods.length > 0 || genDescription.trim()) ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(0,0,0,0.08)',
                    color: (genMoods.length > 0 || genDescription.trim()) ? '#fff' : 'var(--text-3)',
                    fontSize: 16, fontWeight: 700, border: 'none',
                    cursor: (genMoods.length > 0 || genDescription.trim()) ? 'pointer' : 'default',
                    boxShadow: (genMoods.length > 0 || genDescription.trim()) ? '0 6px 24px rgba(139,92,246,0.35)' : 'none',
                    transition: 'all 0.18s',
                  }}
                >
                  ✨ Generate Music
                </button>
              </>
            )}

            {isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
                  {BAR_HEIGHTS.slice(0, 12).map((h, i) => (
                    <div key={i} style={{
                      width: 6, borderRadius: 3,
                      height: `${h}%`,
                      background: `linear-gradient(to top, #8B5CF6, #EC4899)`,
                      animation: `pulse ${0.5 + (i % 3) * 0.15}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.06}s`,
                    }} />
                  ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Composing your track...</p>
                  <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI is generating 2 unique variants</p>
                </div>
              </div>
            )}

            {generatedTracks && !isGenerating && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Choose your variant</p>
                  <p style={{ fontSize: 13, color: 'var(--text-2)' }}>2 tracks generated — pick the one that fits your video</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {generatedTracks.map((track, idx) => {
                    const isSelected = selectedTrack?.id === track.id;
                    const isPlaying = playingId === track.id;
                    return (
                      <div key={track.id} onClick={() => setSelectedTrack(track)} style={{
                        ...glass, borderRadius: 'var(--r-xl)', padding: '16px',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid #8B5CF6' : '1px solid var(--glass-border)',
                        boxShadow: isSelected ? '0 4px 20px rgba(139,92,246,0.25)' : 'var(--shadow)',
                        transition: 'all 0.18s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <button
                            onClick={e => { e.stopPropagation(); setPlayingId(isPlaying ? null : track.id); setSelectedTrack(track); }}
                            style={{
                              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                              background: `linear-gradient(135deg, ${track.color}, ${track.color}99)`,
                              border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: `0 4px 14px ${track.color}44`,
                            }}
                          >
                            {isPlaying ? (
                              <div style={{ display: 'flex', gap: 3 }}>
                                {[0, 1, 2].map(i => (
                                  <div key={i} style={{ width: 3, height: 12, background: '#fff', borderRadius: 2, animation: 'pulse 0.8s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                                ))}
                              </div>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            )}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{track.title}</p>
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: 999 }}>AI ✨</span>
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{track.genre} · {track.bpm} BPM · {track.duration}</p>
                          </div>
                          {isSelected && (
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                          )}
                        </div>
                        <Waveform color={track.color} active={isPlaying} />
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => { setGeneratedTracks(null); setGenMoods([]); setGenDescription(''); }}
                  style={{
                    width: '100%', padding: '12px',
                    borderRadius: 'var(--r-lg)',
                    background: 'transparent', border: '1px solid var(--glass-border)',
                    color: 'var(--text-2)', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 4,
                  }}
                >
                  ↻ Generate again
                </button>
              </>
            )}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!selectedTrack}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 'var(--r-xl)',
            background: selectedTrack ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(0,0,0,0.08)',
            color: selectedTrack ? '#fff' : 'var(--text-3)',
            fontSize: 16, fontWeight: 700,
            border: 'none', cursor: selectedTrack ? 'pointer' : 'default',
            boxShadow: selectedTrack ? '0 6px 24px rgba(139,92,246,0.35)' : 'none',
            transition: 'all 0.18s',
          }}
        >
          Preview Video →
        </button>
      </main>

      <TabBar />
    </div>
  );
}
