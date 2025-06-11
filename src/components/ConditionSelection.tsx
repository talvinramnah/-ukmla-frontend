import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTokens } from './TokenContext';
import Image from 'next/image';

interface ConditionSelectionProps {
  ward: string;
}

interface ConditionStats {
  total_cases: number;
  avg_score: number;
}

interface ConditionData {
  total_cases?: number;
  avg_score?: number;
}

// Image configuration - structured for easy expansion to multiple images
const CONDITION_IMAGES = {
  // MVP: Single placeholder image for all conditions
  default: "https://live.staticflickr.com/34/70365463_886a12b513_o.jpg",
  
  // Future: Condition-specific or randomized images
  // Can be expanded to:
  // randomPool: ["image1.jpg", "image2.jpg", "image3.jpg"],
  // specific: { "Acute Coronary Syndrome": "cardio.jpg", ... }
};

// Helper function to get image for a condition (easily extensible)
const getConditionImage = (): string => {
  // MVP: Return default image
  return CONDITION_IMAGES.default;
  
  // Future implementation options:
  // Option 1: Random from pool
  // const randomIndex = Math.abs(condition.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % CONDITION_IMAGES.randomPool.length;
  // return CONDITION_IMAGES.randomPool[randomIndex];
  
  // Option 2: Condition-specific with fallback
  // return CONDITION_IMAGES.specific[condition] || CONDITION_IMAGES.default;
};

