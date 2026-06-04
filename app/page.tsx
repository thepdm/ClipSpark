'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CHARACTER_IMAGES, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const HERO_SLIDES = [
  {
    title: 'Snow Queen',
    desc: 'Forest at midnight — magical New Year atmosphere',
    imageId: CHARACTER_IMAGES[0],
    character: 'Снегурочка',
    story: 'Снегурочка walks around a snow-covered house in the forest at midnight, singing a magical song. After one circle the camera slowly pulls back — she fades into the snowy darkness.',
    tag: 'Fantasy',
  },
  {
    title: 'Urban Dancer',
    desc: 'Neon streets — rhythm, energy and pure soul',
    imageId: CHARACTER_IMAGES[1],
    character: 'Street dancer',
    story: 'A street dancer performs through neon-lit city alleys at midnight. A crowd gathers, the energy builds — the finale is an explosive move as the crowd erupts.',
    tag: 'Urban',
  },
  {
    title: 'Space Explorer',
    desc: 'Unknown worlds beyond the stars',
    imageId: CHARACTER_IMAGES[2],
    character: 'Astronaut',
    story: 'An astronaut discovers a glowing crystal cave on an alien planet. She reaches out to touch a crystal — the whole cave lights up in waves of colour.',
    tag: 'Sci-Fi',
  },
];

const SECTIONS = [
  {
    title: 'Fantasy & Magic',
    items: [
      { name: 'Snow Queen', desc: 'Forest, midnight, New Year', imageId: CHARACTER_IMAGES[0], story: 'Снегурочка walks around a snow-covered house in the forest at midnight, singing. Camera pulls back — she vanishes into darkness.' },
      { name: 'Dark Wizard', desc: 'Ancient library, summoning ritual', imageId: CHARACTER_IMAGES[5], story: 'A dark wizard performs an ancient ritual in a crumbling library. Books fly, candles flare — a portal tears open in the air.' },
      { name: 'Forest Spirit', desc: 'Enchanted woods at dawn', imageId: REGEN_POOL[2], story: 'A forest spirit drifts between ancient trees at dawn. Flowers bloom at every footstep — the forest wakes up around her.' },
      { name: 'Cyber Witch', desc: 'Neon magic, hologram spells', imageId: CHARACTER_IMAGES[4], story: 'A cyber witch casts holographic spells in a neon-soaked city. Code streams from her fingertips — the city grid obeys her will.' },
    ],
  },
  {
    title: 'Urban & Street',
    items: [
      { name: 'Street Dancer', desc: 'City lights, late night freestyle', imageId: CHARACTER_IMAGES[1], story: 'A street dancer freestyles through neon-lit alleys at midnight. Crowd gathers, energy builds to an explosive finale.' },
      { name: 'Rapper', desc: 'Rooftop performance, downtown', imageId: CHARACTER_IMAGES[6], story: 'A rapper performs on a downtown rooftop at sunset. City sprawls behind — the track drops as golden hour hits.' },
      { name: 'Graffiti Artist', desc: 'Warehouse walls come alive', imageId: REGEN_POOL[0], story: 'A graffiti artist paints a massive mural on a warehouse wall. The art comes alive — characters step off the wall and dance.' },
      { name: 'Skater', desc: 'Concrete jungle, night session', imageId: REGEN_POOL[1], story: 'A skater tears through an empty city at 3am. Each trick lands perfectly — the city is hers and hers alone.' },
    ],
  },
  {
    title: 'Cinematic Drama',
    items: [
      { name: 'Lost Astronaut', desc: 'Alone, deep space, crystal cave', imageId: CHARACTER_IMAGES[2], story: 'An astronaut discovers a crystal cave on an alien planet. She reaches out — the cave explodes with colour and light.' },
      { name: 'Mountain Climber', desc: 'Summit push at golden hour', imageId: REGEN_POOL[3], story: 'A climber makes the final push to a summit at golden hour. She reaches the top — endless mountain range stretches out below.' },
      { name: 'Ocean Diver', desc: 'Shipwreck, bioluminescence', imageId: REGEN_POOL[4], story: 'A diver explores a sunken shipwreck at night. Bioluminescent creatures light up the darkness — she finds a glowing artefact.' },
      { name: 'Forest Runner', desc: 'Chased by shadows, ancient trees', imageId: REGEN_POOL[2], story: 'A runner sprints through an ancient forest at dusk, chased by shadows. She bursts into a clearing — the shadows dissolve in golden light.' },
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
            background: 'linear-gradient(135deg, #E8445A, #FF8FA3)',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 12, fontWeight: 700, color: '#fff',
            boxShadow: '0 3px 12px rgba(232,68,90,0.35)',
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
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#E8445A', background: 'rgba(232,68,90,0.18)', borderRadius: 999, padding: '3px 8px', marginBottom: 8, border: '1px solid rgba(232,68,90,0.3)' }}>
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
          <span style={{ fontSize: 11, fontWeight: 600, color: '#E8445A', background: 'rgba(232,68,90,0.12)', borderRadius: 999, padding: '3px 10px', border: '1px solid rgba(232,68,90,0.2)' }}>New</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 20px' }}>
          {/* Animate Photo */}
          <FeatureCard title="Animate Photo" desc="Upload a photo — AI adds parallax and motion" tag="Animation" color="#7C5CFC" onClick={() => router.push('/character')}>
            <img src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=300&h=200&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
          </FeatureCard>

          {/* Photos to Video — collage */}
          <FeatureCard title="Photos to Video" desc="N photos → AI generates smooth transitions" tag="Video" color="#06B6D4" onClick={() => router.push('/character')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%', height: '100%' }}>
              {['photo-1534528741775-53994a69daeb','photo-1516117172878-fd2c41f4a759','photo-1507003211169-0a1dd7228f2d','photo-1470071459604-3b5ec3a7fe05'].map((id, i) => (
                <img key={i} src={`https://images.unsplash.com/${id}?w=150&h=150&fit=crop&q=70`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
              ))}
            </div>
          </FeatureCard>

          {/* Beat Cuts */}
          <FeatureCard title="Beat Cuts" desc="AI auto-cuts scenes exactly on the beat" tag="Editing" color="#E8445A" onClick={() => router.push('/character')}>
            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
          </FeatureCard>

          {/* Style Transfer */}
          <FeatureCard title="Style Transfer" desc="Neon / Film Noir / Anime / Cinematic — all scenes at once" tag="Style" color="#F59E0B" onClick={() => router.push('/character')}>
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)' }} />
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) saturate(1.1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>{item.name}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>{item.desc}</p>
                </div>
                {/* Play indicator */}
                <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: 'rgba(232,68,90,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
