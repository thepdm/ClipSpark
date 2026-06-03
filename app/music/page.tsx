'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TRACKS, Track } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const MOODS = ['All', 'Energetic', 'Calm', 'Confident', 'Nostalgic', 'Cinematic', 'Happy'];

export default function MusicPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [activeMood, setActiveMood] = useState('All');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = activeMood === 'All' ? TRACKS : TRACKS.filter(t => t.mood === activeMood);

  const handleNext = () => {
    if (!selectedTrack) return;
    sessionStorage.setItem('clipai_track', JSON.stringify(selectedTrack));
    router.push('/result');
  };

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
        <Link href="/scenes" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Choose Music</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{
              flex: n <= 3 ? 'none' : 1,
              height: 3, borderRadius: 999,
              background: n <= 3 ? '#E8445A' : 'rgba(232,68,90,0.18)',
              width: n <= 3 ? 24 : undefined,
            }} />
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>Step 3 / 4</span>
        </div>

        {/* Mood filter */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
          {MOODS.map(m => (
            <button key={m} onClick={() => setActiveMood(m)} style={{
              padding: '6px 14px', borderRadius: 999, flexShrink: 0,
              background: activeMood === m ? 'linear-gradient(135deg, #E8445A, #FF8FA3)' : 'var(--glass)',
              backdropFilter: activeMood === m ? 'none' : 'blur(24px)',
              WebkitBackdropFilter: activeMood === m ? 'none' : 'blur(24px)',
              border: activeMood === m ? 'none' : '1px solid var(--glass-border)',
              color: activeMood === m ? '#fff' : 'var(--text-2)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              boxShadow: activeMood === m ? '0 3px 12px rgba(232,68,90,0.28)' : 'none',
              transition: 'all 0.18s',
            }}>
              {m}
            </button>
          ))}
        </div>

        {/* Track list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {filtered.map(track => {
            const isSelected = selectedTrack?.id === track.id;
            const isPlaying = playingId === track.id;
            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                style={{
                  ...glass,
                  borderRadius: 'var(--r-lg)',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                  border: isSelected ? `1.5px solid #E8445A` : '1px solid var(--glass-border)',
                  boxShadow: isSelected ? '0 4px 18px rgba(232,68,90,0.2)' : 'var(--shadow-sm)',
                  transition: 'all 0.18s',
                }}
              >
                {/* Color dot / play button */}
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
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width: 3, height: 12, background: '#fff', borderRadius: 2, animation: 'pulse 0.8s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>

                {/* Info */}
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

                {/* Selected checkmark */}
                {isSelected && (
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#E8445A', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedTrack}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 'var(--r-xl)',
            background: selectedTrack ? 'linear-gradient(135deg, #E8445A, #FF8FA3)' : 'rgba(0,0,0,0.08)',
            color: selectedTrack ? '#fff' : 'var(--text-3)',
            fontSize: 16, fontWeight: 700,
            border: 'none', cursor: selectedTrack ? 'pointer' : 'default',
            boxShadow: selectedTrack ? '0 6px 24px rgba(232,68,90,0.35)' : 'none',
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