export default function ConditionSelection({ ward }: ConditionSelectionProps) {
  const { accessToken, refreshToken } = useTokens();
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionStats, setConditionStats] = useState<Record<string, ConditionStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
  const [investigation, setInvestigation] = useState(true);
  const [management, setManagement] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken || !refreshToken || !ward) return;
    
    const fetchConditionsAndStats = async () => {
      try {
        // Fetch conditions list
        const wardsRes = await fetch('https://ukmla-case-tutor-api.onrender.com/wards', {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });
        const wardsData = await wardsRes.json();
        const wardConditions: string[] = wardsData.wards?.[ward] || [];
        setConditions(wardConditions);

        // Fetch performance data for condition-level statistics
        if (wardConditions.length > 0) {
          try {
            console.log(`🔍 Fetching performance data for ${wardConditions.length} conditions in ward: ${ward}`);
            
            const progressRes = await fetch('https://ukmla-case-tutor-api.onrender.com/progress', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Refresh-Token': refreshToken,
                Accept: 'application/json',
              },
              credentials: 'include',
            });

            const stats: Record<string, ConditionStats> = {};
            
            if (progressRes.ok) {
              const progressData = await progressRes.json();
              console.log('📊 Progress API Response:', progressData);
              
              // Check if there's condition-level data in the response
              if (progressData.condition_stats) {
                console.log('✅ Found condition-level stats in API response');
                
                // Initialize all conditions with zero stats first
                wardConditions.forEach(condition => {
                  stats[condition] = { total_cases: 0, avg_score: 0.0 };
                });
                
                // Update with actual data where available
                Object.entries(progressData.condition_stats).forEach(([condition, conditionData]) => {
                  if (wardConditions.includes(condition)) {
                    const data = conditionData as ConditionData;
                    stats[condition] = {
                      total_cases: data.total_cases || 0,
                      avg_score: data.avg_score || 0.0
                    };
                  }
                });
                
                console.log('📋 Final condition stats:', stats);
                setConditionStats(stats);
              } else {
                console.error('❌ No condition-level stats found in API response');
                throw new Error('Condition-level statistics not available from API');
              }
            } else {
              console.error('❌ Progress API failed:', progressRes.status, progressRes.statusText);
              throw new Error(`API request failed with status ${progressRes.status}`);
            }
          } catch (performanceErr) {
            console.error('💥 Error fetching performance data:', performanceErr);
            // Don't set any stats - this will trigger the error display in the UI
            setConditionStats({});
            setError(performanceErr instanceof Error ? performanceErr.message : 'Failed to fetch performance data');
          }
        }
      } catch (err) {
        console.error('Error fetching conditions and stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch conditions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConditionsAndStats();
  }, [accessToken, refreshToken, ward]);

  if (loading) {
    return (
      <div style={{ 
        color: '#ffd5a6', 
        fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace", 
        padding: 32,
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading conditions...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: '#ff6b6b', 
        fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace", 
        padding: 32,
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }}>
        <div style={{ fontSize: '16px', marginBottom: 8 }}>❌ Error Loading Performance Data</div>
        <div style={{ fontSize: '12px', maxWidth: '600px', lineHeight: 1.4 }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#d77400',
            border: '2px solid #000',
            padding: '8px 16px',
            borderRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
            marginTop: 16
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleSelectCondition = (condition: string) => {
    if (!investigation && !management) {
      setErrorMsg('Please select at least 1');
      return;
    }
    setErrorMsg(null);
    const case_focus =
      investigation && management
        ? 'both'
        : investigation
        ? 'investigation'
        : management
        ? 'management'
        : 'both';
    router.push(`/chat?condition=${encodeURIComponent(condition)}&case_focus=${encodeURIComponent(case_focus)}`);
  };

  // Card styling matching WardSelection component
  const styles = {
    container: {
      background: "var(--color-bg)",
      minHeight: "100vh",
      padding: 24,
      color: "var(--color-text)",
      fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace"
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 40,
      maxWidth: '1200px',
      margin: '0 auto 40px auto'
    },
    title: {
      fontSize: "16px",
      color: "var(--color-title)",
      fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
    },
    backButton: {
      background: '#d77400',
      border: '2px solid #000',
      padding: '8px 16px',
      borderRadius: 10,
      color: '#fff',
      cursor: 'pointer',
      fontSize: 12,
      fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
      transition: 'transform 0.2s',
    },
    gridContainer: {
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
    conditionTitle: {
      fontSize: "10px",
      color: "var(--color-title)",
      marginBottom: "12px",
      fontFamily: "'VCR OSD Mono', 'Press Start 2P', monospace",
      wordBreak: "break-word" as const,
      lineHeight: "1.4",
    },
    image: {
      width: "100%",
      height: "auto",
      aspectRatio: "1 / 1",
      objectFit: "cover" as const,
      borderRadius: "8px",
      marginBottom: "12px",
    },
    stats: {
      fontSize: "16px",
      color: "var(--color-text)",
      marginTop: "6px",
      wordBreak: "break-word" as const,
      lineHeight: "1.3",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Select a Condition in {ward.replace(/_/g, ' ')}
        </h2>
        <button
          onClick={() => router.replace('/wards')}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ← Back to Wards
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'inherit', fontSize: 16 }}>Investigation</span>
          <span style={{ position: 'relative', display: 'inline-block', width: 48, height: 28 }}>
            <input
              type="checkbox"
              checked={investigation}
              onChange={() => {
                setInvestigation(v => {
                  if (!management && v) setErrorMsg(null);
                  return !v;
                });
              }}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: investigation ? '#2ecc40' : '#888',
                borderRadius: 20,
                transition: 'background 0.2s',
                boxShadow: investigation ? '0 0 6px #2ecc40' : '0 0 4px #222',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: investigation ? 24 : 2,
                  top: 2,
                  width: 24,
                  height: 24,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 1px 4px #0003',
                  transition: 'left 0.2s',
                }}
              />
            </span>
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'inherit', fontSize: 16 }}>Management</span>
          <span style={{ position: 'relative', display: 'inline-block', width: 48, height: 28 }}>
            <input
              type="checkbox"
              checked={management}
              onChange={() => {
                setManagement(v => {
                  if (!investigation && v) setErrorMsg(null);
                  return !v;
                });
              }}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: management ? '#2ecc40' : '#888',
                borderRadius: 20,
                transition: 'background 0.2s',
                boxShadow: management ? '0 0 6px #2ecc40' : '0 0 4px #222',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: management ? 24 : 2,
                  top: 2,
                  width: 24,
                  height: 24,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 1px 4px #0003',
                  transition: 'left 0.2s',
                }}
              />
            </span>
          </span>
        </label>
        {errorMsg && (
          <span style={{ color: '#ff6b6b', fontSize: 14, marginLeft: 12 }}>{errorMsg}</span>
        )}
      </div>

      <div style={styles.gridContainer} className="condition-grid-responsive">
        {conditions.map((condition) => {
          const stats = conditionStats[condition] || { total_cases: 0, avg_score: 0.0 };
          const imageSrc = getConditionImage();
          
          return (
            <div
              key={condition}
              style={{
                ...styles.card,
                ...(hoveredCondition === condition ? styles.cardHover : {}),
              }}
              onClick={() => handleSelectCondition(condition)}
              onMouseEnter={() => setHoveredCondition(condition)}
              onMouseLeave={() => setHoveredCondition(null)}
            >
              <div style={styles.conditionTitle}>{condition}</div>
              <Image 
                src={imageSrc} 
                alt={condition} 
                width={200} 
                height={120} 
                style={styles.image}
                priority={false}
              />
              <div style={styles.stats}>
                ✅ {stats.total_cases} cases<br />
                📝 Avg Score: {stats.avg_score.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Add responsive grid CSS (matching WardSelection)
if (typeof window !== 'undefined') {
  const styleId = 'condition-grid-responsive-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .condition-grid-responsive {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 1200px) {
        .condition-grid-responsive {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 900px) {
        .condition-grid-responsive {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 500px) {
        .condition-grid-responsive {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }
} 