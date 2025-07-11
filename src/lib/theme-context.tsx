"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type FormType = 'viral-load' | 'eid';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
}

export interface ThemeContextType {
  viralLoadColors: ThemeColors;
  eidColors: ThemeColors;
  updateColors: (type: FormType, colors: ThemeColors) => void;
  getColorsForType: (type: FormType) => ThemeColors;
}

const defaultViralLoadColors: ThemeColors = {
  primary: '#dc2626', // red-600
  primaryHover: '#b91c1c', // red-700
  primaryLight: '#fef2f2', // red-50
  primaryDark: '#991b1b', // red-800
};

const defaultEidColors: ThemeColors = {
  primary: '#2563eb', // blue-600
  primaryHover: '#1d4ed8', // blue-700
  primaryLight: '#eff6ff', // blue-50
  primaryDark: '#1e40af', // blue-800
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [viralLoadColors, setViralLoadColors] = useState<ThemeColors>(defaultViralLoadColors);
  const [eidColors, setEidColors] = useState<ThemeColors>(defaultEidColors);

  // Load saved colors from localStorage on mount
  useEffect(() => {
    const savedViralLoad = localStorage.getItem('viral-load-colors');
    const savedEid = localStorage.getItem('eid-colors');

    if (savedViralLoad) {
      setViralLoadColors(JSON.parse(savedViralLoad));
    }
    if (savedEid) {
      setEidColors(JSON.parse(savedEid));
    }
  }, []);

  const updateColors = (type: FormType, colors: ThemeColors) => {
    if (type === 'viral-load') {
      setViralLoadColors(colors);
      localStorage.setItem('viral-load-colors', JSON.stringify(colors));
    } else {
      setEidColors(colors);
      localStorage.setItem('eid-colors', JSON.stringify(colors));
    }
  };

  const getColorsForType = (type: FormType): ThemeColors => {
    return type === 'viral-load' ? viralLoadColors : eidColors;
  };

  return (
    <ThemeContext.Provider value={{
      viralLoadColors,
      eidColors,
      updateColors,
      getColorsForType,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 