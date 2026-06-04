'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { TRACKS } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const DANCE_STYLES = [
  { id: 'tiktok', label: 'TikTok Viral', desc: 'Trending moves', emoji: '📱', color: '#10B981' },
  { id: 'hiphop', label: 'Hip-Hop', desc: 'Street energy', emoji: '🎤', color: '#8B5CF6' },
  { id: 'sexy', label: 'Sensual', desc: 'Slow & confident', emoji: '🔥', color: '#EC4899' },
  { id: 'freestyle', label: 'Freestyle', desc: 'AI chooses', emoji: '✨', color: '#F59E0B' },
];

const SAMPLE_PORTRAITS = [
  'photo-1534528741775-53994a69daeb',
  'photo-1524504388940-b1c1722653e0',
  'photo-1544005313-94ddf0286df2',
];

type Stage = 'upload' | 'style' | 'generating' | 'result';

export default function AIDancePage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [photoUrl, setPhotoUrl] = useState('');
  const [danceStyle, setDanceStyle] = useState('tiktok');
  const [trackId, setTrackId] = useState(TRACKS[0].id);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedStyle = DANCE_STYLES.find(s => s.id === danceStyle)!;
  const selectedTrack = TRACKS.find(t => t.id === trackId) || TRACKS[0];

  const cssAnim: Record<string, string> = {
    tiktok: 'translateX(6px) rotate(2deg)',
    hiphop: 'translateY(-8px) scale(1.04)',
    sexy: 'translateX(4px) translateY(-3px) rotate(1deg)',
    freestyle: 'scale(1.06) rotate(-1deg)',
  };

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ color: '#10B981', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>AI Dance</span>
        <div style={{ width: 50 }} />
      </div>

      <main style={{ padding: '24px 20px 0' }}>

        {/* Upload */}
        {stage === 'upload' && (
          <>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.5, marginBottom: 6 }}>Upload your photo</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>AI will make you dance to any beat</p>

            <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(16,185,129,0.4)', borderRadius: 22, padding: '48px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(16,185,129,0.05)', marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>💃</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F0FF', marginBottom: 6 }}>Tap to upload your photo</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Portrait works best</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoUrl(URL.createObjectURL(f)); setStage('style'); } }} />

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 12 }}>Or try a sample photo</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SAMPLE_PORTRAITS.map(id => (
                <div key={id} onClick={() => { setPhotoUrl(`https://images.unsplash.com/${id}?w=400&h=500&fit=crop`); setStage('style'); }} style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <img src={`https://images.unsplash.com/${id}?w=200&h=260&fit=crop&q=80`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Style + track */}
        {stage === 'style' && (
          <>
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'center' }}>
              <img src={photoUrl} alt="" style={{ width: 70, height: 90, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(16,185,129,0.3)' }} />
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>Choose your dance</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Pick a style and music</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {DANCE_STYLES.map(s => (
                <div key={s.id} onClick={() => setDanceStyle(s.id)} style={{ borderRadius: 16, padding: '16px', cursor: 'pointer', border: danceStyle === s.id ? `2px solid ${s.color}` : '1px solid rgba(255,255,255,0.08)', background: danceStyle === s.id ? `${s.color}15` : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.emoji}</div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF', marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>Music</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
              {TRACKS.map(t => (
                <button key={t.id} onClick={() => setTrackId(t.id)} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 999, border: trackId === t.id ? 'none' : '1px solid rgba(255,255,255,0.08)', background: trackId === t.id ? `linear-gradient(135deg,${t.color},${t.color}99)` : 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {t.title}
                </button>
              ))}
            </div>

            <button onClick={() => { setStage('generating'); setTimeout(() => setStage('result'), 2800); }} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#10B981,#34d399)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(16,185,129,0.4)' }}>
              {selectedStyle.emoji} Make Me Dance
            </button>
          </>
        )}

        {/* Generating */}
        {stage === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65svh', gap: 20 }}>
            <div style={{ position: 'relative', width: 120, height: 160, borderRadius: 20, overflow: 'hidden' }}>
              <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'pulse 0.6s ease-in-out infinite alternate' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,185,129,0.3), transparent)', animation: 'pulse 0.6s ease-in-out infinite alternate' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F0FF' }}>Teaching you to dance...</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{selectedStyle.label} · {selectedTrack.title}</p>
          </div>
        )}

        {/* Result */}
        {stage === 'result' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>You're dancing! 🕺</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{selectedStyle.label} · {selectedTrack.title}</p>

            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative', width: '60%', aspectRatio: '3/4', margin: '0 auto 20px' }}>
              <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: `dance-${danceStyle} 0.5s ease-in-out infinite alternate` }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,15,0.7))' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.85)', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                {selectedStyle.emoji} AI Dance
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg,${selectedTrack.color},${selectedTrack.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{selectedTrack.title}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStage('style')} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↻ Try again</button>
              <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#10B981,#34d399)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(16,185,129,0.4)' }}>Save & Share</button>
            </div>
          </>
        )}
      </main>
      <TabBar />
    </div>
  );
}
