'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTokens } from './TokenContext';

export default function TopBar() {
  const router = useRouter();
  const { clearTokens } = useTokens();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    clearTokens();
    router.push('/');
  };

  const navLinkStyle: React.CSSProperties = {
    color: '#d77400',
    fontFamily: 'VT323',
    fontSize: 20,
    cursor: 'pointer',
    padding: '8px 12px',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  };

  const logoutButtonStyle: React.CSSProperties = {
    background: '#d77400',
    color: '#fff',
    fontFamily: 'VT323',
    fontSize: 20,
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };

  const logoStyle: React.CSSProperties = {
    height: 40,
    width: 'auto',
    imageRendering: 'pixelated',
    cursor: 'pointer',
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '64px',
    backgroundColor: 'var(--color-bg)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    boxSizing: 'border-box',
    zIndex: 1000,
    position: 'relative',
  };

  const renderDesktopNav = () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <div
        style={navLinkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#d77400')}
        onClick={() => router.push('/profile')}
      >
        Profile
      </div>
      <div
        style={navLinkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#d77400')}
        onClick={() => router.push('/leaderboard')}
      >
        Leaderboard
      </div>
      <button
        style={logoutButtonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#b35f00')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#d77400')}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );

  const renderMobileMenu = () => (
    <>
      <div
        style={{ height: 32, width: 32, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 4 }}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {/* Hamburger icon */}
        <span style={{ height: 4, background: '#d77400', borderRadius: 2 }} />
        <span style={{ height: 4, background: '#d77400', borderRadius: 2 }} />
        <span style={{ height: 4, background: '#d77400', borderRadius: 2 }} />
      </div>
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            right: 16,
            backgroundColor: 'var(--color-bg)',
            border: '2px solid #d77400',
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            zIndex: 1001,
          }}
        >
          <div
            style={navLinkStyle}
            onClick={() => {
              router.push('/profile');
              setMenuOpen(false);
            }}
          >
            Profile
          </div>
          <div
            style={navLinkStyle}
            onClick={() => {
              router.push('/leaderboard');
              setMenuOpen(false);
            }}
          >
            Leaderboard
          </div>
          <button
            style={{ ...logoutButtonStyle, width: '100%' }}
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );

  return (
    <div style={containerStyle}>
      <img
        src="https://imgur.com/yQ7R3PU.png"
        alt="Logo"
        style={logoStyle}
        onClick={() => router.push('/wards')}
      />
      {isMobile ? renderMobileMenu() : renderDesktopNav()}
    </div>
  );
} 