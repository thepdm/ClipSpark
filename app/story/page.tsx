'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const FORMATS = [
  { id: 'reels', label: 'Reels', emoji: '📱', desc: 'Vertical, 9:16' },
  { id: 'ad', label: 'Ad', emoji: '🎯', desc: 'Promo, 15–30s' },
  { id: 'cinematic', label: 'Cinematic', emoji: '🎬', desc: 'Widescreen' },
];

const EXAMPLES = [
  'Снегурочка walks around a snow-covered house in the forest at midnight, singing, camera pulls back',
  'A street dancer performs through neon-lit city alleys — crowd gathers, energy builds to a finale',
  'Chef creates a magical dish — ingredients float, spices dance, the final plate glows',
  'Astronaut discovers a glowing crystal cave on an alien planet, reaches out to touch it',
];

export default function StoryPage() {
  const router = useRouter();
  const [story, setStory] = useState('');
  const [format, setFormat] = useState('reels');
  const [isGenerating, setIsGenerating] = useState(false);
  const [character, setCharacter] = useState<{ name: string; imageId: string } | null>(null);

  useEffect(() => {
    const c = sessionStorage.getItem('clipspark_character');
    if (c) setCharacter(JSON.parse(c));
    const f = sessionStorage.getItem('clipspark_format');
    if (f) setFormat(f);
    const prefill = sessionStorage.getItem('clipspark_prefill_story');
    if (prefill) { setStory(prefill); sessionStorage.removeItem('clipspark_prefill_story'); }
  }, []);

  const handleGenerate = () => {
    if (!story.trim()) return;
    setIsGenerating(true);
    sessionStorage.setItem('clipspark_story', story);
    sessionStorage.setItem('clipspark_format', format);
    setTimeout(() => router.push('/scenes'), 2000);
  };

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 96 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <Link href="/character" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Story</span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>
        {/* Character chip */}
        {character && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            ...glass, borderRadius: 999,
            padding: '6px 14px 6px 6px',
            marginBottom: 20, boxShadow: 'var(--shadow-sm)',
          }}>
            <img
              src={`https://images.unsplash.com/${character.imageId}?w=60&h=60&fit=crop&q=80`}
              alt={character.name}
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', filter: 'saturate(1.1)' }}
            />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.2 }}>{character.name}</p>
              <p style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 600 }}>✨ Character selected</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 6 }}>
          <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 6 }}>
            Tell your story
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>
            Describe what happens in your video. AI will break it into scenes automatically.
          </p>
        </div>

        <div style={{ marginBottom: 20, marginTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Video story
          </p>
          <textarea
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder={character
              ? `Describe what ${character.name} does in your video...`
              : 'Describe the full story of your video — what happens, where, the mood...'}
            rows={5}
            style={{
              width: '100%', padding: '14px 16px',
              borderRadius: 'var(--r-lg)',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              fontSize: 15, color: 'var(--text-1)',
              lineHeight: 1.55, resize: 'none', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setStory(ex)} style={{
                padding: '5px 11px', borderRadius: 999,
                background: 'rgba(139,92,246,0.08)', color: '#8B5CF6',
                fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}>
                {ex.length > 32 ? ex.slice(0, 32) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!story.trim() || isGenerating}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 'var(--r-xl)',
            background: story.trim() && !isGenerating ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(0,0,0,0.08)',
            color: story.trim() && !isGenerating ? '#fff' : 'var(--text-3)',
            fontSize: 16, fontWeight: 700,
            border: 'none', cursor: story.trim() ? 'pointer' : 'default',
            boxShadow: story.trim() && !isGenerating ? '0 6px 24px rgba(139,92,246,0.35)' : 'none',
            transition: 'all 0.18s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {isGenerating ? (
            <>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.85s linear infinite' }} />
              Building your scenes...
            </>
          ) : (
            '✨ Generate Scenes →'
          )}
        </button>
      </main>

      <TabBar />
    </div>
  );
}
