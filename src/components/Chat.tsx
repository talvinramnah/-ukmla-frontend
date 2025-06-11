'use client';

import React, { useState, useEffect, useRef } from "react";
import PostCaseActions from "./PostCaseActions";
import { useRouter } from "next/navigation";
import { useTokens } from "./TokenContext";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

type ChatProps = {
  condition: string;
  accessToken: string;
  refreshToken: string;
  leftAlignTitle?: boolean;
  onCaseComplete?: () => void;
};

// Define interfaces for messages and caseCompletionData
interface Message {
  role: string;
  content: string;
}

interface CaseCompletionData {
  is_completed: boolean;
  feedback: string;
  score: number;
  thread_metadata?: {
    condition: string;
    ward: string;
    case_variation: number;
  };
  next_case_variation?: number;
  available_actions?: string[];
}

// Add helper type guards for backend JSON message types
function isErrorMessage(data: unknown): data is { error: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data
  );
}

// Add this function above the Chat component
function renderMessage(msg: Message) {
  try {
    const data = JSON.parse(msg.content);
    // Demographics/Initial Case
    if ('demographics' in data && 'presenting_complaint' in data) {
      return (
        <div>
          <strong>Patient: {data.demographics.name}, Age: {data.demographics.age}</strong>
          <div><b>History:</b> {data.presenting_complaint.history}</div>
          <div><b>Medical History:</b> {data.presenting_complaint.medical_history}</div>
          <div><b>Drug History:</b> {data.presenting_complaint.drug_history}</div>
          <div><b>Family History:</b> {data.presenting_complaint.family_history}</div>
          <div><b>Ideas/Concerns/Expectations:</b> {data.ice.ideas} / {data.ice.concerns} / {data.ice.expectations}</div>
        </div>
      );
    }
    // Question
    if ('question' in data) {
      return (
        <div>
          <b>Question:</b> {data.question}
          {data.assistant_feedback && data.assistant_feedback.length > 0 && (
            <div><i>Hint: {data.assistant_feedback}</i></div>
          )}
        </div>
      );
    }
    // Feedback/Score
    if ('feedback' in data && 'score' in data) {
      return (
        <div>
          <b>Feedback:</b> {data.feedback}
          <div><b>Score:</b> {data.score}/10</div>
        </div>
      );
    }
    // Status
    if ('status' in data && data.status === 'completed') {
      return <b>Case Completed!</b>;
    }
    // Fallback: show as markdown
    return <ReactMarkdown>{msg.content}</ReactMarkdown>;
  } catch {
    // Not JSON, fallback to markdown
    return <ReactMarkdown>{msg.content}</ReactMarkdown>;
  }
}

