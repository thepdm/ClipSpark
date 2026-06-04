'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { CHARACTER_IMAGES, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const HERO_SLIDES = [
  {
    title: 'TikTok Dance',
    desc: 'Trending moves, viral energy — your moment to shine',
    imageId: 'tiktok-dance-custom',
    character: 'Dancer',
    story: 'A girl performs a trending TikTok dance in a neon-lit space. Every move hits on the beat — she spins, the camera follows, the crowd goes wild.',
    tag: 'TikTok',
  },
  {
    title: 'Maldives Sunset',
    desc: 'Turquoise water, white sand, golden hour',
    imageId: 'photo-1573843981267-be1999ff37cd',
    character: 'Beach girl',
    story: 'A girl walks along a white sand beach in the Maldives at golden hour. Crystal clear water surrounds her — the sky turns pink and violet as the sun sets.',
    tag: 'Locations',
  },
  {
    title: 'Night City',
    desc: 'Neon rain, city lights, midnight vibes',
    imageId: 'photo-1519501025264-65ba15a82390',
    character: 'Night city girl',
    story: 'A girl walks through a neon-lit rainy city at midnight. Reflections shimmer on wet streets — she owns the night.',
    tag: 'Urban',
  },
];

const SECTIONS = [
  {
    title: 'Locations',
    items: [
      { name: 'Maldives', desc: 'Turquoise water, white sand, sunset', imageId: 'photo-1573843981267-be1999ff37cd', story: 'A girl walks along a white sand beach in the Maldives at golden hour. Crystal clear water surrounds her — the sky turns pink and violet as the sun sets.' },
      { name: 'Paris', desc: 'Streets, cafés, flowers, rain', imageId: 'photo-1499856871958-5b9627545d1a', story: 'A girl strolls through rainy Paris streets, past flower stalls and glowing café windows. She twirls her umbrella — the city lights reflect in puddles.' },
      { name: 'Dubai Desert', desc: 'Golden dunes, luxury, sunset', imageId: 'photo-1512453979798-5ea266f8880c', story: 'A girl stands on golden desert dunes in Dubai at sunset. Sand flows around her — the horizon glows deep orange and red.' },
      { name: 'Amalfi Coast', desc: 'Blue sea, lemons, Italian summer', imageId: 'photo-1534445867742-43195f401b6c', story: 'A girl walks through the colourful streets of Amalfi, past lemon trees and sea views. She sits at a cliffside café — the Mediterranean sparkles below.' },
    ],
  },
  {
    title: 'Aesthetic Style',
    items: [
      { name: 'B&W Photo Shoot', desc: 'Studio light, cinematic', imageId: 'photo-1531746020798-e6953c6e8e04', filter: 'grayscale(1) contrast(1.25) brightness(0.85)', story: 'A girl poses in a minimalist studio under dramatic black and white lighting. Each movement is precise and powerful — pure cinematic elegance.' },
      { name: 'Golden Hour', desc: 'Magic sunset, warm light', imageId: 'photo-1507003211169-0a1dd7228f2d', filter: 'sepia(0.45) saturate(1.8) brightness(0.9) contrast(1.05)', story: 'A girl walks through a field at golden hour as the sun sets behind her. Long shadows, warm glow, hair in the breeze — pure magic.' },
      { name: 'Vintage Film', desc: 'Film grain, 90s colours', imageId: 'photo-1526045612212-70caf35c14df', filter: 'sepia(0.5) saturate(0.75) brightness(0.88) contrast(1.1)', story: 'A girl explores the city in a vintage aesthetic — film grain, faded colours, analogue camera flares. Feels like a 90s music video.' },
      { name: 'Dark Botanica', desc: 'Tropics, jungle, luxury', imageId: 'photo-1441974231531-c6227db76b6e', filter: 'saturate(1.4) brightness(0.75) contrast(1.1)', story: 'A girl moves through a lush tropical jungle at dusk — exotic flowers, deep shadows, luxury and mystery at every turn.' },
    ],
  },
  {
    title: 'Mood & Vibe',
    items: [
      { name: 'Winter Luxe', desc: 'Snow, fur coat, cosy', imageId: 'photo-1491555103944-7c647fd857e6', story: 'A girl walks through a snowy city in a luxurious fur coat. Snowflakes fall gently — warm café lights glow through frosted windows.' },
      { name: 'Spring Bloom', desc: 'Blooming garden, pastel', imageId: 'photo-1469474968028-56623f02e42e', story: 'A girl wanders through a cherry blossom garden in spring. Petals fall around her like snow — soft pastel colours, pure joy.' },
      { name: 'Night City', desc: 'Neon rain, city lights', imageId: 'photo-1447752875215-b2761acb3c5d', story: 'A girl walks through a neon-lit rainy city at midnight. Reflections shimmer on wet streets — she owns the night.' },
      { name: 'Rooftop Sunset', desc: 'City view, wind, golden sky', imageId: 'photo-1426604966848-d7adac402bff', story: 'A girl stands on a rooftop at sunset with the whole city below. Wind in her hair, golden sky behind her — the city is hers.' },
      { name: 'Glam & Sexy', desc: 'Confidence, luxury, allure', imageId: 'photo-1529626455594-4ff0802cfb7e', story: 'A girl owns the room — dramatic lighting, confident gaze, slow motion. Every frame is pure power and femininity.' },
    ],
  },
];

