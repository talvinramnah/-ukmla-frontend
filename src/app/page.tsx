'use client';

import { useTokens } from "../components/TokenContext";
import AuthModal from "../components/AuthModal";
import MainFlow from "../components/MainFlow";
import OnboardingModal from "../components/OnboardingModal";
import GameStartScreen from "../components/GameStartScreen";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { accessToken, refreshToken, setTokens } = useTokens();
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] = useState<"unknown" | "needed" | "complete">("unknown");
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetch("https://ukmla-case-tutor-api.onrender.com/user_metadata/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          console.log("API /user_metadata/me status:", res.status);
          if (res.status === 404) {
            setOnboardingStatus("needed");
          } else if (res.status === 200) {
            setOnboardingStatus("complete");
          } else if (res.status === 401) {
            setOnboardingStatus("complete");
            setTokens("", "");
          } else {
            setOnboardingStatus("complete");
          }
        })
        .catch((err) => {
          console.log("API /user_metadata/me error:", err);
          setOnboardingStatus("complete");
        });
    }
  }, [accessToken, setTokens]);

  // Redirect to /wards once login+onboarding done and start screen dismissed
  useEffect(() => {
    if (!showStartScreen && accessToken && refreshToken && onboardingStatus === 'complete') {
      router.replace('/wards');
    }
  }, [showStartScreen, accessToken, refreshToken, onboardingStatus, router]);

  console.log("Render: onboardingStatus", onboardingStatus, "accessToken", accessToken, "refreshToken", refreshToken);

  if (showStartScreen) {
    return <GameStartScreen onStart={() => {
      setShowStartScreen(false);
      router.replace('/auth');
    }} />;
  }

  if (!accessToken || !refreshToken) {
    return <AuthModal onSuccess={setTokens} />;
  }

  if (onboardingStatus === "unknown") {
    return <div style={{ color: '#fff', padding: 40 }}>Checking onboarding status...</div>;
  }

  if (onboardingStatus === "needed") {
    return (
      <OnboardingModal
        accessToken={accessToken}
        onComplete={() => setOnboardingStatus("complete")}
      />
    );
  }

  return null; // Waiting for redirect
}

