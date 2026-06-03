'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TabBar() {
  const path = usePathname();
  const isCreate = path === '/' || path.startsWith('/character') || path.startsWith('/story') || path.startsWith('/script') || path.startsWith('/scenes') || path.startsWith('/music') || path.startsWith('/result');
  const isProjects = path === '/projects';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(calc(100% - 48px), 382px)',
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      background: 'rgba(18,18,26,0.85)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.11), inset 0 1px 0 rgba(255,255,255,0.5)',
      zIndex: 100,
    }}>
      <TabItem href="/" active={isCreate} icon={<VideoIcon />} label="Create" />
      <TabItem href="/projects" active={isProjects} icon={<FolderIcon />} label="Projects" />
    </nav>
  );
}

function TabItem({ href, active, icon, label }: {
  href: string; active: boolean; icon: React.ReactNode; label: string;
}) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 40px',
      borderRadius: 999,
      background: active ? 'rgba(232,68,90,0.12)' : 'transparent',
      transition: 'background 0.2s',
      textDecoration: 'none',
      color: active ? '#E8445A' : 'rgba(60,60,67,0.40)',
    }}>
      <div style={{ width: 24, height: 24 }}>{icon}</div>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.1 }}>{label}</span>
    </Link>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
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