function FeatureCard({ title, desc, tag, color, onClick, children }: {
  title: string; desc: string; tag: string; color: string;
  onClick: () => void; children: React.ReactNode;
}) {
  return (
    <div onClick={onClick} style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer', position: 'relative', height: 180, border: '1px solid rgba(255,255,255,0.07)', background: '#111' }}>
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.2) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color, background: 'rgba(10,10,15,0.75)', borderRadius: 999, padding: '3px 8px', border: `1px solid ${color}44` }}>{tag}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>{title}</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  );
}

type TemplateItem = { name: string; desc: string; imageId: string; story: string; filter?: string };

export default function Home() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState<TemplateItem | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [templateStage, setTemplateStage] = useState<'pick' | 'generating' | 'result'>('pick');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const openTemplate = (item: TemplateItem) => {
    setActiveTemplate(item);
    setUserPhoto(null);
    setTemplateStage('pick');
  };

  const handleGenerate = () => {
    if (!userPhoto) return;
    setTemplateStage('generating');
    setTimeout(() => setTemplateStage('result'), 2800);
  };

  const handleStart = (character: string, story: string) => {
    sessionStorage.setItem('clipspark_prefill_description', story || character);
    router.push('/create');
  };

  // gallery for template picker
  const GALLERY_IDS = [
    'photo-1534528741775-53994a69daeb','photo-1524504388940-b1c1722653e0',
    'photo-1544005313-94ddf0286df2','photo-1507003211169-0a1dd7228f2d',
    'photo-1529626455594-4ff0802cfb7e',
  ];

  return (
    <div style={{ minHeight: '100svh', paddingBottom: 100, background: '#0A0A0F' }}>

      {/* Top nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '14px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.90)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: '#F0F0FF' }}>ClipSpark</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => router.push('/remix')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999, padding: '6px 14px',
              fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            Remix
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 12, fontWeight: 700, color: '#fff',
            boxShadow: '0 3px 12px rgba(139,92,246,0.35)',
          }}>
            ✦ PRO
          </div>
        </div>
      </div>

      {/* Hero slider */}
      <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden' }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === heroIndex ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: i === heroIndex ? 'auto' : 'none' }}
            onClick={() => handleStart(s.character, s.story)}>
            <img
              src={s.imageId === 'tiktok-dance-custom'
                ? 'https://source.unsplash.com/EhUEJhwPxHE/800x600'
                : `https://images.unsplash.com/${s.imageId}?w=800&h=600&fit=crop&q=80`}
              alt={s.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(1.2)', cursor: 'pointer' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.1) 0%, transparent 40%, rgba(10,10,15,0.88) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#8B5CF6', background: 'rgba(139,92,246,0.18)', borderRadius: 999, padding: '3px 8px', marginBottom: 8, border: '1px solid rgba(139,92,246,0.3)' }}>
                {s.tag} · Featured
              </span>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 5 }}>{s.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4, flex: 1, marginRight: 12 }}>{s.desc}</p>
                <button style={{ flexShrink: 0, padding: '9px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Try It →
                </button>
              </div>
              {/* Pagination dots */}
              <div style={{ display: 'flex', gap: 5, marginTop: 12, justifyContent: 'center' }}>
                {HERO_SLIDES.map((_, di) => (
                  <button key={di} onClick={e => { e.stopPropagation(); setHeroIndex(di); }}
                    style={{ width: di === heroIndex ? 20 : 6, height: 6, borderRadius: 999, border: 'none', cursor: 'pointer', background: di === heroIndex ? '#fff' : 'rgba(255,255,255,0.35)', transition: 'all 0.3s', padding: 0 }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Features */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.3 }}>AI Features</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#8B5CF6', background: 'rgba(139,92,246,0.12)', borderRadius: 999, padding: '3px 10px', border: '1px solid rgba(139,92,246,0.2)' }}>New</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 20px' }}>
          <FeatureCard title="Animate Photo" desc="Upload a photo — AI adds parallax and motion" tag="Animation" color="#7C5CFC" onClick={() => router.push('/animate')}>
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=360&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
          </FeatureCard>

          <FeatureCard title="Photos to Video" desc="N photos → AI generates smooth transitions" tag="Video" color="#06B6D4" onClick={() => router.push('/photos-to-video')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%', height: '100%' }}>
              {['photo-1534528741775-53994a69daeb','photo-1516117172878-fd2c41f4a759','photo-1507003211169-0a1dd7228f2d','photo-1470071459604-3b5ec3a7fe05'].map((id, i) => (
                <img key={i} src={`https://images.unsplash.com/${id}?w=150&h=150&fit=crop&q=70`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard title="Beat Cuts" desc="AI auto-cuts scenes exactly on the beat" tag="Editing" color="#8B5CF6" onClick={() => router.push('/beat-cuts')}>
            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=360&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
          </FeatureCard>

          <FeatureCard title="Style Transfer" desc="Neon / Film Noir / Vintage / Cinematic" tag="Style" color="#F59E0B" onClick={() => router.push('/style-transfer')}>
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=360&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
          </FeatureCard>

          <FeatureCard title="AI Dance" desc="Upload your photo — AI makes you dance to any beat" tag="Dance" color="#10B981" onClick={() => router.push('/ai-dance')}>
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=360&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.2)' }} />
          </FeatureCard>
        </div>
      </div>

      {/* Content sections */}
      {SECTIONS.map(section => (
        <div key={section.title} style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.3 }}>{section.title}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>See All</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 2 }}>
            {section.items.map(item => (
              <div
                key={item.name}
                onClick={() => openTemplate(item)}
                style={{ width: 150, height: 210, borderRadius: 16, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', position: 'relative', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <img src={`https://images.unsplash.com/${item.imageId}?w=300&h=420&fit=crop&q=80`} alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: (item as { filter?: string }).filter || 'brightness(0.8) saturate(1.1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>{item.name}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>{item.desc}</p>
                </div>
                {/* Play indicator */}
                <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 1 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 20 }} />
      {/* Template overlay */}
      {activeTemplate && (
        <>
          <div onClick={() => setActiveTemplate(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
            background: '#0F0F16', borderRadius: '24px 24px 0 0',
            border: '1px solid rgba(255,255,255,0.08)',
            maxHeight: '92svh', overflowY: 'auto',
          }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.15)', margin: '14px auto 0' }} />

            {/* Template preview */}
            <div style={{ position: 'relative', margin: '16px 16px 0' }}>
              <img
                src={`https://images.unsplash.com/${activeTemplate.imageId}?w=800&h=500&fit=crop&q=80`}
                alt={activeTemplate.name}
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 18, display: 'block', filter: (activeTemplate as { filter?: string }).filter || 'brightness(0.85) saturate(1.1)' }}
              />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.65))' }} />
              {/* Play indicator */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{activeTemplate.name}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{activeTemplate.desc}</p>
              </div>
            </div>

            <div style={{ padding: '20px 16px 0' }}>
              {templateStage === 'pick' && (
                <>
                  <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>✨</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF', marginBottom: 2 }}>Add your photo</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>AI will put you in this video</p>
                    </div>
                  </div>

                  {/* Gallery row */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto' }}>
                    {/* Upload button */}
                    <div onClick={() => fileRef.current?.click()} style={{ width: 76, height: 76, borderRadius: 16, border: '2px dashed rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.06)', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
                      <span style={{ fontSize: 22, color: 'rgba(139,92,246,0.8)' }}>+</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Upload</span>
                    </div>
                    {GALLERY_IDS.map(id => (
                      <div key={id} onClick={() => setUserPhoto(`https://images.unsplash.com/${id}?w=400&h=400&fit=crop`)} style={{ width: 76, height: 76, borderRadius: 16, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: userPhoto?.includes(id) ? '2.5px solid #8B5CF6' : '2px solid transparent', transition: 'border 0.15s' }}>
                        <img src={`https://images.unsplash.com/${id}?w=152&h=152&fit=crop&q=70`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setUserPhoto(URL.createObjectURL(f)); }} />

                  {userPhoto && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '10px 14px' }}>
                      <img src={userPhoto} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '2px solid #8B5CF6' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#F0F0FF' }}>Your photo selected</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>AI will use your face & body</p>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    </div>
                  )}

                  <button onClick={handleGenerate} disabled={!userPhoto} style={{ width: '100%', padding: '17px', borderRadius: 999, marginBottom: 32, background: userPhoto ? 'linear-gradient(135deg,#8B5CF6,#EC4899)' : 'rgba(255,255,255,0.06)', border: 'none', color: userPhoto ? '#fff' : 'rgba(255,255,255,0.2)', fontSize: 16, fontWeight: 700, cursor: userPhoto ? 'pointer' : 'default', boxShadow: userPhoto ? '0 6px 24px rgba(139,92,246,0.4)' : 'none', transition: 'all 0.2s' }}>
                    ✨ Put me in this video
                  </button>
                </>
              )}

              {templateStage === 'generating' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0 40px' }}>
                  {/* Before/after preview */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                      <img src={`https://images.unsplash.com/${activeTemplate.imageId}?w=200&h=200&fit=crop`} alt="" style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', opacity: 0.5 }} />
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Template</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'rgba(255,255,255,0.3)' }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 80, height: 80, borderRadius: 14, overflow: 'hidden', border: '2px solid #8B5CF6', animation: 'pulse 1s ease-in-out infinite' }}>
                        <img src={userPhoto!} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <p style={{ fontSize: 10, color: '#8B5CF6', marginTop: 4 }}>You</p>
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6', animation: 'spin 0.85s linear infinite' }} />
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F0FF' }}>Placing you in the video...</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>AI is replacing the actor with you</p>
                </div>
              )}

              {templateStage === 'result' && (
                <div style={{ paddingBottom: 32 }}>
                  <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
                    <img src={`https://images.unsplash.com/${activeTemplate.imageId}?w=800&h=500&fit=crop&q=80`} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', filter: (activeTemplate as { filter?: string }).filter || 'brightness(0.85)' }} />
                    {/* User face overlay (simulated) */}
                    <div style={{ position: 'absolute', bottom: 16, right: 16, width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', border: '3px solid #8B5CF6', boxShadow: '0 0 20px rgba(139,92,246,0.6)' }}>
                      <img src={userPhoto!} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.9)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>✓ It's you!</div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setTemplateStage('pick')} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↻ Try another photo</button>
                    <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 18px rgba(139,92,246,0.4)' }}>Save & Share ↗</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
