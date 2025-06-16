'use client';

import React, { useState, useEffect } from "react";
import WeeklySummary from './WeeklySummary';
import Image from 'next/image';
import type { WeeklyDashboardStats } from '../types/performance';
import { useRouter } from 'next/router';

const WARD_IMAGES: { [key: string]: string } = {
    Cardiology: "https://imgur.com/UITBIEP.png",
    Dermatology: "https://imgur.com/FggcQvb.png",
    ENT: "https://imgur.com/SZmjj9M.png",
    Ethics_And_Law: "https://imgur.com/NcipYSx.png",
    Medicine: "https://imgur.com/R0xe5bw.png",
    Musculoskeletal: "https://imgur.com/kwtHwD3.png",
    Orthopaedics: "https://i.imgur.com/OxuFobU.png",
    Obstetrics_and_Gynaecology: "https://imgur.com/2r7qQZp",
    Ophthalmology: "https://imgur.com/sjtXGt6.png",
    Paediatrics: "https://imgur.com/1428odG.png",
    Pharmacology: "https://imgur.com/LBDA03J.png",
    Psychiatry: "https://imgur.com/T4wXfVl.png",
    Respiratory: "https://imgur.com/XHJezEJ.png",
    Statistics: "https://imgur.com/A5Jisr0.png",
    Surgery: "https://imgur.com/DNlA9zR.png",
    Infectious_Diseases: "https://i.imgur.com/r9R223a.png",
    Breast: "https://i.imgur.com/MlX5F3N.png",
    Haematology: "https://i.imgur.com/7wxKm28.png",
    Oncology: "https://i.imgur.com/VhWN3WF.png",
    Gastroenterology: "https://i.imgur.com/09yl7kO.png",
    Endocrinology: "https://i.imgur.com/ACmbxGb.png",
    Upper_Gi_Hepatobiliary: "https://i.imgur.com/JRG2GGB.png",
    General_Surgery: "https://i.imgur.com/DNlA9zR.png",
    Obstetrics_Gynaecology: "https://i.imgur.com/2r7qQZp.png",
    Ear_Nose_And_Throat: "https://i.imgur.com/SZmjj9M.png",
    Urology: "https://i.imgur.com/YQxhgGw.png",
    Nephrology: "https://i.imgur.com/L0mcATy.png",
    Colorectal: "https://i.imgur.com/ECwQAEs.png",
    Vascular: "https://i.imgur.com/0ygPvkQ.png",
    Neurology: "https://i.imgur.com/Fnm71V8.png",
    Neurosurgery: "https://i.imgur.com/kEptxfG.png",
    Rheumatology: "https://i.imgur.com/QTDYksF.png",
};

const WARD_DISPLAY_NAMES: { [key: string]: string } = {
    Cardiology: "Cardiology",
    Dermatology: "Dermatology",
    ENT: "ENT",
    Ethics_And_Law: "Ethics & Law",
    Medicine: "Medicine",
    Musculoskeletal: "Musculoskeletal",
    Orthopaedics: "Orthopaedics",
    Obstetrics_and_Gynaecology: "Obs & Gynae",
    Ophthalmology: "Ophthalmology",
    Paediatrics: "Paediatrics",
    Pharmacology: "Pharmacology",
    Psychiatry: "Psychiatry",
    Respiratory: "Respiratory",
    Statistics: "Statistics",
    Surgery: "Surgery",
    Infectious_Diseases: "Infectious Diseases",
    Breast: "Breast",
    Haematology: "Haematology",
    Oncology: "Oncology",
    Gastroenterology: "Gastroenterology",
    Endocrinology: "Endocrinology",
    Upper_Gi_Hepatobiliary: "Upper GI & HPB",
    General_Surgery: "General Surgery",
    Obstetrics_Gynaecology: "Obs & Gynae",
    Ear_Nose_And_Throat: "ENT",
    Urology: "Urology",
    Nephrology: "Nephrology",
    Colorectal: "Colorectal",
    Vascular: "Vascular",
    Neurology: "Neurology",
    Neurosurgery: "Neurosurgery",
    Rheumatology: "Rheumatology",
};

type WardSelectionProps = {
  accessToken: string;
  refreshToken: string;
  onSelectCondition?: (condition: string, ward?: string) => void;
  onSelectWard?: (ward: string) => void;
  navigationMode?: 'inline' | 'route'; // default inline
};

