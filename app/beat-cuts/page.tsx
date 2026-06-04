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

      {/* Result */}
      {stage === 'result' && selectedItem && (
        <main style={{ padding: '24px 20px 0' }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>Beat-synced ✓</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{selectedTrack.title} · {selectedTrack.bpm} BPM</p>
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
            <img src={`https://images.unsplash.com/${selectedItem.imageId}?w=800&h=450&fit=crop&q=80`} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(139,92,246,0.85)', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#fff' }}>🎵 Beat-synced</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontWeight: 600 }}>CUT POINTS</p>
            <div style={{ display: 'flex', gap: 3 }}>
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} style={{ flex: 1, height: 28, borderRadius: 3, background: `rgba(139,92,246,${h/100 * 0.8})` }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStage('track')} style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↻ Change track</button>
            <button style={{ flex: 1, padding: '14px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(139,92,246,0.35)' }}>Export</button>
          </div>
        </main>
      )}

      <TabBar />
    </div>
  );
}
