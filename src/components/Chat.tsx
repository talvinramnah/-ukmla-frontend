'use client';

import React, { useState, useEffect, useRef } from "react";
import PostCaseActions from "./PostCaseActions";
import { useRouter } from "next/navigation";
import { useTokens } from "./TokenContext";

type ChatProps = {
  condition: string;
  accessToken: string;
  refreshToken: string;
  leftAlignTitle?: boolean;
  onCaseComplete?: () => void;
};

export default function Chat({ condition, accessToken, refreshToken, leftAlignTitle, onCaseComplete }: ChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [threadId, setThreadId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [caseCompleted, setCaseCompleted] = useState(false);
    const [caseCompletionData, setCaseCompletionData] = useState<any>(null);
    const [showActions, setShowActions] = useState(false);
    const [assistantMessageComplete, setAssistantMessageComplete] = useState(false);
    const hasStarted = useRef(false);
    const router = useRouter();
    const { clearTokens } = useTokens();
    const [navLoading, setNavLoading] = useState<string | null>(null); // 'new', 'ward', 'logout'
    const [navError, setNavError] = useState<string | null>(null);

    const doctorImg = "https://i.imgur.com/NYfCYKZ.png";
    const studentImg = "https://i.imgur.com/D7DZ2Wv.png";

    const streamPost = async (url: string, body: any, onData: (data: any) => void, onHeaders?: (headers: Headers) => void) => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`[SSE] ${url} failed: ${response.status}`);
        }
        if (onHeaders) onHeaders(response.headers);
        const reader = response.body!.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split("\n\n");
            buffer = parts.pop()!;
            for (const part of parts) {
                if (part.startsWith("data:")) {
                    try {
                        const json = JSON.parse(part.slice(5).trim());
                        onData(json);
                    } catch (err) {
                        console.error("Failed to parse SSE line", err);
                    }
                }
            }
        }
    };

    // Handler for 'New case'
    const handleNewCaseSameCondition = async () => {
        setNavLoading('new');
        setNavError(null);
        try {
            setThreadId(null);
            setMessages([]);
            setCaseCompleted(false);
            setShowActions(false);
            setCaseCompletionData(null);
            setAssistantMessageComplete(false);
            // The effect will trigger the stream
        } catch (err) {
            setNavError('Failed to start new case.');
            console.error('Post-case nav error (new case):', err);
        } finally {
            setNavLoading(null);
        }
    };

    // Effect to start a new case
    useEffect(() => {
        if (!condition || !accessToken || threadId) return;
        setMessages([{ role: "system", text: "⏳ Loading case..." }]);
        setAssistantMessageComplete(false);
        let textBuffer = "";
        const start = async () => {
            try {
                // Decode the condition before sending to API
                const decodedCondition = decodeURIComponent(condition);
                await streamPost(
                    "https://ukmla-case-tutor-api.onrender.com/start_case",
                    { condition: decodedCondition },
                    (data) => {
                        if (data.content) {
                            textBuffer += data.content;
                            setMessages([{ role: "assistant", text: textBuffer }]);
                        }
                        if (data.is_completed) {
                            setCaseCompleted(true);
                            setCaseCompletionData(data);
                            setShowActions(true);
                        }
                        // Check if this is the end of streaming (no more content expected)
                        if (!data.content && !data.is_completed) {
                            setAssistantMessageComplete(true);
                        }
                    },
                    (headers) => {
                        const id = headers.get("X-Thread-Id");
                        if (id) {
                            setThreadId(id);
                        }
                    }
                );
            } catch (err) {
                setMessages([{ role: "system", text: "❌ Failed to start case." }]);
                setAssistantMessageComplete(true);
            }
        };
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [condition, accessToken, threadId]);

    const handleSend = async () => {
        if (!input || !threadId || loading) return;
        const messageToSend = input;
        const userMsg = { role: "user", text: messageToSend };
        let assistantIndex: number | null = null;
        setInput("");
        setAssistantMessageComplete(false);
        setMessages((prev) => {
            assistantIndex = prev.length + 1;
            return [...prev, userMsg, { role: "assistant", text: "" }];
        });
        setLoading(true);
        let assistantBuffer = "";
        let streamingComplete = false;
        try {
            await streamPost(
                "https://ukmla-case-tutor-api.onrender.com/continue_case",
                { thread_id: threadId, user_input: messageToSend },
                (data) => {
                    if (data.content) {
                        assistantBuffer += data.content;
                        setMessages((prev) => {
                            const updated = [...prev];
                            if (assistantIndex! < updated.length) {
                                updated[assistantIndex!] = { role: "assistant", text: assistantBuffer };
                            }
                            return updated;
                        });
                    }
                    if (data.is_completed) {
                        setCaseCompleted(true);
                        setCaseCompletionData(data);
                        setShowActions(true);
                        streamingComplete = true;
                        fetch("https://ukmla-case-tutor-api.onrender.com/save_performance", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                "X-Refresh-Token": refreshToken,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                thread_id: threadId,
                                score: data.score,
                                feedback: data.feedback,
                            }),
                        });
                    }
                }
            );
            // If case is not completed, set assistant message as complete after streaming
            if (!streamingComplete) {
                setAssistantMessageComplete(true);
            }
        } catch (err) {
            console.error("❌ continue_case error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "system", text: "❌ Failed to send message." },
            ]);
            setAssistantMessageComplete(true);
        } finally {
            setLoading(false);
        }
    };

    const handleStartNewCase = async () => {
        setNavLoading('ward');
        setNavError(null);
        try {
            router.push("/wards");
        } catch (err) {
            setNavError('Failed to change ward.');
            console.error('Post-case nav error (change ward):', err);
        } finally {
            setNavLoading(null);
        }
    };

    const handleSavePerformance = async () => {
        setNavLoading('logout');
        setNavError(null);
        try {
            clearTokens();
            router.push("/auth");
        } catch (err) {
            setNavError('Failed to logout.');
            console.error('Post-case nav error (logout):', err);
        } finally {
            setNavLoading(null);
        }
    };

    useEffect(() => {
      if (caseCompleted && onCaseComplete) {
        onCaseComplete();
      }
    }, [caseCompleted, onCaseComplete]);

    return (
        <div className="pixel-font" style={{ background: "#180161", minHeight: "100vh", padding: 32, color: "#ffd5a6", fontFamily: "VT323" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: leftAlignTitle ? 'left' : 'center' }}>
                    {decodeURIComponent(condition)}
                </h2>
                
                <div style={{ width: "100%", maxWidth: "800px" }}>
                    {messages
                        .filter((msg, index) => {
                            // If case is completed, filter out ANY message that contains case completion indicators
                            if (caseCompleted) {
                                const text = msg.text.toLowerCase();
                                if (text.includes("[case complete]") || 
                                    text.includes("[case completed]") || 
                                    text.startsWith("{") && text.includes("case completed")) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .map((msg, i) => {
                        const avatar = msg.role === "user" ? studentImg : doctorImg;
                        const messageRowStyle: React.CSSProperties = {
                            display: "flex",
                            flexDirection: msg.role === "user" ? "row-reverse" : "row",
                            alignItems: "flex-start",
                            gap: "10px",
                            marginBottom: "16px"
                        };
                        
                        const bubbleStyle: React.CSSProperties = {
                            backgroundColor: "#000",
                            border: "2px solid #d77400",
                            borderRadius: "12px",
                            padding: "14px",
                            fontSize: "18px",
                            color: "#ffd5a6",
                            maxWidth: "75%",
                            whiteSpace: "pre-line"
                        };

                        return (
                            <div key={i} style={messageRowStyle}>
                                <img
                                    src={avatar}
                                    alt={msg.role}
                                    width="48"
                                    height="48"
                                    style={{ imageRendering: "pixelated" }}
                                />
                                <div style={bubbleStyle}>{msg.text}</div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Structured Feedback Card */}
                {caseCompleted && caseCompletionData && (
                    <div style={{
                        backgroundColor: "var(--color-card)",
                        borderRadius: "16px",
                        padding: "20px",
                        marginBottom: "24px",
                        boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                        border: "2px solid var(--color-accent)",
                        textAlign: "center"
                    }}>
                        <div style={{
                            fontSize: "24px",
                            color: "var(--color-title)",
                            marginBottom: "16px",
                            fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
                            fontWeight: "bold"
                        }}>
                            📋 Case Complete
                        </div>
                        
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "16px",
                            flexWrap: "wrap"
                        }}>
                            <div style={{
                                backgroundColor: "var(--color-accent)",
                                color: "#fff",
                                padding: "12px 20px",
                                borderRadius: "8px",
                                fontSize: "20px",
                                fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
                                fontWeight: "bold"
                            }}>
                                ✅ Score: {caseCompletionData.score}/10
                            </div>
                        </div>
                        
                        <div style={{
                            backgroundColor: "rgba(0,0,0,0.3)",
                            padding: "16px",
                            borderRadius: "8px",
                            fontSize: "18px",
                            color: "var(--color-text)",
                            fontFamily: "'VT323', 'VCR OSD Mono', 'Press Start 2P', monospace",
                            lineHeight: "1.4",
                            textAlign: "left"
                        }}>
                            <div style={{ 
                                fontSize: "20px", 
                                color: "var(--color-accent)", 
                                marginBottom: "8px",
                                fontWeight: "bold"
                            }}>
                                📝 Feedback:
                            </div>
                            {caseCompletionData.feedback}
                        </div>
                    </div>
                )}
                
                {!caseCompleted && assistantMessageComplete && (
                    <div style={{ 
                        display: "flex", 
                        gap: "12px", 
                        width: "100%", 
                        maxWidth: "800px" 
                    }}>
                        <input
                            type="text"
                            placeholder="Type your answer..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: "14px",
                                borderRadius: "6px",
                                border: "2px solid #d77400",
                                fontFamily: "VT323",
                                fontSize: "18px",
                                backgroundColor: "#000",
                                color: "#ffd5a6"
                            }}
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            style={{
                                padding: "14px 20px",
                                backgroundColor: "#d77400",
                                color: "#ffd5a6",
                                border: "none",
                                borderRadius: "6px",
                                fontFamily: "VT323",
                                fontSize: "18px",
                                cursor: "pointer"
                            }}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                )}
                {showActions && (
                    <>
                        <PostCaseActions
                            caseCompletionData={caseCompletionData}
                            onNewCaseSameCondition={handleNewCaseSameCondition}
                            onSavePerformance={handleSavePerformance}
                            onViewProgress={() => {}}
                            onStartNewCase={handleStartNewCase}
                            navLoading={navLoading}
                        />
                        {navError && (
                            <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{navError}</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 