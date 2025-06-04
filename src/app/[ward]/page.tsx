'use client';

import { useRouter, useParams } from 'next/navigation';
import ConditionSelection from '../../components/ConditionSelection';
import { useTokens } from '../../components/TokenContext';
import { useEffect, useState } from 'react';
import useHasMounted from '../../components/useHasMounted';

export default function WardPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken, refreshToken } = useTokens();
  const [isDesktop, setIsDesktop] = useState<undefined | boolean>(undefined);
  const hasMounted = useHasMounted();
  const wardParam = typeof params.ward === 'string' ? params.ward : Array.isArray(params.ward) ? params.ward[0] : '';

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      router.replace('/auth');
    } else if (!wardParam) {
      router.replace('/wards');
    }
    if (typeof window !== 'undefined') {
      const checkWidth = () => setIsDesktop(window.innerWidth >= 1200);
      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }
  }, [accessToken, refreshToken, wardParam, router]);

  if (!hasMounted || !accessToken || !refreshToken || !wardParam || typeof isDesktop === 'undefined') {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', minHeight: '100vh' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ConditionSelection ward={wardParam} />
      </div>
    </div>
  );
} 