export default function Chat({ condition, accessToken, refreshToken, leftAlignTitle, onCaseComplete }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [threadId, setThreadId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [caseCompleted, setCaseCompleted] = useState(false);
    const [caseCompletionData, setCaseCompletionData] = useState<CaseCompletionData | null>(null);
    const [showActions, setShowActions] = useState(false);
    const [assistantMessageComplete, setAssistantMessageComplete] = useState(false);
    const router = useRouter();
    const { clearTokens } = useTokens();
    const [navLoading, setNavLoading] = useState<string | null>(null); // 'new', 'ward', 'logout'
    const [navError, setNavError] = useState<string | null>(null);
    const streamingMessageIndex = useRef<number | null>(null);

    const doctorImg = "https://i.imgur.com/NYfCYKZ.png";
    const studentImg = "https://i.imgur.com/D7DZ2Wv.png";

    const streamPost = async (url: string, body: unknown, onData: (data: unknown) => void, onHeaders?: (headers: Headers) => void) => {
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
                        if (typeof json === 'object' && json) {
                            onData(json);
                        }
                    } catch (err) {
                        console.error("Failed to parse SSE line", err, part);
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

    // Helper to add a message to the chat
    const appendMessage = (msg: Message) => {
      setMessages((prev: Message[]) => [...prev, msg]);
    };

    // Refactored streamPost handler for /start_case
    useEffect(() => {
        if (!condition || !accessToken || threadId) return;
        setMessages([{ role: "system", content: "⏳ Loading case..." }]);
        setAssistantMessageComplete(false);
        let turnBuffer = "";
        streamingMessageIndex.current = null;
        const start = async () => {
            try {
                const decodedCondition = decodeURIComponent(condition);
                setMessages([{ role: "system", content: "⏳ Loading case..." }]);
                await streamPost(
                    "https://ukmla-case-tutor-api.onrender.com/start_case",
                    { condition: decodedCondition },
                    (data: unknown) => {
                        // Handle assistant content chunks
                        if (typeof data === "object" && data !== null && "content" in data && typeof (data as { content: string }).content === "string") {
                            const chunk = (data as { content: string }).content;
                            if (streamingMessageIndex.current === null) {
                                // Remove loading message and append a new assistant message
                                setMessages(prev => {
                                    const filtered = prev.filter(m => m.role !== 'system' || !m.content.toLowerCase().includes('loading'));
                                    const newMessages = [...filtered, { role: "assistant", content: "" }];
                                    streamingMessageIndex.current = newMessages.length - 1;
                                    return newMessages;
                                });
                            }
                            turnBuffer += chunk;
                            setMessages(prev => {
                                const newMessages = [...prev];
                                if (streamingMessageIndex.current !== null) {
                                    newMessages[streamingMessageIndex.current] = {
                                        ...newMessages[streamingMessageIndex.current],
                                        content: turnBuffer
                                    };
                                }
                                return newMessages;
                            });
                            return;
                        }
                        // Handle turn_complete
                        if (typeof data === "object" && data !== null && "turn_complete" in data) {
                            setAssistantMessageComplete(true);
                            streamingMessageIndex.current = null;
                            return;
                        }
                        // Handle case_completed
                        if (typeof data === "object" && data !== null && (data as { type: string }).type === "case_completed") {
                            setCaseCompletionData({
                                is_completed: true,
                                feedback: (data as { feedback: string }).feedback,
                                score: (data as { score: number }).score,
                            });
                            setCaseCompleted(true);
                            setShowActions(true);
                            setAssistantMessageComplete(false);
                            streamingMessageIndex.current = null;
                            return;
                        }
                        // Handle errors
                        if (isErrorMessage(data)) {
                            appendMessage({ role: "system", content: JSON.stringify((data as { error: unknown }).error) });
                            streamingMessageIndex.current = null;
                            return;
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
                setMessages([{ role: "system", content: "❌ Failed to start case." }]);
                setAssistantMessageComplete(true);
                streamingMessageIndex.current = null;
                console.error('start_case error:', err);
            }
        };
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [condition, accessToken, threadId]);

    // Refactor handleSend to handle all structured JSON messages for /continue_case
    const handleSend = async () => {
        if (!input || !threadId || loading) return;
        const messageToSend = input;
        const userMsg = { role: "user", content: messageToSend };
        setInput("");
        setAssistantMessageComplete(false);
        appendMessage(userMsg);
        setLoading(true);
        let turnBuffer = "";
        streamingMessageIndex.current = null;
        try {
            await streamPost(
                "https://ukmla-case-tutor-api.onrender.com/continue_case",
                { thread_id: threadId, user_input: messageToSend },
                (data: unknown) => {
                    // Handle assistant content chunks
                    if (typeof data === "object" && data !== null && "content" in data && typeof (data as { content: string }).content === "string") {
                        const chunk = (data as { content: string }).content;
                        if (streamingMessageIndex.current === null) {
                            // Remove loading message and append a new assistant message
                            setMessages(prev => {
                                const filtered = prev.filter(m => m.role !== 'system' || !m.content.toLowerCase().includes('loading'));
                                const newMessages = [...filtered, { role: "assistant", content: "" }];
                                streamingMessageIndex.current = newMessages.length - 1;
                                return newMessages;
                            });
                        }
                        turnBuffer += chunk;
                        setMessages(prev => {
                            const newMessages = [...prev];
                            if (streamingMessageIndex.current !== null) {
                                newMessages[streamingMessageIndex.current] = {
                                    ...newMessages[streamingMessageIndex.current],
                                    content: turnBuffer
                                };
                            }
                            return newMessages;
                        });
                        return;
                    }
                    // Handle turn_complete
                    if (typeof data === "object" && data !== null && "turn_complete" in data) {
                        setAssistantMessageComplete(true);
                        streamingMessageIndex.current = null;
                        return;
                    }
                    // Handle case_completed
                    if (typeof data === "object" && data !== null && (data as { type: string }).type === "case_completed") {
                        setCaseCompletionData({
                            is_completed: true,
                            feedback: (data as { feedback: string }).feedback,
                            score: (data as { score: number }).score,
                        });
                        setCaseCompleted(true);
                        setShowActions(true);
                        setAssistantMessageComplete(false);
                        streamingMessageIndex.current = null;
                        return;
                    }
                    // Handle errors
                    if (isErrorMessage(data)) {
                        appendMessage({ role: "system", content: JSON.stringify((data as { error: unknown }).error) });
                        streamingMessageIndex.current = null;
                        return;
                    }
                }
            );
        } catch (err) {
            appendMessage({ role: "system", content: "❌ Failed to continue case." });
            setAssistantMessageComplete(true);
            streamingMessageIndex.current = null;
            console.error('continue_case error:', err);
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
                        .filter((msg: Message) => {
                            // If case is completed, filter out ANY message that contains case completion indicators
                            if (caseCompleted) {
                                const text = msg.content.toLowerCase();
                                if (text.includes("[case complete]") || 
                                    text.includes("[case completed]") || 
                                    text.startsWith("{") && text.includes("case completed")) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .map((msg: Message, idx: number) => {
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
                            <div key={idx} style={messageRowStyle}>
                                <Image
                                    src={avatar}
                                    alt={msg.role}
                                    width={48}
                                    height={48}
                                    style={{ imageRendering: "pixelated" }}
                                />
                                <div style={bubbleStyle}>
                                    {renderMessage(msg)}
                                </div>
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
                            onStartNewCase={handleStartNewCase}
                            navLoading={navLoading}
                        />
                        {navError && (
                            <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{navError}</div>
                        )}
                    </>
                )}
            </div>
            <style jsx global>{`
              .pixel-font ul, .pixel-font ol {
                margin: 0 0 0 1.5em;
                padding: 0;
                list-style-position: inside;
                color: inherit;
              }
              .pixel-font li {
                margin-bottom: 0.5em;
              }
            `}</style>
        </div>
    );
} 