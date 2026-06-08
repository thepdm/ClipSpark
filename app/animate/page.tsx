'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const GALLERY_PHOTOS = [
  'photo-1534528741775-53994a69daeb',
  'photo-1516117172878-fd2c41f4a759',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1544005313-94ddf0286df2',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1426604966848-d7adac402bff',
  'photo-1469474968028-56623f02e42e',
  'photo-1447752875215-b2761acb3c5d',
];

const PROMPT_EXAMPLES = [
  'Butterflies fly and shimmer in all colors of the rainbow',
  'The wind gently moves the hair, golden light',
  'Slow zoom in, dreamy blur effect',
  'Petals fall like snow around her',
];

type Stage = 'idle' | 'generating' | 'result';

export default function AnimatePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [resultUrl, setResultUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedPhoto(URL.createObjectURL(file));
  };

  const handleGenerate = () => {
    if (!selectedPhoto || !prompt.trim()) return;
    setStage('generating');
    setResultUrl(selectedPhoto);
    setTimeout(() => setStage('result'), 2800);
  };

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>

      {/* Nav */}
      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: '#F0F0FF' }}>Studio</span>
        <div style={{ width: 20 }} />
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* Upload / Preview area */}
        {!selectedPhoto ? (
          <div onClick={() => fileRef.current?.click()} style={{ borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '52px 20px', cursor: 'pointer', marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Upload a photo<br />to create a video</p>
          </div>
        ) : (
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
            <img src={selectedPhoto} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)' }}>
              <button onClick={() => { setSelectedPhoto(null); setStage('idle'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 999, background: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>↺</span> Replace
              </button>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

        {/* Gallery strip */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 2 }}>
          {GALLERY_PHOTOS.map(id => (
            <div key={id} onClick={() => { setSelectedPhoto(`https://images.unsplash.com/${id}?w=600&h=600&fit=crop`); setStage('idle'); }} style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: selectedPhoto?.includes(id) ? '2.5px solid #8B5CF6' : '2px solid transparent', transition: 'border 0.15s' }}>
              <img src={`https://images.unsplash.com/${id}?w=144&h=144&fit=crop&q=70`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>

        {/* Prompt field */}
        <div style={{ borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20, overflow: 'hidden' }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`Come up with a story. For example: ${PROMPT_EXAMPLES[0]}`}
            rows={3}
            style={{ width: '100%', padding: '16px 16px 8px', background: 'transparent', border: 'none', outline: 'none', color: '#F0F0FF', fontSize: 14, lineHeight: 1.55, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 12px 10px' }}>
            <button
              onClick={handleGenerate}
              disabled={!selectedPhoto || !prompt.trim() || stage === 'generating'}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: selectedPhoto && prompt.trim() ? 'linear-gradient(135deg,#8B5CF6,#EC4899)' : 'rgba(255,255,255,0.1)',
                border: 'none', cursor: selectedPhoto && prompt.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: selectedPhoto && prompt.trim() ? '0 3px 12px rgba(139,92,246,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {stage === 'generating'
                ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.85s linear infinite' }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              }
            </button>
          </div>
          {/* Quick prompts */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 12px 12px' }}>
            {PROMPT_EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setPrompt(ex)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {ex.length > 24 ? ex.slice(0, 24) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {stage === 'result' && (
          <div style={{ marginBottom: 20, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(139,92,246,0.4)', position: 'relative' }}>
            <img src={resultUrl} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', animation: 'pulse 3s ease-in-out infinite alternate' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(10,10,15,0.7))' }} />
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(139,92,246,0.85)', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#fff' }}>✨ Animated</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 14px', display: 'flex', gap: 8 }}>
              <button onClick={() => setStage('idle')} style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>↻ Redo</button>
              <button onClick={async () => { try { await navigator.share({ title: 'My animated photo', text: 'Created with ClipSpark' }); } catch {} }} style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save & Share</button>
            </div>
          </div>
        )}

      </div>

      <TabBar />
    </div>
  );
}
