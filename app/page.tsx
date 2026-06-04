'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CHARACTER_IMAGES, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const HERO_SLIDES = [
  {
    title: 'Snow Queen',
    desc: 'Forest at midnight — magical New Year atmosphere',
    imageId: 'photo-1478760329108-5c3ed9d495a0',
    character: 'Снегурочка',
    story: 'Снегурочка walks around a snow-covered house in the forest at midnight, singing a magical song. After one circle the camera slowly pulls back — she fades into the snowy darkness.',
    tag: 'Fantasy',
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
      { name: 'B&W Photo Shoot', desc: 'Studio light, cinematic', imageId: 'photo-1524504388940-b1c1722653e0', filter: 'grayscale(1) contrast(1.25) brightness(0.85)', story: 'A girl poses in a minimalist studio under dramatic black and white lighting. Each movement is precise and powerful — pure cinematic elegance.' },
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

export default function Home() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = (character: string, story: string) => {
    sessionStorage.setItem('clipspark_prefill_character', character);
    sessionStorage.setItem('clipspark_prefill_story', story);
    router.push('/character');
  };

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
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 12, fontWeight: 700, color: '#fff',
            boxShadow: '0 3px 12px rgba(139,92,246,0.35)',
          }}>
            ✦ PRO
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero slider */}
      <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden' }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === heroIndex ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: i === heroIndex ? 'auto' : 'none' }}
            onClick={() => handleStart(s.character, s.story)}>
            <img src={`https://images.unsplash.com/${s.imageId}?w=800&h=600&fit=crop&q=80`} alt={s.title}
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
            <img src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=360&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
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
                onClick={() => handleStart(item.name, item.story)}
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
      <TabBar />
    </div>
  );
}
