'use client';

import { useRouter } from 'next/navigation';
import GameStartScreen from '../../components/GameStartScreen';
import { useTokens } from '../../components/TokenContext';
import { useEffect } from 'react';

export default function StartPage() {
  const router = useRouter();
  const { accessToken, refreshToken } = useTokens();

  // If user is already logged in, redirect to wards
  useEffect(() => {
    if (accessToken && refreshToken) {
      router.replace('/wards');
    }
  }, [accessToken, refreshToken, router]);

  const handleStart = () => {
    router.push('/auth');
  };

  return <GameStartScreen onStart={handleStart} />;
} 