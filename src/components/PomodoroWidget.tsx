'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
}

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds

export default function PomodoroWidget() {
  const [state, setState] = useState<PomodoroState>(() => {
    // Load from sessionStorage or use default
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('pomodoro-state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            timeLeft: parsed.timeLeft || DEFAULT_TIME,
            isRunning: parsed.isRunning || false,
            isPaused: parsed.isPaused || false,
          };
        } catch {
          // Fallback to default if parsing fails
        }
      }
    }
    return {
      timeLeft: DEFAULT_TIME,
      isRunning: false,
      isPaused: false,
    };
  });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pomodoro-state', JSON.stringify(state));
    }
  }, [state]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1),
        }));
      }, 1000);
    } else if (state.timeLeft === 0 && state.isRunning) {
      // Timer completed
      setState(prev => ({
        ...prev,
        isRunning: false,
        isPaused: false,
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft]);

  const startTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setState({
      timeLeft: DEFAULT_TIME,
      isRunning: false,
      isPaused: false,
    });
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((DEFAULT_TIME - state.timeLeft) / DEFAULT_TIME) * 100;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg)',
    borderRadius: '12px 12px 24px 24px',
    fontFamily: 'VT323, monospace',
    color: 'var(--color-text)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  };

  const headerStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px 12px 20px',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    textAlign: 'left',
    boxSizing: 'border-box',
  };

  const contentWrapperStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    boxSizing: 'border-box',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'var(--color-accent)',
    margin: 0,
    fontFamily: 'VT323, monospace',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const timerDisplayStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: state.timeLeft <= 300 ? '#ff6b6b' : 'var(--color-text)', // Red when <5 min
    marginBottom: '18px',
    textAlign: 'center',
    fontFamily: 'VT323, monospace',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    marginBottom: '24px',
    overflow: 'hidden',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: state.timeLeft <= 300 ? '#ff6b6b' : 'var(--color-accent)',
    width: `${progressPercentage}%`,
    transition: 'width 1s linear, background-color 0.3s ease',
    borderRadius: '3px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'VT323, monospace',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '80px',
  };

  const startButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: state.isRunning ? 'var(--color-accent-hover)' : 'var(--color-accent)',
    color: 'white',
  };

  const pauseButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: state.isPaused ? 'var(--color-accent-hover)' : 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '2px solid var(--color-accent)',
  };

  const resetButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    border: '2px solid var(--color-border)',
  };

  const statusTextStyle: React.CSSProperties = {
    fontSize: '18px',
    color: 'var(--color-accent)',
    marginTop: '12px',
    textAlign: 'center',
    fontFamily: 'VT323, monospace',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <span>⏱️</span>
          <span>Pomodoro Timer</span>
        </h3>
      </div>
      <div style={contentWrapperStyle}>
        <div style={timerDisplayStyle}>{formatTime(state.timeLeft)}</div>

        <div style={progressBarStyle}>
          <div style={progressFillStyle} />
        </div>

        <div style={buttonContainerStyle}>
          {!state.isRunning && !state.isPaused && (
            <button onClick={startTimer} style={startButtonStyle}>
              Start
            </button>
          )}

          {state.isRunning && (
            <button onClick={pauseTimer} style={pauseButtonStyle}>
              Pause
            </button>
          )}

          {state.isPaused && (
            <button onClick={startTimer} style={startButtonStyle}>
              Resume
            </button>
          )}

          <button onClick={resetTimer} style={resetButtonStyle}>
            Reset
          </button>
        </div>

        <div style={statusTextStyle}>
          {state.isRunning && 'Focus time! 🎯'}
          {state.isPaused && 'Paused ⏸️'}
          {!state.isRunning &&
            !state.isPaused &&
            state.timeLeft === DEFAULT_TIME &&
            'Ready to start 🚀'}
          {!state.isRunning &&
            !state.isPaused &&
            state.timeLeft < DEFAULT_TIME &&
            'Session complete! ✅'}
        </div>
      </div>
    </div>
  );
} 