export default function WardSelection({ accessToken, refreshToken, onSelectCondition, onSelectWard, navigationMode = 'inline' }: WardSelectionProps) {
    const [wardsData, setWardsData] = useState<Record<string, string[]>>({});
    const [progressData, setProgressData] = useState<Record<string, import("../types/performance").LevelStats>>({});
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const [hoveredWard, setHoveredWard] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('Anon_name');
    const [weeklyStats, setWeeklyStats] = useState<WeeklyDashboardStats | null>(null);
    const [weeklyStatsLoading, setWeeklyStatsLoading] = useState<boolean>(true);
    const [weeklyStatsError, setWeeklyStatsError] = useState<string | null>(null);
    const router = typeof window !== 'undefined' ? require('next/router').useRouter() : null;

    useEffect(() => {
        if (!accessToken || !refreshToken) return;
        const fetchData = async () => {
            try {
                const [wardsRes, progressRes, metaRes, weeklyStatsRes] = await Promise.all([
                    fetch("https://ukmla-case-tutor-api.onrender.com/wards", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: "application/json",
                        },
                        credentials: "include",
                    }),
                    fetch("https://ukmla-case-tutor-api.onrender.com/progress", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "X-Refresh-Token": refreshToken,
                            Accept: "application/json",
                        },
                        credentials: "include",
                    }),
                    fetch("https://ukmla-case-tutor-api.onrender.com/user_metadata/me", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        credentials: "include",
                    }),
                    fetch("https://ukmla-case-tutor-api.onrender.com/weekly_dashboard_stats", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        credentials: "include",
                    }),
                ]);
                const wardsData = await wardsRes.json();
                const progressData = await progressRes.json();
                const meta = await metaRes.json();
                const weeklyStatsData = await weeklyStatsRes.json();
                setWardsData(wardsData.wards);
                setProgressData(progressData.ward_stats);
                if (meta.anon_username) setUserName(meta.anon_username);
                setWeeklyStats(weeklyStatsData);
                setWeeklyStatsError(null);
            } catch (err) {
                console.error("Error loading wards, progress, or weekly stats:", err);
                setWeeklyStatsError('Failed to load weekly summary.');
            } finally {
                setWeeklyStatsLoading(false);
            }
        };
        fetchData();
    }, [accessToken, refreshToken]);

    const styles = {
        outer: {
            backgroundColor: "var(--color-bg)",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "80px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
            flexDirection: "column" as const,
            paddingLeft: "40px",
            paddingRight: "40px",
            position: "relative" as const,
        },
        container: {
            display: "grid",
            gap: "32px",
            justifyItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        card: {
            backgroundColor: "var(--color-card)",
            borderRadius: "16px",
            padding: "20px",
            width: "200px",
            boxShadow: "0 0 12px rgba(0,0,0,0.5)",
            textAlign: "center" as const,
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            wordBreak: "break-word" as const,
        },
        cardHover: {
            transform: "translateY(-6px)",
            boxShadow: "0 0 18px var(--color-accent)",
        },
        title: {
            fontSize: "10px",
            color: "var(--color-title)",
            marginBottom: "12px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
            wordBreak: "break-word" as const,
        },
        conditionTitle: {
            fontSize: "16px",
            color: "var(--color-title)",
            marginBottom: "20px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
            textAlign: "center" as const,
        },
        image: {
            width: "100%",
            height: "auto",
            aspectRatio: "1 / 1",
            objectFit: "cover" as const,
            borderRadius: "8px",
            marginBottom: "12px",
        },
        stat: {
            fontSize: "8px",
            color: "var(--color-text)",
            marginTop: "6px",
            wordBreak: "break-word" as const,
        },
        conditionList: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "12px",
            padding: "20px",
            justifyContent: "center",
            minHeight: "60vh",
        },
        conditionButton: {
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "10px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
        },
        resumeSection: {
            backgroundColor: "var(--color-card)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "32px",
            width: "100%",
            maxWidth: "600px",
        },
        resumeTitle: {
            fontSize: "12px",
            color: "var(--color-title)",
            marginBottom: "12px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
        },
        lastCaseCard: {
            backgroundColor: "#000",
            padding: "16px",
            borderRadius: "8px",
            border: "2px solid var(--color-accent)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "10px",
            color: "var(--color-text)",
        },
        historyItem: {
            fontSize: "9px",
            color: "var(--color-text)",
            borderBottom: "1px solid var(--color-border)",
            padding: "6px 0",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
        },
        historyTitle: {
            fontSize: "10px",
            color: "var(--color-text)",
            marginBottom: "8px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
        },
        centeredConditionScreen: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
            position: "relative" as const,
        },
        logoutButton: {
            position: "absolute" as const,
            top: "20px",
            right: "20px",
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "8px",
            fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
            transition: "transform 0.2s",
        },
        logoutButtonHover: {
            transform: "scale(1.05)",
        },
    };

    const onWardClick = (ward: string) => {
        if (navigationMode === 'route' && onSelectWard) {
            onSelectWard(ward);
        } else {
            setSelectedWard(ward);
        }
    };

    const handleActionClick = (ward: string, condition: string) => {
      if (router) {
        const encodedWard = encodeURIComponent(ward);
        const encodedCondition = encodeURIComponent(condition);
        router.push(`/${encodedWard}/${encodedCondition}?case_focus=both`);
      }
    };

    return (
        <div style={{ 
            background: "var(--color-bg)", 
            minHeight: "100vh", 
            padding: 24, 
            color: "var(--color-text)", 
            fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace"
        }}>
            <div style={{ width: "100%", margin: "0 auto" }}>
                {!selectedWard ? (
                    <div style={styles.outer} className="vcr-font">
                        {/* Weekly summary section with loading/error/data states */}
                        {weeklyStatsLoading ? (
                          <div style={{ color: '#ffd5a6', fontFamily: 'VT323', fontSize: 22, marginBottom: 24 }}>Loading weekly summary...</div>
                        ) : weeklyStatsError ? (
                          <div style={{ color: 'red', fontFamily: 'VT323', fontSize: 20, marginBottom: 24 }}>{weeklyStatsError}</div>
                        ) : weeklyStats ? (
                          <WeeklySummary
                            passed={weeklyStats.cases_passed}
                            failed={weeklyStats.cases_failed}
                            actionPoints={weeklyStats.action_points}
                            userName={userName}
                            onActionClick={handleActionClick}
                          />
                        ) : null}
                        
                        <div style={{ ...styles.conditionTitle, marginTop: 40 }}>Select a Ward</div>
                        <div style={styles.container} className="ward-grid-responsive">
                            {Object.keys(wardsData).map((ward) => {
                                const imageSrc = WARD_IMAGES[ward];
                                const displayName = WARD_DISPLAY_NAMES[ward] || ward;
                                const stats = progressData?.[ward] || { total_cases: 0, total_passes: 0, pass_rate: 0 };
                                return (
                                    <div
                                        key={ward}
                                        style={{
                                            ...styles.card,
                                            ...(hoveredWard === ward ? styles.cardHover : {}),
                                        }}
                                        onClick={() => onWardClick(ward)}
                                        onMouseEnter={() => setHoveredWard(ward)}
                                        onMouseLeave={() => setHoveredWard(null)}
                                        className="vcr-font"
                                    >
                                        <div style={styles.title}>{displayName}</div>
                                        <Image src={imageSrc} alt={ward} width={200} height={120} style={styles.image} />
                                        <div style={styles.stat}>
                                            ✅ {stats.total_cases} cases<br />
                                            ✅ Pass Rate: {stats.pass_rate.toFixed(1)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div style={styles.centeredConditionScreen} className="vcr-font">
                        <div style={styles.conditionTitle}>Select a Condition in {WARD_DISPLAY_NAMES[selectedWard] || selectedWard}</div>
                        <div style={styles.conditionList}>
                            {wardsData[selectedWard]?.map((condition: string) => (
                                <button
                                    key={condition}
                                    onClick={() => onSelectCondition && onSelectCondition(condition, selectedWard!)}
                                    style={styles.conditionButton}
                                    className="vcr-font"
                                >
                                    {condition}
                                </button>
                            ))}
                        </div>
                        <button
                            style={{
                                ...styles.logoutButton,
                                backgroundColor: "var(--color-card)",
                                color: "var(--color-text)",
                                marginTop: "20px"
                            }}
                            onClick={() => setSelectedWard(null)}
                        >
                            ← Back to Wards
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

if (typeof window !== 'undefined') {
  const styleId = 'ward-grid-responsive-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .ward-grid-responsive {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 1200px) {
        .ward-grid-responsive {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 900px) {
        .ward-grid-responsive {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 500px) {
        .ward-grid-responsive {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }
} 