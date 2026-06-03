'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CHARACTER_IMAGES } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

type PageState = 'input' | 'generating' | 'selecting';

const glass: React.CSSProperties = {
  background: 'var(--glass)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid var(--glass-border)',
};

const EXAMPLES = ['Снегурочка', 'Street dancer', 'Space explorer', 'Young chef', 'Cyber robot'];
const VARIANTS = CHARACTER_IMAGES.slice(0, 3);

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 24 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} style={{
          height: 4, borderRadius: 999, transition: 'flex 0.3s',
          flex: n === current ? 2 : 1,
          background: n <= current ? '#E8445A' : 'rgba(232,68,90,0.15)',
        }} />
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 4 }}>
        {current} / 5
      </span>
    </div>
  );
}

export default function CharacterPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('input');
  const [description, setDescription] = useState('');
  const [refFileName, setRefFileName] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!description.trim()) return;
    setPageState('generating');
    setTimeout(() => setPageState('selecting'), 2500);
  };

  const handleUseCharacter = () => {
    if (selected === null) return;
    sessionStorage.setItem('clipspark_character', JSON.stringify({
      name: description,
      imageId: VARIANTS[selected],
    }));
    router.push('/story');
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E8445A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>
          {pageState === 'selecting' ? 'Choose Character' : 'Create Character'}
        </span>
        <div style={{ width: 60 }} />
      </div>

      <main style={{ padding: '20px 20px 0' }}>
        <StepBar current={1} />

        {pageState === 'input' && (
          <>
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 6 }}>
                Who's the star?
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>
                Describe your main character or object. AI will generate visual variants for you to choose from.
              </p>
            </div>

            <div style={{ marginBottom: 16, marginTop: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                Character description
              </p>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="E.g. A magical snow maiden in a white sparkling dress..."
                rows={3}
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: 'var(--r-lg)',
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid var(--glass-border)',
                  fontSize: 15, color: 'var(--text-1)',
                  lineHeight: 1.5, resize: 'none', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => setDescription(ex)} style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: 'rgba(232,68,90,0.08)', color: '#E8445A',
                    fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                  }}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference photo upload */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                ...glass, borderRadius: 'var(--r-lg)',
                padding: '14px 16px', marginBottom: 28,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'rgba(232,68,90,0.09)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8445A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>
                  {refFileName || 'Add reference photo'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
                  {refFileName ? 'Reference uploaded' : 'Optional — helps AI match your vision'}
                </p>
              </div>
              {refFileName && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => setRefFileName(e.target.files?.[0]?.name || '')}
            />

            <button
              onClick={handleGenerate}
              disabled={!description.trim()}
              style={{
                width: '100%', padding: '16px',
                borderRadius: 'var(--r-xl)',
                background: description.trim() ? 'linear-gradient(135deg, #E8445A, #FF8FA3)' : 'rgba(0,0,0,0.08)',
                color: description.trim() ? '#fff' : 'var(--text-3)',
                fontSize: 16, fontWeight: 700,
                border: 'none', cursor: description.trim() ? 'pointer' : 'default',
                boxShadow: description.trim() ? '0 6px 24px rgba(232,68,90,0.35)' : 'none',
                transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              ✨ Generate Character
            </button>
          </>
        )}

        {pageState === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420, gap: 20 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid rgba(232,68,90,0.15)', borderTopColor: '#E8445A', animation: 'spin 0.85s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid rgba(232,68,90,0.10)', borderBottomColor: '#FF8FA3', animation: 'spin 1.2s linear infinite reverse' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✨</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Generating your character</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>AI is crafting visual variants<br />based on your description</p>
            </div>
            <div style={{ ...glass, borderRadius: 'var(--r-lg)', padding: '10px 18px', marginTop: 8 }}>
              <p style={{ fontSize: 13, color: '#E8445A', fontWeight: 500, fontStyle: 'italic' }}>"{description}"</p>
            </div>
          </div>
        )}

        {pageState === 'selecting' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: 'var(--text-1)', marginBottom: 4 }}>
                Choose your character
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>3 variants generated — pick the one that fits your vision</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
              {VARIANTS.map((imgId, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                    border: selected === i ? '2.5px solid #E8445A' : '2px solid transparent',
                    boxShadow: selected === i ? '0 4px 20px rgba(232,68,90,0.35)' : 'var(--shadow-sm)',
                    transition: 'all 0.18s', position: 'relative',
                  }}
                >
                  <img
                    src={`https://images.unsplash.com/${imgId}?w=300&h=400&fit=crop&q=80`}
                    alt={`Variant ${i + 1}`}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', filter: 'saturate(1.1) contrast(1.04)' }}
                  />
                  {/* AI badge */}
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                    borderRadius: 999, padding: '3px 8px',
                    fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: 0.3,
                  }}>
                    AI ✨
                  </div>
                  {/* Selected overlay */}
                  {selected === i && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(232,68,90,0.15)',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      paddingBottom: 10,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: '#E8445A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    padding: '20px 8px 8px',
                    fontSize: 11, fontWeight: 600, color: '#fff', textAlign: 'center',
                  }}>
                    Variant {i + 1}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleUseCharacter}
              disabled={selected === null}
              style={{
                width: '100%', padding: '16px',
                borderRadius: 'var(--r-xl)',
                background: selected !== null ? 'linear-gradient(135deg, #E8445A, #FF8FA3)' : 'rgba(0,0,0,0.08)',
                color: selected !== null ? '#fff' : 'var(--text-3)',
                fontSize: 16, fontWeight: 700,
                border: 'none', cursor: selected !== null ? 'pointer' : 'default',
                boxShadow: selected !== null ? '0 6px 24px rgba(232,68,90,0.35)' : 'none',
                transition: 'all 0.18s',
              }}
            >
              Use this character →
            </button>
          </>
        )}
      </main>

      <TabBar />
    </div>
  );
}
