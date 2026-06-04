'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const STYLES = [
  { id: 'neon', label: 'Neon', desc: 'Glowing city lights', filter: 'saturate(2) contrast(1.2) hue-rotate(280deg)', color: '#7C5CFC', preview: 'photo-1448375240586-882707db888b' },
  { id: 'noir', label: 'Film Noir', desc: 'Classic black & white', filter: 'grayscale(1) contrast(1.3)', color: '#888', preview: 'photo-1536440136628-849c177e76a1' },
  { id: 'anime', label: 'Anime', desc: 'Vibrant illustrated', filter: 'saturate(1.8) contrast(1.15) brightness(1.05)', color: '#10B981', preview: 'photo-1516117172878-fd2c41f4a759' },
  { id: 'cinematic', label: 'Cinematic', desc: 'Teal & orange grade', filter: 'saturate(1.4) contrast(1.1) sepia(0.15)', color: '#F59E0B', preview: 'photo-1426604966848-d7adac402bff' },
  { id: 'vintage', label: 'Vintage Film', desc: 'Faded 90s grain', filter: 'sepia(0.5) saturate(0.8) brightness(0.95)', color: '#D97706', preview: 'photo-1470071459604-3b5ec3a7fe05' },
  { id: 'golden', label: 'Golden Hour', desc: 'Warm sunset tones', filter: 'sepia(0.3) saturate(1.6) brightness(1.05)', color: '#F59E0B', preview: 'photo-1493246507139-91e8fad9978e' },
];

type Stage = 'upload' | 'style' | 'generating' | 'result';

export default function StyleTransferPage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
    setStage('style');
  };

  const currentStyle = STYLES.find(s => s.id === selectedStyle) || STYLES[0];

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>Style Transfer</span>
        <div style={{ width: 50 }} />
      </div>

      <main style={{ padding: '24px 20px 0' }}>
        {stage === 'upload' && (
          <>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.5, marginBottom: 8 }}>Upload your photo</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Choose a style and AI will apply it to create a stunning video</p>

            <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(245,158,11,0.4)', borderRadius: 20, padding: '50px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(245,158,11,0.05)', marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🎨</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F0FF', marginBottom: 6 }}>Upload photo or video</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>JPG, PNG, MP4</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFile} />

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 12 }}>Preview styles with a sample photo</p>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
              {STYLES.map(s => (
                <div key={s.id} onClick={() => setSelectedStyle(s.id)} style={{ flexShrink: 0, borderRadius: 12, overflow: 'hidden', width: 80, height: 80, border: selectedStyle === s.id ? `2px solid ${s.color}` : '2px solid transparent', cursor: 'pointer', position: 'relative' }}>
                  <img src={`https://images.unsplash.com/${s.preview}?w=160&h=160&fit=crop&q=70`} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: s.filter }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '3px 4px', fontSize: 8, fontWeight: 700, color: '#fff', textAlign: 'center' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button onClick={() => { setPhotoUrl(`https://images.unsplash.com/${currentStyle.preview}?w=600&h=800&fit=crop`); setStage('style'); }} style={{ width: '100%', padding: '14px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              Use sample photo
            </button>
          </>
        )}

        {stage === 'style' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3/4', maxHeight: 300, margin: '0 auto' }}>
                <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: currentStyle.filter, transition: 'filter 0.4s ease' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: `rgba(0,0,0,0.6)`, backdropFilter: 'blur(8px)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: currentStyle.color }}>
                  {currentStyle.label}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>Choose style</p>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setSelectedStyle(s.id)} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 999, border: selectedStyle === s.id ? 'none' : '1px solid rgba(255,255,255,0.1)', background: selectedStyle === s.id ? `linear-gradient(135deg,${s.color},${s.color}88)` : 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {s.label}
                </button>
              ))}
            </div>

            <button onClick={() => { setStage('generating'); setTimeout(() => setStage('result'), 2500); }} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#F59E0B,#FCD34D)', color: '#111', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(245,158,11,0.35)' }}>
              ✨ Apply Style
            </button>
          </>
        )}

        {stage === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65svh', gap: 20 }}>
            <div style={{ width: 110, height: 140, borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
              <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'pulse 1.2s ease-in-out infinite' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${currentStyle.color}44,transparent)`, animation: 'pulse 1.2s ease-in-out infinite' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F0FF' }}>Applying {currentStyle.label}...</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>AI is styling every frame</p>
          </div>
        )}

        {stage === 'result' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>Style applied ✓</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{currentStyle.label} · {currentStyle.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4' }}>
                <div style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.08)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>BEFORE</div>
                <img src={photoUrl} alt="" style={{ width: '100%', height: 'calc(100% - 22px)', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4', border: `1.5px solid ${currentStyle.color}44` }}>
                <div style={{ padding: '4px 8px', background: `${currentStyle.color}22`, fontSize: 10, fontWeight: 700, color: currentStyle.color, textAlign: 'center' }}>AFTER · {currentStyle.label}</div>
                <img src={photoUrl} alt="" style={{ width: '100%', height: 'calc(100% - 22px)', objectFit: 'cover', display: 'block', filter: currentStyle.filter }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStage('style')} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↻ Try another</button>
              <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#F59E0B,#FCD34D)', color: '#111', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(245,158,11,0.35)' }}>Save & Share</button>
            </div>
          </>
        )}
      </main>
      <TabBar />
    </div>
  );
}
