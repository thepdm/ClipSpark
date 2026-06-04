'use client';

import { useState, useRef } from 'react';
import { TabBar } from '@/components/TabBar';

const FEED = [
  { id: 'r1', title: 'Back In The City', artist: 'sahxl506', genre: 'Hip-Hop', plays: '543K', likes: '2.9K', comments: '101', imageId: 'photo-1511671782779-c97d3d27a1d4', lyrics: ["now that I'm back in the city baby", "you say that you finished w me? 🖤 #remix"], color: '#F59E0B', duration: '1:54' },
  { id: 'r2', title: 'Golden Hour', artist: 'wave.loop', genre: 'Lo-Fi', plays: '1.2M', likes: '18K', comments: '432', imageId: 'photo-1493246507139-91e8fad9978e', lyrics: ['feel the light on my skin', 'nowhere else I wanna be ✨'], color: '#EC4899', duration: '2:43' },
  { id: 'r3', title: 'Neon Rain', artist: 'synthwave.ai', genre: 'Synthwave', plays: '887K', likes: '11K', comments: '289', imageId: 'photo-1519501025264-65ba15a82390', lyrics: ['city never sleeps tonight', 'neon in the pouring rain 🌧'], color: '#8B5CF6', duration: '3:04' },
  { id: 'r4', title: 'Maldives Dream', artist: 'aura.beats', genre: 'Ambient', plays: '2.1M', likes: '34K', comments: '671', imageId: 'photo-1573843981267-be1999ff37cd', lyrics: ['blue water, clear sky', 'time disappears here 🌊'], color: '#06B6D4', duration: '5:18' },
];

const GENRE_TAGS = ['trance', 'industrial', 'upbeat', 'dark pop', 'hip-hop', 'lo-fi', 'indie', 'electronic'];

const STYLE_TAGS = ['japanese', 'j-pop', 'lo-fi', 'cinematic'];

type RemixStage = null | 'simple' | 'advanced' | 'generating' | 'result';

