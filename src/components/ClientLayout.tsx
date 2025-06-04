"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTokens } from "./TokenContext";
import DynamicIsland from "./DynamicIsland";
import TopBar from "./TopBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { accessToken, refreshToken } = useTokens();
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Show DynamicIsland only when user is authenticated (has tokens)
  // This ensures it only shows during MainFlow (WardSelection/Chat) and not during GameStartScreen/AuthModal
  const showIsland = !!(accessToken && refreshToken);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  console.log('ClientLayout: pathname =', pathname, 'accessToken =', !!accessToken, 'showIsland =', showIsland, 'isDesktop =', isDesktop);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Left Main Column */}
      <div style={{ flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Global TopBar */}
        {accessToken && refreshToken && <TopBar />}
        {/* Scrollable Page Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
      {/* Dynamic Island Column */}
      {showIsland && isDesktop && (
        <div style={{ width: 320, minWidth: 280, maxWidth: 360, height: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
          <DynamicIsland />
        </div>
      )}
    </div>
  );
} 