// MiniPlayerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MiniPlayerContextType {
    showMiniPlayer: boolean;
    setShowMiniPlayer: React.Dispatch<React.SetStateAction<boolean>>;
    currentPodcast: any; // Replace `any` with your podcast type
    setCurrentPodcast: React.Dispatch<React.SetStateAction<any>>; // Replace `any` with your podcast type
}

const MiniPlayerContext = createContext<MiniPlayerContextType | undefined>(undefined);

export const MiniPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showMiniPlayer, setShowMiniPlayer] = useState(false);
    const [currentPodcast, setCurrentPodcast] = useState<any>(null); // Replace `any` with your podcast type

    return (
        <MiniPlayerContext.Provider value={{ showMiniPlayer, setShowMiniPlayer, currentPodcast, setCurrentPodcast }}>
            {children}
        </MiniPlayerContext.Provider>
    );
};

export const useMiniPlayer = () => {
    const context = useContext(MiniPlayerContext);
    if (!context) {
        throw new Error('useMiniPlayer must be used within a MiniPlayerProvider');
    }
    return context;
};
