'use client';
import React, { 
  createContext, 
  ReactNode, 
  useContext, 
  useState, useEffect
} from 'react'

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const [theme, setTheme] = useState<'light' | 'dark'>(getSystemTheme)

  useEffect(() => {
    // const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || getSystemTheme();
    // setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const updateTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme  }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};