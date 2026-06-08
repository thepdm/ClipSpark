'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { CHARACTER_IMAGES, REGEN_POOL } from '@/lib/mockScenes';
import { TabBar } from '@/components/TabBar';

const HERO_SLIDES = [
  {
    title: 'Ferrari',
    desc: 'Red supercar, open road, pure adrenaline',
    imageId: 'photo-1583121274602-3e2820c69888',
    story: 'You drive a red Ferrari along an empty coastal road at sunset. Engine roars, wind in your hair — pure adrenaline and freedom.',
    tag: 'Cars',
  },
  {
    title: 'Runway',
    desc: 'Fashion show, designer looks, all eyes on you',
    imageId: 'photo-1558618666-fcd25c85cd64',
    story: 'You walk a high-fashion runway in a stunning designer outfit. Cameras flash, the crowd watches — every step is power and elegance.',
    tag: 'Runway',
  },
  {
    title: 'TikTok Dance',
    desc: 'Trending moves, viral energy',
    imageId: 'photo-1529626455594-4ff0802cfb7e',
    story: 'A girl performs a trending TikTok dance in a neon-lit space. Every move hits on the beat — she spins, the camera follows, the crowd goes wild.',
    tag: 'Dance',
  },
  {
    title: 'Private Jet',
    desc: 'Luxury travel, first class, business at altitude',
    imageId: 'photo-1540962351504-03099e0a754b',
    story: 'You board a private jet with a briefcase in hand. Leather seats, champagne, clouds below — business at the highest level.',
    tag: 'CEO',
  },
];

