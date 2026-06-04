'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/TabBar';

const TRACKS_FEED = [
  {
    id: 'r1',
    title: 'Back In The City',
    artist: 'sahxl506',
    genre: 'Hip-Hop',
    plays: '543K',
    likes: '2.9K',
    comments: '101',
    imageId: 'photo-1511671782779-c97d3d27a1d4',
    lyrics: ['now that I\'m back in the city baby', 'you say that you finished w me? 🖤'],
    color: '#F59E0B',
  },
  {
    id: 'r2',
    title: 'Golden Hour',
    artist: 'AI Composer',
    genre: 'Lo-Fi',
    plays: '1.2M',
    likes: '18K',
    comments: '432',
    imageId: 'photo-1493246507139-91e8fad9978e',
    lyrics: ['feel the light on my skin', 'nowhere else I wanna be'],
    color: '#EC4899',
  },
  {
    id: 'r3',
    title: 'Neon Rain',
    artist: 'synthwave.ai',
    genre: 'Synthwave',
    plays: '887K',
    likes: '11K',
    comments: '289',
    imageId: 'photo-1519501025264-65ba15a82390',
    lyrics: ['city never sleeps tonight', 'neon in the pouring rain'],
    color: '#8B5CF6',
  },
  {
    id: 'r4',
    title: 'Maldives Dream',
    artist: 'wave.loop',
    genre: 'Ambient',
    plays: '2.1M',
    likes: '34K',
    comments: '671',
    imageId: 'photo-1573843981267-be1999ff37cd',
    lyrics: ['blue water, clear sky', 'time disappears here'],
    color: '#06B6D4',
  },
];

const REMIX_OPTIONS = [
  { id: 'style', label: 'Change Style', desc: 'Keep the vibe, flip the genre', icon: '🎨' },
  { id: 'lyrics', label: 'Add Lyrics', desc: 'Write your own words', icon: '✍️' },
  { id: 'continue', label: 'Continue Song', desc: 'AI adds the next part', icon: '▶️' },
  { id: 'collab', label: 'Duet', desc: 'Add your voice over it', icon: '🎤' },
];

export default function RemixPage() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [showRemixSheet, setShowRemixSheet] = useState(false);
  const [selectedRemix, setSelectedRemix] = useState('style');
  const [isGenerating, setIsGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const track = TRACKS_FEED[activeIdx];

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowRemixSheet(false);
    setTimeout(() => { setIsGenerating(false); setDone(true); }, 2500);
  };

  return (
    <div style={{ height: '100svh', background: '#000', overflow: 'hidden', position: 'relative' }}>

      {/* Full screen background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={`https://images.unsplash.com/${track.imageId}?w=600&h=1100&fit=crop&q=80`}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.8) 100%)' }} />
      </div>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        {/* Pagination dots */}
        <div style={{ display: 'flex', gap: 5 }}>
          {TRACKS_FEED.map((_, i) => (
            <div key={i} onClick={() => { setActiveIdx(i); setDone(false); }} style={{ width: i === activeIdx ? 20 : 6, height: 4, borderRadius: 999, background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
        <button
          onClick={() => setShowRemixSheet(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 999,
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 16 }}>↺</span> Remix
        </button>
      </div>

      {/* Right actions */}
      <div style={{ position: 'absolute', right: 12, bottom: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 10 }}>
        {[
          { icon: '♥', label: track.likes },
          { icon: '💬', label: track.comments },
          { icon: '↗', label: 'Share' },
        ].map(a => (
          <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {a.icon}
            </button>
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 68, padding: '0 16px', zIndex: 10 }}>
        {/* Lyrics */}
        <div style={{ marginBottom: 12 }}>
          {track.lyrics.map((line, i) => (
            <p key={i} style={{ fontSize: 14, color: i === 0 ? track.color : 'rgba(255,255,255,0.7)', fontWeight: i === 0 ? 700 : 500, lineHeight: 1.5, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {line}
            </p>
          ))}
        </div>

        {/* Author */}
        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>@{track.artist}</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>#{track.genre.toLowerCase()} #remix #aimusic</p>

        {/* Track player bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)',
          borderRadius: 14, padding: '10px 14px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${track.color},${track.color}88)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 4s linear infinite' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 1 }}>{track.title}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>▶ {track.plays}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              +
            </button>
            <button
              onClick={() => setShowRemixSheet(true)}
              style={{ padding: '6px 12px', borderRadius: 999, background: `linear-gradient(135deg,#8B5CF6,#EC4899)`, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              ↺ Remix
            </button>
          </div>
        </div>
      </div>

      {/* Generating overlay */}
      {isGenerating && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 50 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6', animation: 'spin 0.85s linear infinite' }} />
          <p style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Creating your remix...</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{REMIX_OPTIONS.find(r => r.id === selectedRemix)?.label}</p>
        </div>
      )}

      {/* Done toast */}
      {done && (
        <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(12px)', borderRadius: 999, padding: '10px 20px', zIndex: 50, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>✓</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>Remix ready! Share it</span>
        </div>
      )}

      {/* Remix bottom sheet */}
      {showRemixSheet && (
        <>
          <div onClick={() => setShowRemixSheet(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 61, background: '#12121A', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px 48px' }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.12)', margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${track.color},${track.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>{track.title}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>@{track.artist} · {track.genre}</p>
              </div>
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>How to remix?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {REMIX_OPTIONS.map(opt => (
                <div key={opt.id} onClick={() => setSelectedRemix(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, cursor: 'pointer', border: selectedRemix === opt.id ? '1.5px solid #8B5CF6' : '1px solid rgba(255,255,255,0.08)', background: selectedRemix === opt.id ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF' }}>{opt.label}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{opt.desc}</p>
                  </div>
                  {selectedRemix === opt.id && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
                </div>
              ))}
            </div>

            <button onClick={handleGenerate} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(139,92,246,0.4)' }}>
              ↺ Create Remix
            </button>
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
