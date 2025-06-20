import React, { useEffect, useState } from 'react';
import NotepadWidget from './NotepadWidget';
import PomodoroWidget from './PomodoroWidget';

export default function DynamicIsland() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Handler to check window width - reduced from 1200 to 1024 for better compatibility
    const checkWidth = () => {
      const width = window.innerWidth;
      const shouldShow = width >= 1024;
      setIsDesktop(shouldShow);
      console.log(`DynamicIsland: Window width ${width}px, showing: ${shouldShow}`);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  console.log('DynamicIsland render:', { isDesktop });

  if (!isDesktop) {
    console.log('DynamicIsland: Not showing due to screen width');
    return null;
  }

  // NOTE: For sticky to work, parent container must have height: 100vh and flex-grow: 0.
  return (
    <div style={{ height: '100vh', flexGrow: 0, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <aside
        aria-label="Dynamic Island"
        style={{
          width: 320,
          minWidth: 280,
          maxWidth: 320,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 20,
          right: 10,
          zIndex: 10,
          background: 'transparent',
          marginLeft: 4,
        }}
      >
        <div
          style={{
            flex: 7,
            marginBottom: 8,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
          }}
        >
          <NotepadWidget />
        </div>
        <div
          style={{
            flex: 3,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
          }}
        >
          <PomodoroWidget />
        </div>
      </aside>
    </div>
  );
} 
