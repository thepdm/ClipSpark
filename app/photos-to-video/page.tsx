'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const TRANSITIONS = [
  { id: 'smooth', label: 'Smooth', desc: 'Seamless blend', icon: '〜' },
  { id: 'cinematic', label: 'Cinematic', desc: 'Film-style cuts', icon: '🎬' },
  { id: 'fast', label: 'Fast', desc: 'Snappy & energetic', icon: '⚡' },
];

type Stage = 'upload' | 'style' | 'generating' | 'result';

export default function PhotosToVideoPage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [photos, setPhotos] = useState<string[]>([]);
  const [transition, setTransition] = useState('smooth');
  const [activePreview, setActivePreview] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(f => URL.createObjectURL(f));
    setPhotos(prev => [...prev, ...urls].slice(0, 8));
  };

  const handleGenerate = () => {
    setStage('generating');
    const timer = setInterval(() => setActivePreview(p => (p + 1) % photos.length), 600);
    setTimeout(() => { clearInterval(timer); setStage('result'); }, 2800);
  };

  const SAMPLE_PHOTOS = [
    'photo-1534528741775-53994a69daeb',
    'photo-1516117172878-fd2c41f4a759',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1426604966848-d7adac402bff',
  ];

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>Photos to Video</span>
        <div style={{ width: 50 }} />
      </div>

      <main style={{ padding: '24px 20px 0' }}>
        {stage === 'upload' && (
          <>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.5, marginBottom: 8 }}>Add your photos</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Upload 2–8 photos in order — AI creates smooth transitions between them</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {photos.map((url, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 14, overflow: 'hidden' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 999, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{i+1}</div>
                  <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 5, right: 5, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
              {photos.length < 8 && (
                <div onClick={() => fileRef.current?.click()} style={{ aspectRatio: '1', borderRadius: 14, border: '2px dashed rgba(6,182,212,0.4)', background: 'rgba(6,182,212,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
                  <span style={{ fontSize: 24, color: 'rgba(6,182,212,0.6)' }}>+</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Add</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />

            {photos.length === 0 && (
              <>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 10 }}>Or try with sample photos</p>
                <button onClick={() => { setPhotos(SAMPLE_PHOTOS.map(id => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop`)); }} style={{ width: '100%', padding: '12px', borderRadius: 14, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: 'rgba(6,182,212,0.8)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Use sample photos
                </button>
              </>
            )}

            {photos.length >= 2 && (
              <button onClick={() => setStage('style')} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#06B6D4,#67e8f9)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(6,182,212,0.35)', marginTop: 8 }}>
                Continue ({photos.length} photos) →
              </button>
            )}
          </>
        )}

        {stage === 'style' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.4, marginBottom: 20 }}>Transition style</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {TRANSITIONS.map(t => (
                <div key={t.id} onClick={() => setTransition(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, cursor: 'pointer', border: transition === t.id ? '1.5px solid #06B6D4' : '1px solid rgba(255,255,255,0.08)', background: transition === t.id ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF' }}>{t.label}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.desc}</p>
                  </div>
                  {transition === t.id && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
                </div>
              ))}
            </div>

            <button onClick={handleGenerate} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#06B6D4,#67e8f9)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(6,182,212,0.35)' }}>
              ✨ Create Video
            </button>
          </>
        )}

        {stage === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65svh', gap: 20 }}>
            <div style={{ width: 120, height: 120, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(6,182,212,0.5)' }}>
              <img src={photos[activePreview]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F0FF' }}>Creating your video...</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Generating transitions...</p>
          </div>
        )}

        {stage === 'result' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>Your video is ready</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{photos.length} photos · {TRANSITIONS.find(t=>t.id===transition)?.label}</p>
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, aspectRatio: '9/16', maxWidth: 240, margin: '0 auto 20px', position: 'relative' }}>
              <img src={photos[activePreview % photos.length]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStage('style')} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↻ Redo</button>
              <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#06B6D4,#67e8f9)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(6,182,212,0.35)' }}>Save & Share</button>
            </div>
          </>
        )}
      </main>
      <TabBar />
    </div>
  );
}
