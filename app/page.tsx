'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CHARACTER_IMAGES, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const HERO_SLIDES = [
  { title: 'Snow Queen', desc: 'A magical winter tale — forest, midnight glow', imageId: CHARACTER_IMAGES[0], tag: 'Fantasy' },
  { title: 'Urban Dancer', desc: 'Neon streets, rhythm and pure soul energy', imageId: CHARACTER_IMAGES[1], tag: 'Urban' },
  { title: 'Space Explorer', desc: 'Discover unknown worlds beyond the stars', imageId: CHARACTER_IMAGES[2], tag: 'Sci-Fi' },
  { title: 'Young Chef', desc: 'Ingredients float, spices dance, magic cooks', imageId: CHARACTER_IMAGES[3], tag: 'Lifestyle' },
];

const SECTIONS = [
  {
    title: 'Fantasy & Magic',
    items: [
      { label: 'Snow Queen', desc: 'Forest at midnight', imageId: CHARACTER_IMAGES[0] },
      { label: 'Dark Wizard', desc: 'Ancient spell ritual', imageId: CHARACTER_IMAGES[5] },
      { label: 'Fairy Tale', desc: 'Enchanted kingdom', imageId: CHARACTER_IMAGES[3] },
      { label: 'Cyber Witch', desc: 'Neon magic', imageId: CHARACTER_IMAGES[4] },
    ],
  },
  {
    title: 'Urban & Street',
    items: [
      { label: 'Street Dancer', desc: 'City lights & rhythm', imageId: CHARACTER_IMAGES[1] },
      { label: 'Rapper', desc: 'Downtown vibes', imageId: CHARACTER_IMAGES[6] },
      { label: 'Skater', desc: 'Concrete jungle', imageId: CHARACTER_IMAGES[2] },
      { label: 'Graffiti Artist', desc: 'Walls come alive', imageId: CHARACTER_IMAGES[7] },
    ],
  },
  {
    title: 'Cinematic Drama',
    items: [
      { label: 'Lost Astronaut', desc: 'Alone in deep space', imageId: REGEN_POOL[0] },
      { label: 'Mountain Climber', desc: 'Summit at sunset', imageId: REGEN_POOL[3] },
      { label: 'Ocean Diver', desc: 'Underwater silence', imageId: REGEN_POOL[4] },
      { label: 'Forest Runner', desc: 'Chased by shadows', imageId: REGEN_POOL[2] },
    ],
  },
];

export default function Home() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const [recentProjects, setRecentProjects] = useState<{ id: string; title: string; format: string; createdAt: number }[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('clipspark_projects');
    if (data) setRecentProjects(JSON.parse(data).slice(0, 3));
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = (prefill?: string) => {
    if (prefill) sessionStorage.setItem('clipspark_prefill_character', prefill);
    router.push('/character');
  };

  const slide = HERO_SLIDES[heroIndex];

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 100, background: '#0A0A0F' }}>

      {/* Top nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '14px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: '#F0F0FF' }}>ClipSpark</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 12, fontWeight: 700, color: '#fff',
            boxShadow: '0 3px 12px rgba(232,68,90,0.35)',
          }}>
            ✦ PRO
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero carousel */}
      <div
        style={{ position: 'relative', width: '100%', height: '56vw', maxHeight: 340, overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => handleStart(slide.title)}
      >
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === heroIndex ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}>
            <img
              src={`https://images.unsplash.com/${s.imageId}?w=800&h=600&fit=crop&q=80`}
              alt={s.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) saturate(1.2)' }}
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, transparent 40%, rgba(10,10,15,0.75) 100%)' }} />

        {/* Content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1,
                color: '#E8445A', background: 'rgba(232,68,90,0.2)', borderRadius: 999,
                padding: '3px 8px', marginBottom: 6,
              }}>
                {slide.tag}
              </span>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 4 }}>
                {slide.title}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
                {slide.desc}
              </p>
            </div>
            <button style={{
              flexShrink: 0,
              padding: '10px 18px', borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              Try It!
            </button>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 12 }}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setHeroIndex(i); }}
                style={{
                  width: i === heroIndex ? 20 : 6, height: 6, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: i === heroIndex ? '#fff' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.3s', padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div style={{ padding: '0 0 8px' }}>
        {SECTIONS.map(section => (
          <div key={section.title} style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.3 }}>{section.title}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>See All</span>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 2 }}>
              {section.items.map(item => (
                <div
                  key={item.label}
                  onClick={() => handleStart(item.label)}
                  style={{
                    width: 150, height: 210, borderRadius: 16, overflow: 'hidden',
                    flexShrink: 0, cursor: 'pointer', position: 'relative',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <img
                    src={`https://images.unsplash.com/${item.imageId}?w=300&h=420&fit=crop&q=80`}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.82) saturate(1.1)' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 50%)',
                  }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2, lineHeight: 1.2 }}>{item.label}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Recent projects */}
        {recentProjects.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.3 }}>My Projects</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>See All</span>
            </div>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentProjects.map(p => (
                <div key={p.id} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: 16,
                  padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0FF', marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{p.format}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E8445A' }}>Open →</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating CTA */}
      <div style={{
        position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        zIndex: 90,
      }}>
        <button
          onClick={() => handleStart()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 999,
            background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
            color: '#fff', fontSize: 16, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(232,68,90,0.50)',
            letterSpacing: -0.2, whiteSpace: 'nowrap',
          }}
        >
          ✦ Create a Video
        </button>
      </div>

      <TabBar />
    </div>
  );
}
