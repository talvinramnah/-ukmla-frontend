'use client';

import React, { useState } from 'react';

interface WardProgressCheckboxProps {
  ward: string;
  isCompleted: boolean;
  onToggle: (ward: string, completed: boolean) => Promise<void>;
  disabled?: boolean;
}

export default function WardProgressCheckbox({ 
  ward, 
  isCompleted, 
  onToggle, 
  disabled = false 
}: WardProgressCheckboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onToggle(ward, !isCompleted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      position: 'relative' as const,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
    },
    checkbox: {
      width: '20px',
      height: '20px',
      border: isCompleted ? '2px solid #00ff00' : '2px solid #d77400',
      borderRadius: '4px',
      backgroundColor: isCompleted ? '#00ff00' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isCompleted ? '0 0 8px #00ff00' : 'none',
    },
    label: {
      fontSize: '12px',
      color: isCompleted ? '#00ff00' : '#ffd5a6',
      fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'color 0.2s ease',
    },
    loadingSpinner: {
      width: '12px',
      height: '12px',
      border: '2px solid #d77400',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    error: {
      position: 'absolute' as const,
      top: '100%',
      left: '0',
      fontSize: '10px',
      color: '#ff4444',
      fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.container} onClick={handleToggle}>
      <div style={styles.checkbox}>
        {isLoading ? (
          <div style={styles.loadingSpinner} />
        ) : isCompleted ? (
          <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
        ) : null}
      </div>
      <span style={styles.label}>
        {isCompleted ? 'Completed' : 'Mark as Complete'}
      </span>
      {error && <div style={styles.error}>{error}</div>}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 