'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { TRACKS } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const BAR_HEIGHTS = [40,65,30,80,55,45,70,35,85,50,45,75,30,60,85,40,55,70,45,65];

// Simulated gallery — looks like a real camera roll
const GALLERY_GROUPS = [
  {
    date: 'Today',
    items: [
      { id: 'g1', imageId: 'photo-1534528741775-53994a69daeb', type: 'video', duration: '0:23' },
      { id: 'g2', imageId: 'photo-1573843981267-be1999ff37cd', type: 'photo' },
      { id: 'g3', imageId: 'photo-1529626455594-4ff0802cfb7e', type: 'video', duration: '0:41' },
      { id: 'g4', imageId: 'photo-1524504388940-b1c1722653e0', type: 'photo' },
      { id: 'g5', imageId: 'photo-1516117172878-fd2c41f4a759', type: 'video', duration: '0:12' },
      { id: 'g6', imageId: 'photo-1519501025264-65ba15a82390', type: 'photo' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: 'g7', imageId: 'photo-1470071459604-3b5ec3a7fe05', type: 'video', duration: '1:04' },
      { id: 'g8', imageId: 'photo-1448375240586-882707db888b', type: 'video', duration: '0:08' },
      { id: 'g9', imageId: 'photo-1426604966848-d7adac402bff', type: 'photo' },
      { id: 'g10', imageId: 'photo-1507003211169-0a1dd7228f2d', type: 'photo' },
      { id: 'g11', imageId: 'photo-1441974231531-c6227db76b6e', type: 'video', duration: '0:31' },
      { id: 'g12', imageId: 'photo-1493246507139-91e8fad9978e', type: 'photo' },
    ],
  },
  {
    date: 'June 1',
    items: [
      { id: 'g13', imageId: 'photo-1469474968028-56623f02e42e', type: 'photo' },
      { id: 'g14', imageId: 'photo-1531746020798-e6953c6e8e04', type: 'video', duration: '0:55' },
      { id: 'g15', imageId: 'photo-1447752875215-b2761acb3c5d', type: 'video', duration: '0:17' },
      { id: 'g16', imageId: 'photo-1544005313-94ddf0286df2', type: 'photo' },
      { id: 'g17', imageId: 'photo-1470225620780-dba8ba36b745', type: 'video', duration: '0:29' },
      { id: 'g18', imageId: 'photo-1536440136628-849c177e76a1', type: 'photo' },
    ],
  },
];

type Stage = 'gallery' | 'track' | 'generating' | 'result';

