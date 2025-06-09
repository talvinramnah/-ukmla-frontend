'use client';

import React, { useState, useEffect } from "react";
import PostCaseActions from "./PostCaseActions";
import { useRouter } from "next/navigation";
import { useTokens } from "./TokenContext";
import Image from "next/image";

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
  result: 'pass' | 'fail';
  feedback: {
    what_went_well: { management: string; investigation: string; other: string };
    what_can_be_improved: { management: string; investigation: string; other: string };
    actionable_points: string[];
  };
  thread_metadata?: {
    condition: string;
    ward: string;
    case_variation: number;
  };
  next_case_variation?: number;
  available_actions?: string[];
}

// Add helper type guards for backend JSON message types
function isInitialCaseMessage(data: unknown): data is { demographics: unknown; presenting_complaint: unknown; ice: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'demographics' in data &&
    'presenting_complaint' in data &&
    'ice' in data
  );
}

function isQuestionMessage(data: unknown): data is { question: unknown; attempt: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'question' in data &&
    'attempt' in data
  );
}

function isFeedbackMessage(data: unknown): data is { 
  result: 'pass' | 'fail'; 
  feedback: {
    what_went_well: { management: string; investigation: string; other: string };
    what_can_be_improved: { management: string; investigation: string; other: string };
    actionable_points: string[];
  }
} {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  if (!('result' in obj) || !('feedback' in obj)) {
    return false;
  }
  
  if (typeof obj.feedback !== 'object' || obj.feedback === null) {
    return false;
  }
  
  const feedback = obj.feedback as Record<string, unknown>;
  
  return (
    'what_went_well' in feedback &&
    'what_can_be_improved' in feedback &&
    'actionable_points' in feedback
  );
}

function isStatusCompleted(data: unknown): data is { status: 'completed' } {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { status?: string }).status === 'completed'
  );
}

function isErrorMessage(data: unknown): data is { error: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data
  );
}

