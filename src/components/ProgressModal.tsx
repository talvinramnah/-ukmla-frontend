'use client';

import React, { useState, useEffect } from "react";
import type { ProgressData, LevelStats } from "../types/performance";

type ProgressModalProps = {
  accessToken: string;
  refreshToken: string;
  onClose: () => void;
};

type FeedbackReport = {
  report_available: boolean;
  cases_until_next_report: number;
  action_plan?: string[];
  feedback_context?: unknown[];
  desired_specialty?: string;
};

export default function ProgressModal({ accessToken, refreshToken, onClose }: ProgressModalProps) {
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [sessionData, setSessionData] = useState<unknown>(null);
    const [feedbackReport, setFeedbackReport] = useState<FeedbackReport | null>(null);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const [progressRes, sessionRes] = await Promise.all([
                    fetch("https://ukmla-case-tutor-api.onrender.com/progress", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "X-Refresh-Token": refreshToken,
                            Accept: "application/json",
                        },
                        credentials: "include",
                    }),
                    fetch("https://ukmla-case-tutor-api.onrender.com/user/session_state", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: "application/json",
                        },
                        credentials: "include",
                    }),
                ]);
                if (!progressRes.ok || !sessionRes.ok) {
                    throw new Error("Failed to load progress");
                }
                const progressJson = await progressRes.json();
                const sessionJson = await sessionRes.json();
                setProgressData(progressJson);
                setSessionData(sessionJson);
            } catch (err) {
                console.error("❌ Error fetching progress:", err);
            }
        };
        fetchProgressData();
    }, [accessToken, refreshToken]);

    useEffect(() => {
      if (!accessToken) return;
      fetch('https://ukmla-case-tutor-api.onrender.com/feedback_report', {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => setFeedbackReport(data))
        .catch(() => setFeedbackReport(null));
    }, [accessToken]);

    const styles = {
        overlay: {
            position: "fixed" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
        },
        modal: {
            backgroundColor: "#4F1787",
            padding: "40px",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "700px",
            fontFamily: "'Press Start 2P'",
            color: "#ffd5a6",
            boxShadow: "0 0 20px #000",
            position: "relative" as const,
        },
        section: {
            marginBottom: "24px",
        },
        sectionTitle: {
            fontSize: "14px",
            color: "#FB773C",
            marginBottom: "12px",
        },
        statGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
        },
        statItem: {
            backgroundColor: "#000",
            border: "2px solid #FB773C",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center" as const,
        },
        statLabel: {
            fontSize: "10px",
            marginTop: "6px",
            color: "#ffd5a6",
        },
        closeButton: {
            position: "absolute" as const,
            top: "20px",
            right: "30px",
            padding: "10px 20px",
            fontFamily: "'Press Start 2P'",
            backgroundColor: "#FB773C",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "10px",
        },
        wardItem: {
            borderBottom: "1px solid #352753",
            padding: "10px 0",
            fontSize: "10px",
        },
    };

    if (!progressData || !sessionData) {
        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <p>Loading progress...</p>
                </div>
            </div>
        );
    }

    const { overall, ward_stats } = progressData;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>
                    ✖ Close
                </button>
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>📝 Overall Progress</div>
                    <div style={styles.statGrid}>
                        <div style={styles.statItem}>
                            <div style={{ fontSize: "16px" }}>{overall.total_cases}</div>
                            <div style={styles.statLabel}>Total Cases</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ fontSize: "16px" }}>{overall.total_passes}</div>
                            <div style={styles.statLabel}>Total Passes</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ fontSize: "16px" }}>{overall.pass_rate}%</div>
                            <div style={styles.statLabel}>Pass Rate</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ fontSize: "16px" }}>{overall.total_badges}</div>
                            <div style={styles.statLabel}>Badges Earned</div>
                        </div>
                    </div>
                </div>
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>🏅 Ward Performance</div>
                    {Object.entries(ward_stats).map(([ward, stats]) => {
                        const s = stats as LevelStats;
                        return (
                          <div key={ward} style={styles.wardItem}>
                            {ward}: {s.total_cases} cases – Passes: {s.total_passes} – Pass Rate: {s.pass_rate.toFixed(1)}%
                          </div>
                        );
                    })}
                </div>
                {/* Feedback Report Card */}
                <div style={{
                    background: '#000',
                    border: '2px solid #d77400',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 24,
                    color: '#ffd5a6',
                    boxShadow: '0 0 12px rgba(0,0,0,0.5)',
                    maxWidth: 600,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <div style={{ fontSize: 22, color: '#d77400', fontWeight: 'bold', marginBottom: 12 }}>
                        Feedback report
                    </div>
                    {feedbackReport ? (
                        feedbackReport.report_available ? (
                            <ul style={{ fontSize: 18, lineHeight: 1.5, margin: 0, paddingLeft: 24 }}>
                                {feedbackReport.action_plan?.map((point, idx) => (
                                    <li key={idx} style={{ marginBottom: 8 }}>{point}</li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ fontSize: 18 }}>
                                New feedback report available in {feedbackReport.cases_until_next_report} cases
                            </div>
                        )
                    ) : (
                        <div style={{ fontSize: 18 }}>Loading feedback report…</div>
                    )}
                </div>
            </div>
        </div>
    );
} 