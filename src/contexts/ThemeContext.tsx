import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { ThemeContextType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Create context for theme management
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme context
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Hook for detecting system theme preference
function useSystemTheme() {
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return systemTheme;
}

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSystemTheme();
  const [userPreference, setUserPreference] = useLocalStorage<'light' | 'dark' | 'system'>('theme-preference', 'system');
  
  const isDarkMode = userPreference === 'system' ? systemTheme === 'dark' : userPreference === 'dark';

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    if (userPreference === 'system') {
      // If currently using system preference, switch to opposite of current system theme
      setUserPreference(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // If using explicit preference, toggle it
      setUserPreference(userPreference === 'dark' ? 'light' : 'dark');
    }
  };

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}