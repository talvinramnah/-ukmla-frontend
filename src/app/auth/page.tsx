'use client';

import { useRouter } from 'next/navigation';
import AuthModal from '../../components/AuthModal';
import { useTokens } from '../../components/TokenContext';
import { useEffect } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const { accessToken, refreshToken, setTokens } = useTokens();

  // If user is already logged in, redirect to wards
  useEffect(() => {
    if (accessToken && refreshToken) {
      router.replace('/wards');
    }
  }, [accessToken, refreshToken, router]);

  const handleAuthSuccess = (accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    // After successful auth, we'll check onboarding status
    fetch("https://ukmla-case-tutor-api.onrender.com/user_metadata/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 404) {
          // User needs onboarding
          router.push('/onboarding');
        } else if (res.status === 200) {
          // User is onboarded, go to wards
          router.push('/wards');
        } else if (res.status === 401) {
          // Token invalid, stay on auth
          setTokens("", "");
        }
      })
      .catch((err) => {
        console.error("Error checking onboarding status:", err);
        // On error, assume user is onboarded
        router.push('/wards');
      });
  };

  return <AuthModal onSuccess={handleAuthSuccess} />;
} 