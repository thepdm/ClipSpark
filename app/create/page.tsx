'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const EXAMPLES = [
  'A girl walks along the Maldives beach at golden hour',
  'TikTok dance in a neon-lit studio, trending moves',
  'B&W fashion shoot in Paris streets at night',
  'Girl in a fur coat walking through snowy city',
  'Rooftop sunset, wind in hair, city lights below',
];

const FORMATS = [
  { id: 'reels', label: 'Reels', sub: '9:16' },
  { id: 'cinematic', label: 'Film', sub: '16:9' },
  { id: 'square', label: 'Square', sub: '1:1' },
];

export default function CreatePage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [refPhoto, setRefPhoto] = useState<string | null>(null);
  const [refName, setRefName] = useState('');
  const [format, setFormat] = useState('reels');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const prefill = sessionStorage.getItem('clipspark_prefill_description');
    if (prefill) {
      setDescription(prefill);
      sessionStorage.removeItem('clipspark_prefill_description');
    }
    textRef.current?.focus();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRefPhoto(URL.createObjectURL(file));
    setRefName(file.name);
  };

  const handleGenerate = () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    sessionStorage.setItem('clipspark_description', description);
    sessionStorage.setItem('clipspark_format', format);
    if (refPhoto) sessionStorage.setItem('clipspark_ref_photo', refPhoto);
    setTimeout(() => router.push('/scenes'), 1800);
  };

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Link href="/" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>New Video</span>
        <div style={{ width: 50 }} />
      </div>

      <main style={{ padding: '28px 20px 0' }}>

        {/* Main input */}
        <div style={{ marginBottom: 20 }}>
          <textarea
            ref={textRef}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your video..."
            rows={5}
            style={{
              width: '100%', padding: '18px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.06)',
              border: description ? '1.5px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
              fontSize: 17, color: '#F0F0FF',
              lineHeight: 1.55, resize: 'none', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />

          {/* Examples */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setDescription(ex)} style={{
                padding: '5px 12px', borderRadius: 999,
                background: 'rgba(139,92,246,0.08)', color: '#8B5CF6',
                border: '1px solid rgba(139,92,246,0.2)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>
                {ex.length > 30 ? ex.slice(0, 30) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Reference photo */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 16, marginBottom: 20,
            background: 'rgba(255,255,255,0.05)',
            border: refPhoto ? '1.5px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', transition: 'border-color 0.2s',
          }}
        >
          {refPhoto ? (
            <>
              <img src={refPhoto} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#F0F0FF', marginBottom: 1 }}>{refName}</p>
                <p style={{ fontSize: 11, color: '#8B5CF6' }}>Reference photo added</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setRefPhoto(null); setRefName(''); }}
                style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11 }}
              >✕</button>
            </>
          ) : (
            <>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0FF', marginBottom: 2 }}>Add reference photo</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Optional — helps AI match your vision</p>
              </div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

        {/* Format */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              style={{
                flex: 1, padding: '12px 8px',
                borderRadius: 14,
                background: format === f.id ? 'linear-gradient(135deg,#8B5CF6,#EC4899)' : 'rgba(255,255,255,0.05)',
                border: format === f.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
                boxShadow: format === f.id ? '0 4px 16px rgba(139,92,246,0.3)' : 'none',
              }}
            >
              <div>{f.label}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{f.sub}</div>
            </button>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!description.trim() || isGenerating}
          style={{
            width: '100%', padding: '18px',
            borderRadius: 999,
            background: description.trim() && !isGenerating
              ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
              : 'rgba(255,255,255,0.06)',
            color: description.trim() && !isGenerating ? '#fff' : 'rgba(255,255,255,0.2)',
            fontSize: 17, fontWeight: 700,
            border: 'none', cursor: description.trim() ? 'pointer' : 'default',
            boxShadow: description.trim() && !isGenerating ? '0 8px 28px rgba(139,92,246,0.4)' : 'none',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {isGenerating ? (
            <>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.85s linear infinite' }} />
              Generating...
            </>
          ) : '✨ Generate'}
        </button>
      </main>

      <TabBar />
    </div>
  );
}
