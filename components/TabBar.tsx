'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function TabBar() {
  const path = usePathname();
  const router = useRouter();
  const isHome = path === '/';
  const isProjects = path === '/projects';
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = (route: string) => {
    setShowCreate(false);
    router.push(route);
  };

  return (
    <>
      {showCreate && (
        <>
          <div onClick={() => setShowCreate(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 98, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            width: 'min(calc(100% - 32px), 380px)',
            background: 'rgba(18,18,26,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, zIndex: 99,
            padding: '20px 16px 16px',
            boxShadow: '0 16px 60px rgba(0,0,0,0.6)',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 16, letterSpacing: 0.3 }}>Create</p>

            {/* Primary option */}
            <button onClick={() => handleCreate('/create')} style={{
              width: '100%', padding: '18px 20px', borderRadius: 18, marginBottom: 10,
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
            }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 3 }}>✦ Video from description</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Describe your idea — AI generates scenes</p>
            </button>

            {/* Secondary options */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleCreate('/photos-to-video')} style={{
                flex: 1, padding: '14px 14px', borderRadius: 16,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', marginBottom: 3 }}>From photos</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Multiple photos → video</p>
              </button>
              <button onClick={() => handleCreate('/animate')} style={{
                flex: 1, padding: '14px 14px', borderRadius: 16,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', marginBottom: 3 }}>Animate photo</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Bring one photo to life</p>
              </button>
            </div>
          </div>
        </>
      )}

      <nav style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(calc(100% - 24px), 420px)',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(14,14,20,0.92)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 999,
        boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
        zIndex: 100,
        padding: '0 4px',
      }}>
        <TabItem href="/" active={isHome} icon={<HomeIcon />} label="Home" />

        <button
          onClick={() => setShowCreate(v => !v)}
          style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
            background: showCreate ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: showCreate ? 'none' : '0 4px 20px rgba(139,92,246,0.55)',
            transform: 'translateY(-8px)',
            transition: 'all 0.2s',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: showCreate ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <TabItem href="/projects" active={isProjects} icon={<FolderIcon />} label="Projects" />
      </nav>
    </>
  );
}

function TabItem({ href, active, icon, label }: {
  href: string; active: boolean; icon: React.ReactNode; label: string;
}) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 16px',
      borderRadius: 999,
      textDecoration: 'none',
      color: active ? '#8B5CF6' : 'rgba(255,255,255,0.30)',
      transition: 'color 0.2s',
    }}>
      <div style={{ width: 24, height: 24 }}>{icon}</div>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.1 }}>{label}</span>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
