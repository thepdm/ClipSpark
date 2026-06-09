'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

export default function CreatePage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [refPhoto, setRefPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prefill = sessionStorage.getItem('clipspark_prefill_description');
    if (prefill) { setDescription(prefill); sessionStorage.removeItem('clipspark_prefill_description'); }
  }, []);

  const handleGenerate = () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    sessionStorage.setItem('clipspark_description', description);
    if (refPhoto) sessionStorage.setItem('clipspark_ref_photo', refPhoto);
    setTimeout(() => router.push('/scenes'), 1800);
  };

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{
        flexShrink: 0, padding: '12px 16px 10px',
        display: 'flex', alignItems: 'center',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#8B5CF6', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      </div>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', gap: 16 }}>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your video..."
          autoFocus
          rows={4}
          style={{
            width: '100%', padding: '20px',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.07)',
            border: description ? '1.5px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
            fontSize: 18, color: '#F0F0FF', lineHeight: 1.5,
            resize: 'none', outline: 'none', fontFamily: 'inherit',
            boxSizing: 'border-box', transition: 'border-color 0.2s',
          }}
        />

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          {/* Photo ref */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: 54, height: 54, borderRadius: 16,
                background: refPhoto ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                border: refPhoto ? '1.5px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', overflow: 'hidden', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {refPhoto ? (
                <img src={refPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </button>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.3 }}>Ref{' '}photo</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setRefPhoto(URL.createObjectURL(f)); }} />

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={!description.trim() || isGenerating}
            style={{
              flex: 1, height: 54, borderRadius: 16, alignSelf: 'flex-start',
              background: description.trim() && !isGenerating
                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                : 'rgba(255,255,255,0.06)',
              color: description.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
              fontSize: 16, fontWeight: 700, border: 'none',
              cursor: description.trim() ? 'pointer' : 'default',
              boxShadow: description.trim() && !isGenerating ? '0 6px 24px rgba(139,92,246,0.4)' : 'none',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {isGenerating ? (
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.85s linear infinite' }} />
            ) : '✨ Generate'}
          </button>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
