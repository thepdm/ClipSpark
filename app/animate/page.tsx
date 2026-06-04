'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const STYLES = [
  { id: 'parallax', label: 'Parallax', desc: 'Depth & layers', icon: '✦' },
  { id: 'drift', label: 'Drift', desc: 'Slow float', icon: '〰' },
  { id: 'zoom', label: 'Zoom In', desc: 'Pull forward', icon: '⊕' },
  { id: 'wind', label: 'Wind', desc: 'Hair & fabric', icon: '~' },
];
const DURATIONS = ['3s', '5s', '8s'];

type Stage = 'upload' | 'style' | 'generating' | 'result';

export default function AnimatePage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('parallax');
  const [duration, setDuration] = useState('5s');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setStage('style');
  };

  const handleGenerate = () => {
    setStage('generating');
    setTimeout(() => setStage('result'), 2500);
  };

  const cssAnimation: Record<string, string> = {
    parallax: 'scale(1.08) translateY(-4px)',
    drift: 'translateX(6px) translateY(-3px)',
    zoom: 'scale(1.15)',
    wind: 'scale(1.04) rotate(0.5deg)',
  };

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>Animate Photo</span>
        <div style={{ width: 50 }} />
      </div>

      <main style={{ padding: '24px 20px 0' }}>
        {stage === 'upload' && (
          <>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.5, marginBottom: 8 }}>Upload your photo</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>AI will add motion and make it come alive</p>
            <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(124,92,252,0.4)', borderRadius: 20, padding: '60px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(124,92,252,0.06)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F0FF', marginBottom: 6 }}>Tap to upload</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>JPG, PNG — any portrait photo</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 20 }}>
              {['photo-1534528741775-53994a69daeb','photo-1544005313-94ddf0286df2','photo-1524504388940-b1c1722653e0'].map(id => (
                <div key={id} onClick={() => { setPhotoUrl(`https://images.unsplash.com/${id}?w=400&h=500&fit=crop`); setStage('style'); }} style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4' }}>
                  <img src={`https://images.unsplash.com/${id}?w=200&h=260&fit=crop&q=80`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 8 }}>Or pick a sample photo above</p>
          </>
        )}

        {stage === 'style' && (
          <>
            <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
              <img src={photoUrl} alt="" style={{ width: 90, height: 120, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.4, marginBottom: 6 }}>Choose style</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>How should AI animate your photo?</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {STYLES.map(s => (
                <div key={s.id} onClick={() => setSelectedStyle(s.id)} style={{ borderRadius: 16, padding: '16px', cursor: 'pointer', border: selectedStyle === s.id ? '2px solid #7C5CFC' : '1px solid rgba(255,255,255,0.08)', background: selectedStyle === s.id ? 'rgba(124,92,252,0.12)' : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF', marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>Duration</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: duration === d ? 'none' : '1px solid rgba(255,255,255,0.08)', background: duration === d ? 'linear-gradient(135deg,#7C5CFC,#a78bfa)' : 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{d}</button>
              ))}
            </div>
            <button onClick={handleGenerate} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#7C5CFC,#a78bfa)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(124,92,252,0.4)' }}>
              ✨ Animate
            </button>
          </>
        )}

        {stage === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65svh', gap: 20 }}>
            <div style={{ position: 'relative', width: 120, height: 160, borderRadius: 20, overflow: 'hidden' }}>
              <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,92,252,0.3), transparent)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F0FF' }}>Animating your photo...</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>AI is adding {STYLES.find(s=>s.id===selectedStyle)?.label} motion</p>
          </div>
        )}

        {stage === 'result' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>Your animated photo</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{STYLES.find(s=>s.id===selectedStyle)?.label} · {duration}</p>
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative', aspectRatio: '3/4', maxHeight: 420, margin: '0 auto 20px', display: 'block' }}>
              <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: `float-${selectedStyle} 3s ease-in-out infinite alternate`, transition: 'transform 3s ease-in-out' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,15,0.6))' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(124,92,252,0.8)', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#fff' }}>✨ AI Animated</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStage('style')} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↻ Try another</button>
              <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#7C5CFC,#a78bfa)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(124,92,252,0.4)' }}>Save & Share</button>
            </div>
          </>
        )}
      </main>
      <TabBar />
    </div>
  );
}