function isStreamingProgress(data: unknown): data is { streaming: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'streaming' in data
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
    // New structured feedback - don't render in chat, will be handled by feedback card
    if (isFeedbackMessage(data)) {
      return null; // Don't render feedback messages in chat
    }
    // Status
    if ('status' in data && data.status === 'completed') {
      return <b>Case Completed!</b>;
    }
    // Error messages
    if ('error' in data) {
      return (
        <div style={{ color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '8px', borderRadius: '4px' }}>
          <b>Error:</b> {typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}
        </div>
      );
    }
    // Fallback: show as JSON
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  } catch {
    // Not JSON, fallback to plain text
    return <span>{msg.content}</span>;
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
        const start = async () => {
            try {
                const decodedCondition = decodeURIComponent(condition);
                let firstMessageReceived = false;
                await streamPost(
                    "https://ukmla-case-tutor-api.onrender.com/start_case",
                    { condition: decodedCondition },
                    (data: unknown) => {
                        if (data) {
                            // Clear loading message when first real message is received
                            if (!firstMessageReceived && !isStreamingProgress(data)) {
                                setMessages([]);
                                firstMessageReceived = true;
                            }

                            // Handle different types of messages
                            if (isInitialCaseMessage(data)) {
                                appendMessage({ role: 'assistant', content: JSON.stringify(data) });
                            } else if (isQuestionMessage(data)) {
                                appendMessage({ role: 'assistant', content: JSON.stringify(data) });
                                setAssistantMessageComplete(true);
                            } else if (isFeedbackMessage(data)) {
                                // Don't append feedback message to chat - it will be shown in the feedback card
                                setCaseCompletionData({
                                    is_completed: true,
                                    result: data.result,
                                    feedback: data.feedback,
                                    thread_metadata: undefined,
                                    next_case_variation: undefined,
                                    available_actions: ['new_case_same_condition', 'start_new_case', 'save_performance']
                                });
                                setCaseCompleted(true);
                                setShowActions(true);
                            } else if (isStatusCompleted(data)) {
                                // Status completed - case is finished
                                setCaseCompleted(true);
                                setShowActions(true);
                            } else if (isErrorMessage(data)) {
                                appendMessage({ role: 'assistant', content: JSON.stringify(data) });
                            } else if (isStreamingProgress(data)) {
                                // Ignore streaming progress indicators - they're just for UX feedback
                                // Don't append to messages, just continue
                            } else {
                                // Fallback for any other message type
                                appendMessage({ role: 'assistant', content: JSON.stringify(data) });
                            }
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
        try {
            await streamPost(
                "https://ukmla-case-tutor-api.onrender.com/continue_case",
                { thread_id: threadId, user_input: messageToSend },
                (data: unknown) => {
                  if (isQuestionMessage(data)) {
                    appendMessage({ role: "assistant", content: JSON.stringify(data, null, 2) });
                    setAssistantMessageComplete(true); // Enable input box immediately after question
                  } else if (isFeedbackMessage(data)) {
                    // Don't append feedback message to chat - it will be shown in the feedback card
                    setCaseCompletionData({
                      is_completed: true,
                      result: data.result,
                      feedback: data.feedback,
                    });
                    setCaseCompleted(true);
                    setShowActions(true);
                  } else if (isStatusCompleted(data)) {
                    setAssistantMessageComplete(true);
                    setCaseCompleted(true);
                    setShowActions(true);
                    if (onCaseComplete) onCaseComplete();
                  } else if (isErrorMessage(data)) {
                    appendMessage({ role: "system", content: JSON.stringify({ error: data.error }) });
                    setAssistantMessageComplete(true); // Allow user to try again
                  }
                }
            );
        } catch (err) {
            appendMessage({ role: "system", content: "❌ Failed to continue case." });
            setAssistantMessageComplete(true);
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
                                try {
                                    const data = JSON.parse(msg.content);
                                    // Filter out status: completed messages when case is done
                                    if (data.status === 'completed') {
                                        return false;
                                    }
                                } catch {
                                    // For non-JSON messages, check text content
                                    const text = msg.content.toLowerCase();
                                    if (text.includes("[case complete]") || 
                                        text.includes("[case completed]")) {
                                        return false;
                                    }
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
                
                {/* Updated Structured Feedback Card */}
                {caseCompleted && caseCompletionData && (
                    <div style={{
                        backgroundColor: "#000",
                        borderRadius: "16px",
                        padding: "20px",
                        marginBottom: "24px",
                        boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                        border: "2px solid #d77400",
                        textAlign: "center"
                    }}>
                        <div style={{
                            fontSize: "24px",
                            color: "#ffd5a6",
                            marginBottom: "16px",
                            fontFamily: "VT323",
                            fontWeight: "bold"
                        }}>
                            📋 Case Complete
                        </div>
                        
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "20px",
                            flexWrap: "wrap"
                        }}>
                            <div style={{
                                backgroundColor: caseCompletionData.result === 'pass' ? "#4CAF50" : "#f44336",
                                color: "#fff",
                                padding: "12px 20px",
                                borderRadius: "8px",
                                fontSize: "20px",
                                fontFamily: "VT323",
                                fontWeight: "bold"
                            }}>
                                {caseCompletionData.result === 'pass' ? "✅ PASS" : "❌ FAIL"}
                            </div>
                        </div>
                        
                        {/* What Went Well Section */}
                        <div style={{
                            backgroundColor: "rgba(76, 175, 80, 0.1)",
                            border: "1px solid #4CAF50",
                            padding: "16px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            textAlign: "left"
                        }}>
                            <div style={{ 
                                fontSize: "18px", 
                                color: "#4CAF50", 
                                marginBottom: "12px",
                                fontWeight: "bold",
                                fontFamily: "VT323"
                            }}>
                                ✅ What Went Well:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#ffd5a6", fontFamily: "VT323", fontSize: "16px" }}>
                                <li style={{ marginBottom: "8px" }}><strong>Management:</strong> {caseCompletionData.feedback.what_went_well.management}</li>
                                <li style={{ marginBottom: "8px" }}><strong>Investigation:</strong> {caseCompletionData.feedback.what_went_well.investigation}</li>
                                <li style={{ marginBottom: "8px" }}><strong>Other:</strong> {caseCompletionData.feedback.what_went_well.other}</li>
                            </ul>
                        </div>

                        {/* What Can Be Improved Section */}
                        <div style={{
                            backgroundColor: "rgba(255, 193, 7, 0.1)",
                            border: "1px solid #FFC107",
                            padding: "16px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            textAlign: "left"
                        }}>
                            <div style={{ 
                                fontSize: "18px", 
                                color: "#FFC107", 
                                marginBottom: "12px",
                                fontWeight: "bold",
                                fontFamily: "VT323"
                            }}>
                                🔄 What Can Be Improved:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#ffd5a6", fontFamily: "VT323", fontSize: "16px" }}>
                                <li style={{ marginBottom: "8px" }}><strong>Management:</strong> {caseCompletionData.feedback.what_can_be_improved.management}</li>
                                <li style={{ marginBottom: "8px" }}><strong>Investigation:</strong> {caseCompletionData.feedback.what_can_be_improved.investigation}</li>
                                <li style={{ marginBottom: "8px" }}><strong>Other:</strong> {caseCompletionData.feedback.what_can_be_improved.other}</li>
                            </ul>
                        </div>

                        {/* Actionable Points Section */}
                        <div style={{
                            backgroundColor: "rgba(33, 150, 243, 0.1)",
                            border: "1px solid #2196F3",
                            padding: "16px",
                            borderRadius: "8px",
                            textAlign: "left"
                        }}>
                            <div style={{ 
                                fontSize: "18px", 
                                color: "#2196F3", 
                                marginBottom: "12px",
                                fontWeight: "bold",
                                fontFamily: "VT323"
                            }}>
                                🎯 Action Points:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#ffd5a6", fontFamily: "VT323", fontSize: "16px" }}>
                                {caseCompletionData.feedback.actionable_points.map((point, index) => (
                                    <li key={index} style={{ marginBottom: "8px" }}>{point}</li>
                                ))}
                            </ul>
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
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
        </div>
    );
} 