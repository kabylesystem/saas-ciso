import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeMode } from '../types';

interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  success: string;
  warning: string;
  danger: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

// BLACKBOX style - pure black
const darkColors: ThemeColors = {
  background: '#000000',
  cardBackground: '#0a0a0a',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  accent: '#ffffff',
  border: 'rgba(255, 255, 255, 0.12)',
  buttonPrimary: '#ffffff',
  buttonPrimaryText: '#000000',
  buttonSecondary: 'rgba(255, 255, 255, 0.08)',
  buttonSecondaryText: '#ffffff',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const lightColors: ThemeColors = {
  background: '#ffffff',
  cardBackground: '#f8f8f8',
  text: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  accent: '#000000',
  border: 'rgba(0, 0, 0, 0.12)',
  buttonPrimary: '#000000',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: 'rgba(0, 0, 0, 0.06)',
  buttonSecondaryText: '#000000',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const colors = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
