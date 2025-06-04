'use client';

import React, { useState, useEffect } from "react";
import WardSelection from "./WardSelection";
import Chat from "./Chat";
import ProgressModal from "./ProgressModal";
import useHasMounted from "./useHasMounted";

export default function MainFlow({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
    const [showProgress, setShowProgress] = useState(false);
    const [isDesktop, setIsDesktop] = useState<undefined | boolean>(undefined);
    const hasMounted = useHasMounted();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkWidth = () => setIsDesktop(window.innerWidth >= 1200);
            checkWidth();
            window.addEventListener('resize', checkWidth);
            return () => window.removeEventListener('resize', checkWidth);
        }
    }, []);

    if (!hasMounted || typeof isDesktop === 'undefined') {
        return null;
    }

    if (showProgress) {
        return <ProgressModal accessToken={accessToken} refreshToken={refreshToken} onClose={() => setShowProgress(false)} />;
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh' }}>
            {!selectedCondition ? (
                <WardSelection
                    accessToken={accessToken}
                    refreshToken={refreshToken}
                    onSelectCondition={(condition) => setSelectedCondition(condition)}
                />
            ) : (
                <Chat
                    condition={selectedCondition}
                    accessToken={accessToken}
                    refreshToken={refreshToken}
                    leftAlignTitle={isDesktop}
                />
            )}
        </div>
    );
} 