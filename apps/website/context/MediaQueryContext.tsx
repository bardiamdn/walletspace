import React, { createContext, useEffect, useState, useContext } from 'react';

interface MediaQueryContextType {
  isMobile: boolean;
}

type MediaQueryProviderProps = {
  children: React.ReactNode;
};

const MediaQueryContext = createContext<MediaQueryContextType | null>(null);

export const MediaQueryProvider = ({ children }: MediaQueryProviderProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const updateIsMobile = () => setIsMobile(mobileQuery.matches);
    mobileQuery.addEventListener('change', updateIsMobile);

    updateIsMobile();

    return () => mobileQuery.removeEventListener('change', updateIsMobile);
  }, []);

  return (
    <MediaQueryContext.Provider value={{ isMobile }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export const useMediaQuery = () => {
  const context = useContext(MediaQueryContext);

  if (!context) {
    throw new Error('useMediaQuery must be used within a MediaQueryProvider');
  }

  return context;
};
