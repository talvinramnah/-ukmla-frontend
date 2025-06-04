import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const TOP_IMAGE = 'https://i.pinimg.com/736x/df/c2/ba/dfc2ba3e8f202e967fa593fa1543f45f.jpg';
const BOTTOM_IMAGE = 'https://i.imgur.com/RETsWtF.jpeg';

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
            background: 'orange',
            borderRadius: '24px 24px 12px 12px',
            marginBottom: 8,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={TOP_IMAGE}
            alt="Dynamic Island Top Content"
            width={400}
            height={300}
            style={{ width: '100%', height: 'auto', borderRadius: 16, objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            flex: 3,
            background: 'orange',
            borderRadius: '12px 12px 24px 24px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={BOTTOM_IMAGE}
            alt="Dynamic Island Bottom Content"
            width={400}
            height={200}
            style={{ width: '100%', height: 'auto', borderRadius: 16, objectFit: 'cover' }}
          />
        </div>
      </aside>
    </div>
  );
} 