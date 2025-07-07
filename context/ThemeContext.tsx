// context/ThemeContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  placeholder: '#888888',
  inputBorder: '#DADADA',
  primary: '#FF6B00',
  error: '#D32F2F',
};

const darkColors = {
  background: '#121212',
  text: '#FFFFFF',
  placeholder: '#AAAAAA',
  inputBorder: '#444444',
  primary: '#FF6B00',
  error: '#F44336',
};

const ThemeContext = createContext({
  mode: 'light',
  colors: lightColors,
  toggleMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
