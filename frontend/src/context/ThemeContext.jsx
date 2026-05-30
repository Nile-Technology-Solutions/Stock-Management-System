import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize theme immediately from localStorage, default to 'light'
    const storedTheme = localStorage.getItem('ah_theme');
    if (storedTheme) {
      return storedTheme;
    }
    // Default to light mode
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document immediately
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Store theme preference
    localStorage.setItem('ah_theme', theme);
    
    // Remove no-transition class after a brief delay to enable smooth transitions
    setTimeout(() => {
      root.classList.remove('no-transition');
    }, 100);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
