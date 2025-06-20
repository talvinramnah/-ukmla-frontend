import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTokens } from './TokenContext';
import Image from 'next/image';

interface ConditionSelectionProps {
  ward: string;
}

interface ConditionStats {
  total_cases: number;
  pass_rate: number;
  total_passes: number;
}

interface ConditionData {
  total_cases?: number;
  pass_rate?: number;
  total_passes?: number;
}

// CATAAS API service function with 2-second timeout
const fetchRandomCatGif = async (): Promise<string> => {
  const TIMEOUT_MS = 2000; // 2 seconds
  const CATAAS_GIF_URL = 'https://cataas.com/cat/gif';
  const FALLBACK_IMAGE = "https://live.staticflickr.com/34/70365463_886a12b513_o.jpg";

  try {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS);
    });

    // Create the fetch promise
    const fetchPromise = fetch(CATAAS_GIF_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return CATAAS_GIF_URL; // Return the URL since CATAAS returns the image directly
      });

    // Race between fetch and timeout
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    console.log('🐱 CATAAS GIF loaded successfully');
    return result;
  } catch (error) {
    console.warn('⚠️ CATAAS GIF failed or timed out, using fallback:', error);
    return FALLBACK_IMAGE;
  }
};

// Image configuration - structured for easy expansion to multiple images
const CONDITION_IMAGES = {
  // Fallback: Static medical image
  fallback: "https://live.staticflickr.com/34/70365463_886a12b513_o.jpg",
  
  // Future: Condition-specific or randomized images
  // Can be expanded to:
  // randomPool: ["image1.jpg", "image2.jpg", "image3.jpg"],
  // specific: { "Acute Coronary Syndrome": "cardio.jpg", ... }
};

// Helper function to get image for a condition (now uses CATAAS API)
const getConditionImage = (catGifUrl: string | null): string => {
  // Return cat GIF if available, otherwise fallback
  return catGifUrl || CONDITION_IMAGES.fallback;
};

export default function ConditionSelection({ ward }: ConditionSelectionProps) {
  const { accessToken, refreshToken } = useTokens();
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionStats, setConditionStats] = useState<Record<string, ConditionStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
  const [caseFocus, setCaseFocus] = useState<"investigation" | "management" | "both">("both");
  const [catGifUrl, setCatGifUrl] = useState<string | null>(null);
  const router = useRouter();

  // Fetch cat GIF on component mount
  useEffect(() => {
    const loadCatGif = async () => {
      try {
        const gifUrl = await fetchRandomCatGif();
        setCatGifUrl(gifUrl);
      } catch (error) {
        console.error('Failed to load cat GIF:', error);
        setCatGifUrl(null); // Will use fallback
      }
    };

    loadCatGif();
  }, []); // Empty dependency array - only run once on mount

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
                  stats[condition] = { total_cases: 0, total_passes: 0, pass_rate: 0 };
                });
                
                // Update with actual data where available
                Object.entries(progressData.condition_stats).forEach(([condition, conditionData]) => {
                  if (wardConditions.includes(condition)) {
                    const data = conditionData as ConditionData;
                    stats[condition] = {
                      total_cases: data.total_cases ?? 0,
                      total_passes: data.total_passes ?? 0,
                      pass_rate: data.pass_rate ?? 0,
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
    router.push(`/${encodeURIComponent(ward)}/${encodeURIComponent(condition)}?case_focus=${caseFocus}`);
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
      {/* Focus Toggle Button Group */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 12 }}>
        {["investigation", "management", "both"].map(option => (
          <button
            key={option}
            onClick={() => setCaseFocus(option as "investigation" | "management" | "both")}
            style={{
              background: caseFocus === option ? "#d77400" : "#222",
              color: "#fff",
              border: "2px solid #d77400",
              borderRadius: 8,
              padding: "8px 18px",
              fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
              fontSize: 16,
              cursor: "pointer",
              fontWeight: caseFocus === option ? "bold" : "normal",
              transition: "background 0.2s"
            }}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      {/* End Focus Toggle */}
      <div style={styles.gridContainer} className="condition-grid-responsive">
        {conditions.map((condition) => {
          const stats = conditionStats[condition] || { total_cases: 0, total_passes: 0, pass_rate: 0 };
          const imageSrc = getConditionImage(catGifUrl);
          
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
                ✅ Pass Rate: {stats.pass_rate.toFixed(1)}%
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