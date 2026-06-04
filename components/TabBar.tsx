'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function TabBar() {
  const path = usePathname();
  const router = useRouter();
  const isHome = path === '/';
  const isProjects = path === '/projects';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(calc(100% - 40px), 380px)',
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
      padding: '0 8px',
    }}>
      <TabItem href="/" active={isHome} icon={<HomeIcon />} label="Home" />

      {/* Center create button */}
      <button
        onClick={() => router.push('/create')}
        style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(139,92,246,0.55)',
          transform: 'translateY(-8px)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

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
      padding: '8px 28px',
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
