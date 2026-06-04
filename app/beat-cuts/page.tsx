'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { TRACKS } from '@/lib/mockMusic';
import { TabBar } from '@/components/TabBar';

const SAMPLE_CLIPS = [
  { label: 'Urban Night', imageId: 'photo-1470071459604-3b5ec3a7fe05', duration: '0:12' },
  { label: 'Forest Run', imageId: 'photo-1516117172878-fd2c41f4a759', duration: '0:08' },
  { label: 'City Lights', imageId: 'photo-1448375240586-882707db888b', duration: '0:15' },
];
const BAR_HEIGHTS = [40,65,30,80,55,45,70,35,85,50,45,75,30,60,85,40,55,70,45,65];

type Stage = 'upload' | 'track' | 'generating' | 'result';

export default function BeatCutsPage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [selectedClip, setSelectedClip] = useState(0);
  const [trackId, setTrackId] = useState(TRACKS[0].id);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<'none' | 'video' | 'gallery'>('none');
  const [uploadedVideoName, setUploadedVideoName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const selectedTrack = TRACKS.find(t => t.id === trackId) || TRACKS[0];

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0F', paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>Beat Cuts</span>
        <div style={{ width: 50 }} />
      </div>

      <main style={{ padding: '24px 20px 0' }}>
        {stage === 'upload' && (
          <>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.5, marginBottom: 8 }}>Choose your clip</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>AI will analyze the beat and cut your scenes perfectly in sync</p>

            {/* Upload options */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {/* Upload video */}
              <div onClick={() => { fileRef.current?.click(); }} style={{ flex: 1, border: `2px dashed ${uploadMode === 'video' ? '#8B5CF6' : 'rgba(139,92,246,0.3)'}`, borderRadius: 18, padding: '20px 14px', textAlign: 'center', cursor: 'pointer', background: uploadMode === 'video' ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.04)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', marginBottom: 3 }}>Upload Video</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>MP4, MOV</p>
              </div>

              {/* Choose from gallery */}
              <div onClick={() => photoRef.current?.click()} style={{ flex: 1, border: `2px dashed ${uploadMode === 'gallery' ? '#7C5CFC' : 'rgba(124,92,252,0.3)'}`, borderRadius: 18, padding: '20px 14px', textAlign: 'center', cursor: 'pointer', background: uploadMode === 'gallery' ? 'rgba(124,92,252,0.1)' : 'rgba(124,92,252,0.04)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', marginBottom: 3 }}>From Gallery</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Pick photos</p>
              </div>
            </div>

            {/* Gallery photos preview */}
            {galleryPhotos.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{galleryPhotos.length} photos selected</p>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                  {galleryPhotos.map((url, i) => (
                    <div key={i} style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(124,92,252,0.4)', position: 'relative' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 2, left: 2, width: 14, height: 14, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setUploadedVideoName(f.name); setUploadMode('video'); } }} />
            <input ref={photoRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { const files = Array.from(e.target.files || []); setGalleryPhotos(files.map(f => URL.createObjectURL(f))); setUploadMode('gallery'); }} />

            {/* Uploaded video preview */}
            {uploadMode === 'video' && uploadedVideoName && (
              <div style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 16, background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedVideoName}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Ready to analyze</p>
                </div>
                <button onClick={() => { setUploadMode('none'); setUploadedVideoName(''); }} style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            )}

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>Or try a sample clip</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {SAMPLE_CLIPS.map((clip, i) => (
                <div key={i} onClick={() => setSelectedClip(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 16, cursor: 'pointer', border: selectedClip === i ? '1.5px solid #8B5CF6' : '1px solid rgba(255,255,255,0.08)', background: selectedClip === i ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                  <img src={`https://images.unsplash.com/${clip.imageId}?w=120&h=80&fit=crop&q=70`} alt="" style={{ width: 56, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF' }}>{clip.label}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{clip.duration}</p>
                  </div>
                  {selectedClip === i && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
                </div>
              ))}
            </div>
            <button onClick={() => setStage('track')} style={{ width: '100%', padding: '16px', borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(139,92,246,0.35)' }}>
              Choose Music →
            </button>
          </>
        )}

        {stage === 'track' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', letterSpacing: -0.4, marginBottom: 6 }}>Choose your track</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>AI will find the beats and cut your video to them</p>

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
          </>
        )}

        {stage === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65svh', gap: 24 }}>
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

        {stage === 'result' && (
          <>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>Beat-synced ✓</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{SAMPLE_CLIPS[selectedClip].label} · {selectedTrack.title} · {selectedTrack.bpm} BPM</p>
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
              <img src={`https://images.unsplash.com/${SAMPLE_CLIPS[selectedClip].imageId}?w=800&h=450&fit=crop&q=80`} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
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
          </>
        )}
      </main>
      <TabBar />
    </div>
  );
}
