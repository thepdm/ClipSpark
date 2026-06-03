'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ScriptRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/character'); }, [router]);
  return null;
}
