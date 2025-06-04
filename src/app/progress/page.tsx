'use client';

import { useRouter } from 'next/navigation';
import ProgressModal from '../../components/ProgressModal';
import { useTokens } from '../../components/TokenContext';
import { useEffect } from 'react';

export default function ProgressPage() {
  const router = useRouter();
  const { accessToken, refreshToken } = useTokens();

  // If no tokens, redirect to auth
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      router.replace('/auth');
    }
  }, [accessToken, refreshToken, router]);

  const handleClose = () => {
    router.push('/wards');
  };

  if (!accessToken || !refreshToken) {
    return null; // Will redirect in useEffect
  }

  return (
    <ProgressModal
      accessToken={accessToken}
      refreshToken={refreshToken}
      onClose={handleClose}
    />
  );
} 