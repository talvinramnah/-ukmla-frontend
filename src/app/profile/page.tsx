'use client';

import React from 'react';
import ProfileDashboard from '../../components/ProfileDashboard';
import { useTokens } from '../../components/TokenContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { accessToken, refreshToken } = useTokens();
  const router = useRouter();

  // if not logged in redirect
  if (!accessToken || !refreshToken) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  return <ProfileDashboard />;
} 