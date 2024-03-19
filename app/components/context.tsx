// context.js
import React, { createContext, useContext, useRef } from 'react';

type GlobalStateContextType = {
    positionRef: React.MutableRefObject<{ x: number; y: number }>;
    velocityRef: React.MutableRefObject<{ x: number; y: number }>;
    nekoRef: React.MutableRefObject<null>;
    nekoHatRef: React.MutableRefObject<null>;
    login: React.MutableRefObject<boolean>;
};

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const NekoStateProvider = ({ children }: { children: React.ReactNode }) => {
    const positionRef = useRef({
        x: randInt(0, typeof window === 'undefined' ? 0 : (window.innerWidth - 100)),
        y: 0,
    });
    const velocityRef = useRef({ x: 0, y: 0 });
    const nekoRef = useRef(null);
    const nekoHatRef = useRef(null);
    const login = useRef(false);

    const state: GlobalStateContextType = {
        positionRef,
        velocityRef,
        nekoRef,
        nekoHatRef,
        login,
    };

    return (
        <GlobalStateContext.Provider value={state as any}>{children}</GlobalStateContext.Provider>
    );
};

export const useNekoState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error('useNekoState must be used within a NekoStateProvider');
    }
    return context;
};
