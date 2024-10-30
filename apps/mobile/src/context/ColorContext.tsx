import { Colors } from '@/constants/Colors';
import { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';

type ColorContextType = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    backgroundWarning: string;

    icon: string;

    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textReverse: string;
    border: string;
    // divider: '#fff',
    primaryButton: string;
    secondaryButton: string;
    hoverButton: string;
    buttonSelected: string;
    disabledButton: string;

    pressButton: string;
    // activeButton: '#fff',
    // error: '#fff',
    // success: '#fff',
    warning: string;
    // gray: '#fff',
  };
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ColorContext.Provider value={{ colors }}>{children}</ColorContext.Provider>
  );
};

export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};
