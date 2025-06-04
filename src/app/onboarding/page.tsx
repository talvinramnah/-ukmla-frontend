'use client';

import { useRouter } from 'next/navigation';
import OnboardingModal from '../../components/OnboardingModal';
import { useTokens } from '../../components/TokenContext';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const { accessToken, refreshToken } = useTokens();

  // If no tokens, redirect to auth
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      router.replace('/auth');
      return;
    }

    // Check if user actually needs onboarding
    fetch("https://ukmla-case-tutor-api.onrender.com/user_metadata/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // User is already onboarded
          router.replace('/wards');
        }
        // For 404, stay on onboarding page
        // For other errors, assume user needs onboarding
      })
      .catch((err) => {
        console.error("Error checking onboarding status:", err);
      });
  }, [accessToken, refreshToken, router]);

  const handleOnboardingComplete = () => {
    router.push('/wards');
  };

  if (!accessToken) {
    return null; // Will redirect in useEffect
  }

  return (
    <OnboardingModal
      accessToken={accessToken}
      onComplete={handleOnboardingComplete}
    />
  );
} 