const SECTIONS = [
  {
    title: 'Dance',
    items: [
      { name: 'TikTok Dance', desc: 'Trending moves, viral energy', imageId: 'photo-1547153760-18fc86324498', story: 'A girl performs a trending TikTok dance in a neon-lit space. Every move hits on the beat — she spins, the camera follows, the crowd goes wild.' },
      { name: 'Hip-Hop', desc: 'Street style, raw energy', imageId: 'photo-1516450360452-9312f5e86fc7', story: 'A person dances hip-hop in an urban setting — bold moves, street lights, pure confidence. Every step lands on the beat.' },
      { name: 'Ballet', desc: 'Grace, flow, cinematic', imageId: 'photo-1518611012118-696072aa579a', story: 'A dancer performs ballet in an empty theatre, soft spotlight, slow motion. Every movement is pure grace and emotion.' },
      { name: 'Club Night', desc: 'Neon, bass, night energy', imageId: 'photo-1470225620780-dba8ba36b745', story: 'Dancing under club lights — neon flashes, deep bass, slow-motion hair. The night belongs to you.' },
    ],
  },
  {
    title: 'Runway & Beauty',
    items: [
      { name: 'Runway', desc: 'Fashion show, designer looks', imageId: 'photo-1509631179647-0177331693ae', story: 'You walk a high-fashion runway in a stunning designer outfit. Cameras flash, the crowd watches — every step is power and elegance.' },
      { name: 'Glow Up', desc: 'Beauty transformation, before & after', imageId: 'photo-1522337360788-8b13dee7a37e', story: 'A dramatic beauty transformation — soft lighting, flawless makeup, hair done to perfection. You step into the frame glowing.' },
      { name: 'Wedding', desc: 'Bridal walk, golden light', imageId: 'photo-1519225421980-715cb0215aed', story: 'You walk down the aisle in a breathtaking wedding dress. Golden light, rose petals, every eye in the room on you.' },
      { name: 'Fitness', desc: 'Workout, strength, results', imageId: 'photo-1571019613454-1cb2f99b2d8b', story: 'You train hard in a premium gym — powerful lifts, sweat, focus. The camera captures every moment of your transformation.' },
    ],
  },
  {
    title: 'Cars',
    items: [
      { name: 'Ferrari', desc: 'Red supercar, open road', imageId: 'photo-1492144534655-ae79c964c9d7', story: 'You drive a red Ferrari along an empty coastal road at sunset. Engine roars, wind in your hair — pure adrenaline and freedom.' },
      { name: 'Lamborghini', desc: 'Luxury, speed, night city', imageId: 'photo-1567808291548-fc3ee04dbcf0', story: 'You pull up in a Lamborghini on a neon-lit city street. Doors open upward — heads turn, cameras flash.' },
      { name: 'Off-Road', desc: 'Desert, dust, power', imageId: 'photo-1503376780353-7e6692767b70', story: 'You push a massive 4x4 through desert dunes — dust clouds, roaring engine, golden sun. Raw power on raw terrain.' },
      { name: 'Race Track', desc: 'Full speed, helmet on', imageId: 'photo-1504215680853-026ed2a45def', story: 'You fly around a race track at full speed — helmet on, hands steady, tyres screaming. You own every corner.' },
    ],
  },
  {
    title: 'CEO',
    items: [
      { name: 'Office Entry', desc: 'Suit, confidence, slow-mo', imageId: 'photo-1507003211169-0a1dd7228f2d', story: 'You walk into a glass-walled corporate tower in a sharp suit — slow motion, confident stride, everyone takes notice.' },
      { name: 'Boardroom', desc: 'Deal, power, leadership', imageId: 'photo-1519389950473-47ba0277781c', story: 'You sit at the head of a boardroom table, signing a major deal. The team watches — you are the one in charge.' },
      { name: 'Private Jet', desc: 'Luxury travel, first class', imageId: 'photo-1540962351504-03099e0a754b', story: 'You board a private jet with a briefcase in hand. Leather seats, champagne, clouds below — business at the highest level.' },
      { name: 'Penthouse', desc: 'City view, success, night', imageId: 'photo-1486325212027-8081e485255e', story: 'You stand on a penthouse terrace overlooking the lit-up city skyline. Glass in hand, suit perfect — this is what success looks like.' },
    ],
  },
  {
    title: 'Sports',
    items: [
      { name: 'Basketball', desc: 'Court, dunk, crowd', imageId: 'photo-1546519638-68e109498ffc', story: 'You drive to the basket and slam it home — crowd erupts, slow motion, pure athletic power.' },
      { name: 'Football', desc: 'Stadium, goal, glory', imageId: 'photo-1431324155629-1a6deb1dec8d', story: 'You score the winning goal in a packed stadium — the crowd goes wild, you slide across the pitch in celebration.' },
      { name: 'Boxing', desc: 'Ring, power, fight night', imageId: 'photo-1549719386-74dfcbf7dbed', story: 'You stand in the boxing ring under bright lights — gloves up, focused, ready. The bell rings and you own the fight.' },
      { name: 'Surfing', desc: 'Waves, speed, freedom', imageId: 'photo-1502680390469-be75c86b636f', story: 'You ride a massive wave at golden hour — perfect form, spray flying, pure freedom on the water.' },
    ],
  },
  {
    title: 'Travel',
    items: [
      { name: 'Tokyo', desc: 'Neon streets, Japan, night', imageId: 'photo-1540959733332-eab4deabeeaf', story: 'You walk through the neon-lit streets of Tokyo at night — bright signs, busy crossings, total immersion in the city.' },
      { name: 'Dubai', desc: 'Skyscrapers, luxury, desert', imageId: 'photo-1512453979798-5ea266f8880c', story: 'You stand at the top of the Burj Khalifa looking out over Dubai — the desert city stretches to the horizon below you.' },
      { name: 'Bali', desc: 'Jungle, temples, sunrise', imageId: 'photo-1537996194471-e657df975ab4', story: 'You walk through a Balinese jungle at sunrise — ancient temples, mist, the sound of birds. Pure peace and adventure.' },
      { name: 'New York', desc: 'Manhattan, hustle, iconic', imageId: 'photo-1534430480872-3498386e7856', story: 'You cross a busy Manhattan intersection in style — yellow cabs, skyscrapers, the energy of the greatest city on earth.' },
    ],
  },
  {
    title: 'Action',
    items: [
      { name: 'Movie Hero', desc: 'Explosion, slow-mo, epic', imageId: 'photo-1478720568477-152d9b164e26', story: 'You walk away from an explosion in slow motion — debris flies, flames rise, you don\'t look back. Pure cinematic hero moment.' },
      { name: 'Spy Thriller', desc: 'Suit, mission, night', imageId: 'photo-1500099817043-86d46000d58f', story: 'You move through the shadows on a rooftop mission — earpiece in, suit on, city lights below. James Bond energy.' },
      { name: 'Apocalypse', desc: 'Post-apocalyptic, dust, epic', imageId: 'photo-1516912481808-3406841bd33c', story: 'You stand in a post-apocalyptic wasteland — dust storm behind you, gear on, ready for whatever comes next.' },
      { name: 'Superhero', desc: 'Cape, power, city above', imageId: 'photo-1531746020798-e6953c6e8e04', story: 'You leap off a skyscraper and soar above the city — cape flowing, lights below, the world is yours to protect.' },
    ],
  },
];


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
    sessionStorage.setItem('clipspark_description', story || character);
    router.push('/scenes');
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
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ display: 'block', width: 22, height: 2, borderRadius: 999, background: 'rgba(255,255,255,0.8)' }} />
          <span style={{ display: 'block', width: 16, height: 2, borderRadius: 999, background: 'rgba(255,255,255,0.8)' }} />
          <span style={{ display: 'block', width: 22, height: 2, borderRadius: 999, background: 'rgba(255,255,255,0.8)' }} />
        </button>
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
        </div>
      </div>

      {/* Hero slider */}
      <div style={{ position: 'relative', margin: '0 16px', height: 220, borderRadius: 20, overflow: 'hidden' }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === heroIndex ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: i === heroIndex ? 'auto' : 'none' }}
            onClick={() => handleStart('', s.story)}>
            <img
              src={`https://images.unsplash.com/${s.imageId}?w=800&h=600&fit=crop&q=80`}
              alt={s.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(1.2)', cursor: 'pointer' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.1) 0%, transparent 40%, rgba(10,10,15,0.88) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)', borderRadius: 999, padding: '3px 8px', marginBottom: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
                {s.tag}
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

      {/* Create modes */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px', paddingBottom: 2 }}>
          {[
            { title: 'Living Photo', desc: 'Bring one photo to life', route: '/animate', imageId: 'photo-1524504388940-b1c1722653e0' },
            { title: 'Photo Story', desc: 'Turn photos into a video', route: '/photos-to-video', imageId: 'photo-1516117172878-fd2c41f4a759' },
            { title: 'Beat Sync', desc: 'Scenes cut to the music', route: '/beat-cuts', imageId: 'photo-1470225620780-dba8ba36b745' },
          ].map(item => (
            <div key={item.route} onClick={() => router.push(item.route)} style={{ flexShrink: 0, width: 140, height: 90, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid rgba(255,255,255,0.07)' }}>
              <img src={`https://images.unsplash.com/${item.imageId}?w=280&h=180&fit=crop&q=80`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{item.title}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
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
