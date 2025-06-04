'use client';

import React from "react";
import SkeuoGetStartedButton from "./SkeuoGetStartedButton";

type PostCaseActionsProps = {
  caseCompletionData: unknown;
  onNewCaseSameCondition: () => void;
  onSavePerformance: () => void;
  onStartNewCase: () => void;
  navLoading?: string | null; // 'new', 'ward', 'logout' or null
};

export default function PostCaseActions({
  caseCompletionData,
  onNewCaseSameCondition,
  onSavePerformance,
  onStartNewCase,
  navLoading,
}: PostCaseActionsProps) {
  if (!caseCompletionData) return null;

  return (
    <div className="post-case-actions" style={{
      display: "flex",
      flexDirection: "row",
      gap: 24,
      justifyContent: "center",
      width: "100%",
      marginTop: 16
    }}>
      <SkeuoGetStartedButton
        onClick={onNewCaseSameCondition}
        label="New case"
        disabled={!!navLoading}
      />
      <SkeuoGetStartedButton
        onClick={onStartNewCase}
        label="Change ward"
        disabled={!!navLoading}
      />
      <SkeuoGetStartedButton
        onClick={onSavePerformance}
        label="Logout"
        disabled={!!navLoading}
      />
    </div>
  );
} 