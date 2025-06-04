'use client';

import React, { useState, useEffect } from "react";

type ProgressModalProps = {
  accessToken: string;
  refreshToken: string;
  onClose: () => void;
};

export default function ProgressModal({ accessToken, refreshToken, onClose }: ProgressModalProps) {
    const [progressData, setProgressData] = useState<any>(null);
    const [sessionData, setSessionData] = useState<any>(null);

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
                            <div style={{ fontSize: "16px" }}>{overall.average_score.toFixed(1)}</div>
                            <div style={styles.statLabel}>Average Score</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ fontSize: "16px" }}>{overall.success_rate}%</div>
                            <div style={styles.statLabel}>Success Rate</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ fontSize: "16px" }}>{overall.total_badges}</div>
                            <div style={styles.statLabel}>Badges Earned</div>
                        </div>
                    </div>
                </div>
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>🏅 Ward Performance</div>
                    {Object.entries(ward_stats).map(([ward, stats]: any) => (
                        <div key={ward} style={styles.wardItem}>
                            {ward}: {stats.total_cases} cases – Avg Score: {stats.avg_score.toFixed(1)} – Success Rate: {stats.success_rate.toFixed(1)}%
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 