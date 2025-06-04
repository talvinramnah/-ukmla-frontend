import SkeuoGetStartedButton from "./SkeuoGetStartedButton";
import { useEffect } from "react";

// TODO: Type the props properly if needed
export default function GameStartScreen({ onStart }: { onStart: () => void }) {
    // Add keyboard event listener for spacebar
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault();
                onStart();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        
        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onStart]);

    return (
        <div
            className="vcr-font"
            style={{
                backgroundColor: "var(--color-bg)",
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "clamp(16px, 4vw, 32px)",
                gap: "clamp(24px, 6vh, 48px)",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <img
                src="https://imgur.com/tkpU61s.png"
                alt="Bleep64 Logo"
                style={{
                    maxWidth: "min(50%, 600px)",
                    maxHeight: "60vh",
                    width: "auto",
                    height: "auto",
                    imageRendering: "pixelated",
                    objectFit: "contain",
                }}
            />
            <SkeuoGetStartedButton onClick={onStart} label="Press Space to Start" />
        </div>
    );
} 