export default function RemixPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [remixStage, setRemixStage] = useState<RemixStage>(null);
  const [genreInput, setGenreInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [styleDescription, setStyleDescription] = useState('A high-energy dance-pop track with strong house and electronic influences, set at a tempo of 124 BPM');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [vocalGender, setVocalGender] = useState<'male' | 'female'>('female');
  const [weirdness, setWeirdness] = useState(50);
  const [styleInfluence, setStyleInfluence] = useState(50);
  const [audioInfluence, setAudioInfluence] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultTrack, setResultTrack] = useState<typeof FEED[0] | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const track = FEED[activeIdx];

  const handleScroll = () => {
    if (!feedRef.current) return;
    const idx = Math.round(feedRef.current.scrollTop / window.innerHeight);
    setActiveIdx(Math.max(0, Math.min(idx, FEED.length - 1)));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setRemixStage('generating');
    setTimeout(() => {
      setIsGenerating(false);
      setResultTrack({ ...track, title: `${track.title} (${genreInput || selectedTags[0] || 'Remix'})`, color: '#EC4899' });
      setRemixStage('result');
    }, 2800);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div style={{ height: '100svh', background: '#000', overflow: 'hidden', position: 'relative' }}>

      {/* Swipeable feed */}
      <div
        ref={feedRef}
        onScroll={handleScroll}
        style={{ height: '100svh', overflowY: 'scroll', scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}
      >
        {FEED.map((item, i) => (
          <div key={item.id} style={{ height: '100svh', scrollSnapAlign: 'start', position: 'relative', flexShrink: 0 }}>
            {/* Background */}
            <img src={`https://images.unsplash.com/${item.imageId}?w=600&h=1100&fit=crop&q=80`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 35%, transparent 50%, rgba(0,0,0,0.85) 100%)' }} />

            {/* Top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {FEED.map((_, di) => (
                  <div key={di} style={{ width: di === activeIdx ? 20 : 6, height: 4, borderRadius: 999, background: di === activeIdx ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} />
                ))}
              </div>
              <button onClick={() => setRemixStage('simple')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>↺</span> Hook
              </button>
            </div>

            {/* Right actions */}
            <div style={{ position: 'absolute', right: 12, bottom: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 5 }}>
              {[{ icon: '♥', label: item.likes }, { icon: '💬', label: item.comments }, { icon: '↗', label: 'Share' }].map(a => (
                <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.icon}</button>
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{a.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div style={{ position: 'absolute', bottom: 90, left: 0, right: 68, padding: '0 16px', zIndex: 5 }}>
              <div style={{ marginBottom: 10 }}>
                {item.lyrics.map((line, li) => (
                  <p key={li} style={{ fontSize: 14, color: li === 0 ? item.color : 'rgba(255,255,255,0.75)', fontWeight: li === 0 ? 700 : 400, lineHeight: 1.6 }}>{line}</p>
                ))}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>@{item.artist}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>#{item.genre.toLowerCase().replace('-', '')} #aimusic</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${item.color},${item.color}88)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: i === activeIdx ? 'spin 4s linear infinite' : 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>▶ {item.plays} · {item.duration}</p>
                </div>
                <button onClick={() => setRemixStage('simple')} style={{ padding: '7px 14px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  ↺ Remix
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SIMPLE MODE */}
      {remixStage === 'simple' && (
        <>
          <div onClick={() => setRemixStage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 61, background: '#1A1A1A', borderRadius: '20px 20px 0 0', padding: '12px 0 0' }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />

            {/* Track row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg,${track.color},${track.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>↺</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {track.artist.toUpperCase()} - {track.title.toUpperCase().slice(0, 12)}...
              </p>
            </div>

            {/* Genre chips */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 16px', paddingBottom: 8 }}>
              <button onClick={() => setRemixStage('advanced')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                Advanced
              </button>
              {GENRE_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: '8px 14px', borderRadius: 999, flexShrink: 0, background: selectedTags.includes(tag) ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)', border: selectedTags.includes(tag) ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.12)', color: selectedTags.includes(tag) ? '#C4B5FD' : 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Text input */}
            <div style={{ padding: '8px 16px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                value={genreInput}
                onChange={e => setGenreInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe the style..."
                autoFocus
                style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 16, outline: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={handleGenerate} style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#EC4899,#F59E0B)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(236,72,153,0.5)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ADVANCED MODE */}
      {remixStage === 'advanced' && (
        <div style={{ position: 'fixed', inset: 0, background: '#111', zIndex: 70, overflowY: 'auto', paddingBottom: 100 }}>
          {/* Nav */}
          <div style={{ padding: '52px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setRemixStage('simple')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>↓</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Advanced</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>▼</span>
            </div>
            <button style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>v4.5-all ▼</button>
          </div>
          <p style={{ padding: '8px 16px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>20 credits</p>

          {/* Source track */}
          <div style={{ margin: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg,${track.color},${track.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{track.title}</p>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 999, position: 'relative' }}>
                <div style={{ width: '5%', height: '100%', background: '#fff', borderRadius: 999 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>0:00</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{track.duration}</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 16, cursor: 'pointer' }}>✕</button>
          </div>

          {/* Lyrics preview */}
          <div style={{ margin: '0 16px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Lyrics</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              {track.lyrics[0]} — {track.lyrics[1]}
            </p>
          </div>

          {/* Styles */}
          <div style={{ margin: '0 16px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Styles <span style={{ color: '#EC4899' }}>{styleDescription.length}/1,000</span></span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>↺</button>
                <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>🗑</button>
                <button style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontWeight: 700 }}>✦</button>
              </div>
            </div>
            <textarea
              value={styleDescription}
              onChange={e => setStyleDescription(e.target.value)}
              rows={4}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15, lineHeight: 1.6, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer' }}>↺</button>
              {STYLE_TAGS.map(tag => (
                <button key={tag} style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>{tag}</button>
              ))}
              <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>⊞</button>
            </div>
          </div>

          {/* More options */}
          <div style={{ margin: '0 16px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden' }}>
            <button onClick={() => setShowMoreOptions(!showMoreOptions)} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{showMoreOptions ? '↑' : '↓'}</span> More Options
            </button>
            {showMoreOptions && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Vocal Gender */}
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Vocal Gender</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['male', 'female'] as const).map(v => (
                      <button key={v} onClick={() => setVocalGender(v)} style={{ padding: '6px 14px', borderRadius: 999, background: vocalGender === v ? 'rgba(139,92,246,0.3)' : 'transparent', border: 'none', color: vocalGender === v ? '#C4B5FD' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{v}</button>
                    ))}
                  </div>
                </div>
                {/* Sliders */}
                {[
                  { label: 'Weirdness', value: weirdness, set: setWeirdness },
                  { label: 'Style Influence', value: styleInfluence, set: setStyleInfluence },
                  { label: 'Audio Influence', value: audioInfluence, set: setAudioInfluence },
                ].map(slider => (
                  <div key={slider.label} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', width: 100, flexShrink: 0 }}>{slider.label}</span>
                    <input type="range" min={0} max={100} value={slider.value} onChange={e => slider.set(Number(e.target.value))}
                      style={{ flex: 1, accentColor: '#EC4899', height: 4, cursor: 'pointer' }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', width: 36, textAlign: 'right' }}>{slider.value}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate button */}
          <div style={{ margin: '0 16px' }}>
            <button onClick={handleGenerate} style={{ width: '100%', padding: '18px', borderRadius: 999, background: 'linear-gradient(135deg, #EC4899, #F59E0B)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(236,72,153,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              Create Remix
            </button>
          </div>
        </div>
      )}

      {/* GENERATING */}
      {remixStage === 'generating' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, zIndex: 80 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(236,72,153,0.2)', borderTopColor: '#EC4899', animation: 'spin 0.85s linear infinite' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Creating your remix...</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{genreInput || selectedTags[0] || 'Generating'}</p>
        </div>
      )}

      {/* RESULT */}
      {remixStage === 'result' && resultTrack && (
        <>
          <div onClick={() => setRemixStage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 70 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 71, background: '#111', borderRadius: '20px 20px 0 0', padding: '16px 20px 48px', maxHeight: '70svh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />
            <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Remix ready ✓</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{resultTrack.title}</p>

            {/* Player */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#EC4899,#F59E0B)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{resultTrack.title}</p>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 999 }}>
                  <div style={{ width: '3%', height: '100%', background: '#fff', borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>0:00</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>2:09</span>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setRemixStage(null); }} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↺ Remix again</button>
              <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#EC4899,#F59E0B)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(236,72,153,0.4)' }}>Share ↗</button>
            </div>
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
