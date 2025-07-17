'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const SplashContext = createContext<{ showSplash: boolean }>({ showSplash: false });

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 5000); // splash duration

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return <SplashContext.Provider value={{ showSplash }}>{children}</SplashContext.Provider>;
}

export const useSplash = () => useContext(SplashContext);
