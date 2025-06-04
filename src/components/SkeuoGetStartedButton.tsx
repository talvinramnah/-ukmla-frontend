'use client';

import { motion, useAnimation } from "framer-motion";
import { useRef } from "react";

export default function SkeuoGetStartedButton({ onClick, label, disabled }: { onClick?: () => void, label: string, disabled?: boolean }) {
    const controls = useAnimation();
    // Removed clickSound and audio for now

    const handleClick = async () => {
        if (disabled) return;
        // Removed sound effect for now
        // Animate press
        await controls.start({
            y: 2,
            boxShadow: `
                inset 2px 2px 6px #ffffff20,
                inset -2px -2px 6px #00000044,
                0 2px 0 #5a1f00,
                0 4px 8px #00000088
            `,
            transition: { duration: 0.08 },
        });
        // Release
        await controls.start({
            y: 0,
            boxShadow: `
                inset 4px 4px 8px #ffffff30,
                inset -4px -4px 8px #00000033,
                0 6px 0 #8b3d1f,
                0 12px 20px #00000088
            `,
            transition: { duration: 0.1 },
        });
        // Trigger parent click handler
        if (onClick) onClick();
    };

    return (
        <div
            style={{
                width: 320,
                height: 80,
                background: "#180161",
                borderRadius: 20,
                padding: 8,
                boxShadow: "inset 0 0 12px #000000cc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
            }}
        >
            <motion.div
                animate={controls}
                onClick={handleClick}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to bottom, #FB773C 0%, #c6541c 100%)",
                    borderRadius: 16,
                    position: "relative",
                    boxShadow: `
                        inset 4px 4px 8px #ffffff30,
                        inset -4px -4px 8px #00000033,
                        0 6px 0 #8b3d1f,
                        0 12px 20px #00000088
                    `,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 14,
                    letterSpacing: 1,
                    color: "#fff",
                    textShadow: "0 1px 0 #000000aa",
                    userSelect: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    overflow: "hidden",
                }}
                whileHover={disabled ? {} : { scale: 1.02 }}
            >
                {label}
                {/* Top gloss */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "50%",
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0))",
                        pointerEvents: "none",
                    }}
                />
                {/* Light streak */}
                <div
                    style={{
                        position: "absolute",
                        top: "15%",
                        left: "-40%",
                        width: "180%",
                        height: "30%",
                        background: "linear-gradient(120deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
                        transform: "rotate(-8deg)",
                        pointerEvents: "none",
                    }}
                />
            </motion.div>
        </div>
    );
} 