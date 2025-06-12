import React, { useEffect, useState } from 'react';

export default function Toast({ message, duration = 4000, onClose }: { message: string; duration?: number; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#000',
      color: '#ffd5a6',
      padding: '12px 24px',
      border: '2px solid #d77400',
      borderRadius: 12,
      fontFamily: 'VT323',
      fontSize: 18,
      zIndex: 2000,
      boxShadow: '0 0 12px rgba(0,0,0,0.5)'
    }}>
      {message}
    </div>
  );
} 