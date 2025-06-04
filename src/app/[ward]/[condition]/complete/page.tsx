'use client';

import { useRouter, useParams } from 'next/navigation';
import PostCaseActions from '../../../../components/PostCaseActions';
import { useTokens } from '../../../../components/TokenContext';
import { useEffect } from 'react';

export default function PostCaseActionsPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken, refreshToken, clearTokens } = useTokens();

  const wardParam = typeof params.ward === 'string' ? params.ward : Array.isArray(params.ward) ? params.ward[0] : '';
  const conditionParam = typeof params.condition === 'string' ? params.condition : Array.isArray(params.condition) ? params.condition[0] : '';

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      router.replace('/auth');
    } else if (!conditionParam) {
      router.replace('/wards');
    }
  }, [accessToken, refreshToken, conditionParam, router]);

  const handleNewCaseSameCondition = () => {
    router.push(`/${encodeURIComponent(wardParam)}/${encodeURIComponent(conditionParam)}`);
  };
  const handleStartNewCase = () => {
    router.push('/wards');
  };
  const handleSavePerformance = () => {
    clearTokens();
    router.push('/auth');
  };

  if (!accessToken || !refreshToken || !conditionParam) return null;

  return (
    <PostCaseActions
      caseCompletionData={{}}
      onNewCaseSameCondition={handleNewCaseSameCondition}
      onSavePerformance={handleSavePerformance}
      onStartNewCase={handleStartNewCase}
    />
  );
} 