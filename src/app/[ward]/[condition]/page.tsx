'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Chat from '../../../components/Chat';
import { useTokens } from '../../../components/TokenContext';
import { useEffect, useState } from 'react';
import useHasMounted from '../../../components/useHasMounted';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { accessToken, refreshToken } = useTokens();
  const [isDesktop, setIsDesktop] = useState<undefined | boolean>(undefined);
  const hasMounted = useHasMounted();

  const conditionParam = typeof params.condition === 'string' ? params.condition : Array.isArray(params.condition) ? params.condition[0] : '';
  const caseFocusParam = searchParams.get('case_focus') || 'both';

  // Redirects & screen width
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      router.replace('/auth');
    } else if (!conditionParam) {
      router.replace('/wards');
    }
    if (typeof window !== 'undefined') {
      const checkWidth = () => setIsDesktop(window.innerWidth >= 1200);
      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }
  }, [accessToken, refreshToken, conditionParam, router]);

  const handleCaseComplete = () => {
    // Stay on chat page; Chat component will show feedback card
  };

  if (!hasMounted || !accessToken || !refreshToken || !conditionParam || typeof isDesktop === 'undefined') {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', minHeight: '100vh' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <button
          onClick={() => router.replace('/wards')}
          style={{
            margin: '16px',
            background: '#d77400',
            border: '3px solid #000',
            padding: '8px 20px',
            borderRadius: 12,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 20,
            fontFamily: 'VT323',
          }}
        >
          ← Back to Wards
        </button>
        <Chat
          condition={conditionParam}
          caseFocus={caseFocusParam}
          accessToken={accessToken}
          refreshToken={refreshToken}
          onCaseComplete={handleCaseComplete}
          leftAlignTitle={isDesktop}
        />
      </div>
    </div>
  );
} 