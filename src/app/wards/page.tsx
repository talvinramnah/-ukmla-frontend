'use client';

import { useRouter } from 'next/navigation';
import WardSelection from '../../components/WardSelection';
import { useTokens } from '../../components/TokenContext';
import { useEffect, useState } from 'react';
import useHasMounted from '../../components/useHasMounted';

export default function WardsPage() {
  const router = useRouter();
  const { accessToken, refreshToken } = useTokens();
  const [isDesktop, setIsDesktop] = useState<undefined | boolean>(undefined);
  const hasMounted = useHasMounted();

  // If no tokens, redirect to auth
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      router.replace('/auth');
    }
    if (typeof window !== 'undefined') {
      const checkWidth = () => setIsDesktop(window.innerWidth >= 1200);
      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }
  }, [accessToken, refreshToken, router]);

  const handleSelectWard = (ward: string) => {
    router.push(`/${encodeURIComponent(ward)}`);
  };

  // Debug logging
  console.log('[WardsPage] hasMounted:', hasMounted, 'isDesktop:', isDesktop);

  if (!hasMounted || !accessToken || !refreshToken || typeof isDesktop === 'undefined') {
    return null; // Will redirect in useEffect or wait for client
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <WardSelection
          accessToken={accessToken}
          refreshToken={refreshToken}
          onSelectWard={handleSelectWard}
          navigationMode="route"
        />
      </div>
    </div>
  );
} 