export default function BeatCutsPage() {
  const [stage, setStage] = useState<Stage>('gallery');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trackId, setTrackId] = useState(TRACKS[0].id);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const selectedItems = GALLERY_GROUPS.flatMap(g => g.items).filter(i => selectedIds.includes(i.id));
  const selectedItem = selectedItems[0];
  const selectedTrack = TRACKS.find(t => t.id === trackId) || TRACKS[0];

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Link href="/" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>Beat Cuts</span>
        {stage === 'gallery' && selectedIds.length > 0 ? (
          <button onClick={() => setStage('track')} style={{ padding: '7px 16px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Next →
          </button>
        ) : (
          <div style={{ width: 60 }} />
        )}
      </div>

      {/* Gallery */}
      {stage === 'gallery' && (
        <div style={{ padding: '16px 0 0' }}>
          <div style={{ padding: '0 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.4 }}>Recents</p>
            <button onClick={() => fileRef.current?.click()} style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer' }}>
              Import ↑
            </button>
          </div>
          <input ref={fileRef} type="file" accept="video/*,image/*" multiple style={{ display: 'none' }} />

          {GALLERY_GROUPS.map(group => (
            <div key={group.date} style={{ marginBottom: 20 }}>
              <p style={{ padding: '0 16px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                {group.date}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: '0 2px' }}>
                {group.items.map(item => {
                  const selIdx = selectedIds.indexOf(item.id);
                  const isSelected = selIdx !== -1;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      style={{ position: 'relative', aspectRatio: '1', cursor: 'pointer', overflow: 'hidden' }}
                    >
                      <img
                        src={`https://images.unsplash.com/${item.imageId}?w=200&h=200&fit=crop&q=70`}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isSelected ? 'brightness(0.6)' : 'none' }}
                      />
                      {item.type === 'video' && !isSelected && (
                        <div style={{ position: 'absolute', bottom: 5, right: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{item.duration}</span>
                        </div>
                      )}
                      {isSelected && (
                        <div style={{ position: 'absolute', inset: 0, border: '3px solid #8B5CF6', pointerEvents: 'none' }}>
                          <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                            {selIdx + 1}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedIds.length > 0 && (
            <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
              <button onClick={() => setStage('track')} style={{ padding: '14px 36px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(139,92,246,0.5)', whiteSpace: 'nowrap' }}>
                Use {selectedIds.length} clip{selectedIds.length > 1 ? 's' : ''} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Track selection */}
      {stage === 'track' && (
        <main style={{ padding: '24px 20px 0' }}>
          {selectedItem && (
            <div style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', position: 'relative', height: 160 }}>
              <img src={`https://images.unsplash.com/${selectedItem.imageId}?w=800&h=400&fit=crop&q=80`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.7))' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{selectedItem.type === 'video' ? `🎬 Video · ${selectedItem.duration}` : '📸 Photo'}</p>
              </div>
            </div>
          )}
          <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.4, marginBottom: 6 }}>Choose music</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>AI will cut your clip to the beat</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {TRACKS.map(t => (
              <div key={t.id} onClick={() => setTrackId(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 16, cursor: 'pointer', border: trackId === t.id ? `1.5px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)', background: trackId === t.id ? `${t.color}12` : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${t.color},${t.color}88)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF', marginBottom: 2 }}>{t.title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.genre} · {t.bpm} BPM</p>
                </div>
                {trackId === t.id && <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
              </div>
            ))}
          </div>
          <button onClick={() => { setStage('generating'); setTimeout(() => setStage('result'), 3000); }} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(139,92,246,0.35)' }}>
            ✨ Analyze & Cut
          </button>
        </main>
      )}

      {/* Generating */}
      {stage === 'generating' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70svh', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 52 }}>
            {BAR_HEIGHTS.slice(0, 14).map((h, i) => (
              <div key={i} style={{ width: 5, borderRadius: 3, height: `${h}%`, background: `linear-gradient(to top,#8B5CF6,#EC4899)`, animation: `pulse ${0.5+(i%3)*0.15}s ease-in-out infinite alternate`, animationDelay: `${i*0.06}s` }} />
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F0FF', marginBottom: 6 }}>Analyzing beat...</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Finding cuts at {selectedTrack.bpm} BPM · {selectedTrack.title}</p>
          </div>
        </div>
      )}

      {/* Result — CapCut-style editor */}
      {stage === 'result' && selectedItem && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100svh - 60px)' }}>

          {/* Top controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', flexShrink: 0 }}>
            <button onClick={() => setStage('gallery')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✕</button>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF' }}>{selectedTrack.title}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{selectedTrack.bpm} BPM · Beat-synced</p>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
          </div>

          {/* Full-screen video preview */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <img src={`https://images.unsplash.com/${selectedItem.imageId}?w=800&h=1200&fit=crop&q=80`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Play button */}
            <button style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>

          {/* Editor bottom panel */}
          <div style={{ flexShrink: 0, background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Audio waveform track */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 6px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </div>
              <div style={{ flex: 1, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 1, padding: '0 6px' }}>
                {BAR_HEIGHTS.map((h, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 1, height: `${Math.max(20, h * 0.4)}%`, background: i % 4 === 0 ? 'rgba(16,185,129,0.8)' : 'rgba(255,255,255,0.25)' }} />
                ))}
                {/* Playhead */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', width: 2, background: '#10B981', borderRadius: 1 }} />
              </div>
            </div>

            {/* Clip strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 16px 10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 3, overflowX: 'auto', position: 'relative' }}>
                {selectedIds.map((id, i) => {
                  const item = GALLERY_GROUPS.flatMap(g => g.items).find(it => it.id === id);
                  const isActive = i === 0;
                  return item ? (
                    <div key={id} style={{ width: 70, height: 52, borderRadius: 6, overflow: 'hidden', flexShrink: 0, position: 'relative', border: isActive ? '2.5px solid #fff' : '1.5px solid rgba(255,255,255,0.15)' }}>
                      <img src={`https://images.unsplash.com/${item.imageId}?w=140&h=104&fit=crop&q=70`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isActive && (
                        <div style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '1px 4px', fontSize: 9, fontWeight: 700, color: '#fff' }}>4.3</div>
                      )}
                    </div>
                  ) : null;
                })}
                <div style={{ width: 36, height: 52, borderRadius: 6, border: '1.5px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>+</div>
              </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { icon: '⇄', label: 'REPLACE' },
                { icon: '⊢', label: 'SPLIT' },
                { icon: '⊡', label: 'SCALE' },
                { icon: '🗑', label: 'DELETE' },
                { icon: '⧉', label: 'DUPLICATE' },
              ].map(tool => (
                <button key={tool.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
                  <span style={{ fontSize: 20, color: '#fff' }}>{tool.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5 }}>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
