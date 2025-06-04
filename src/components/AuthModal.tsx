'use client';

import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  onSuccess: (accessToken: string, refreshToken: string) => void;
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [canUseStorage, setCanUseStorage] = useState(false);

  const API_URL = "https://ukmla-case-tutor-api.onrender.com";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanUseStorage(true);
    }
  }, []);

  const handleAuth = async () => {
    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('❗️ Passwords do not match.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');
      if (canUseStorage) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      if (mode === 'signup') {
        setMessage('✅  Check your inbox to verify your email before logging in.');
      } else {
        setMessage('✅  Logged in!');
        onSuccess(data.access_token, data.refresh_token);
      }
    } catch (err: unknown) {
      setMessage(`❌  ${err instanceof Error ? err.message : 'An error occurred.'}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAuth();
  };

  const styles = {
    wrapper: {
      fontFamily: "'Press Start 2P', monospace",
      backgroundColor: "#180161",
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    } as React.CSSProperties,
    modal: {
      backgroundColor: "#4F1787",
      color: "#fff",
      padding: 32,
      borderRadius: 12,
      boxShadow: "0px 0px 30px #000",
      minWidth: "300px",
      maxWidth: "400px",
    } as React.CSSProperties,
    title: {
      fontSize: "12px",
      marginBottom: "20px",
      color: "#ffd5a6",
    } as React.CSSProperties,
    toggleRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    } as React.CSSProperties,
    toggleButton: (active: boolean) => ({
      flex: 1,
      margin: "0 4px",
      backgroundColor: active ? "#FB773C" : "#352753",
      color: "#fff",
      padding: "12px 10px",
      border: active ? "2px inset #ffd5a6" : "2px solid #ffd5a6",
      fontSize: "10px",
      cursor: "pointer",
      borderRadius: "6px",
      fontFamily: "'Press Start 2P'",
      boxShadow: active ? "0 0 8px #FB773C" : "none",
    } as React.CSSProperties),
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      fontSize: "10px",
      fontFamily: "'Press Start 2P'",
      border: "2px solid #FB773C",
      borderRadius: "6px",
      backgroundColor: "#000",
      color: "#fff",
    } as React.CSSProperties,
    submit: {
      width: "100%",
      backgroundColor: "#FB773C",
      color: "#fff",
      padding: "12px",
      border: "none",
      fontSize: "10px",
      cursor: "pointer",
      fontFamily: "'Press Start 2P'",
      borderRadius: "6px",
    } as React.CSSProperties,
    message: {
      fontSize: "10px",
      marginTop: "10px",
      color: "#ffd5a6",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.modal}>
        <div style={styles.title}>
          {mode === 'login' ? 'Log In To Bleep64' : 'Sign Up For Bleep64'}
        </div>
        <div style={styles.toggleRow}>
          <button
            style={styles.toggleButton(mode === 'login')}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            style={styles.toggleButton(mode === 'signup')}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {mode === 'signup' && (
          <input
            style={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        <button style={styles.submit} onClick={handleAuth}>
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
} 