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

// Interface for performance record from API
interface PerformanceRecord {
  condition: string;
  score: number;
  created_at?: string;
  [key: string]: unknown;
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
  const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
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
            // Fetch raw performance data for conditions in this ward
            const performanceRes = await fetch('https://ukmla-case-tutor-api.onrender.com/performance/conditions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ conditions: wardConditions }),
            });

            const stats: Record<string, ConditionStats> = {};
            
            // Initialize all conditions with zero stats
            wardConditions.forEach(condition => {
              stats[condition] = { total_cases: 0, avg_score: 0.0 };
            });

            if (performanceRes.ok) {
              const performanceData = await performanceRes.json();
              
              // Client-side aggregation of condition-level stats
              if (performanceData && Array.isArray(performanceData)) {
                const conditionGroups: Record<string, number[]> = {};
                
                // Group scores by condition
                performanceData.forEach((record: PerformanceRecord) => {
                  if (record.condition && typeof record.score === 'number') {
                    if (!conditionGroups[record.condition]) {
                      conditionGroups[record.condition] = [];
                    }
                    conditionGroups[record.condition].push(record.score);
                  }
                });
                
                // Calculate aggregated stats
                Object.entries(conditionGroups).forEach(([condition, scores]) => {
                  if (scores.length > 0) {
                    const total_cases = scores.length;
                    const avg_score = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                    stats[condition] = { total_cases, avg_score };
                  }
                });
              }
            }
            
            setConditionStats(stats);
          } catch (performanceErr) {
            console.error('Error fetching performance data:', performanceErr);
            // Fall back to zero stats if performance data fails
            const fallbackStats: Record<string, ConditionStats> = {};
            wardConditions.forEach(condition => {
              fallbackStats[condition] = { total_cases: 0, avg_score: 0.0 };
            });
            setConditionStats(fallbackStats);
          }
        }
      } catch (err) {
        console.error('Error fetching conditions and stats:', err);
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

  const handleSelectCondition = (condition: string) => {
    router.push(`/${encodeURIComponent(ward)}/${encodeURIComponent(condition)}`);
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