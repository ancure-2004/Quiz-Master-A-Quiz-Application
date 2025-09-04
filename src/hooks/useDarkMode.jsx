import { useState, useEffect, createContext, useContext } from 'react';

/**
 * Dark Mode Context
 */
const DarkModeContext = createContext();

/**
 * Dark Mode Provider Component
 */
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for saved preference
    const savedMode = localStorage.getItem('quizmaster_darkMode');
    if (savedMode !== null) {
      const isDark = JSON.parse(savedMode);
      setIsDarkMode(isDark);
      updateDarkMode(isDark);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      updateDarkMode(prefersDark);
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedMode = localStorage.getItem('quizmaster_darkMode');
      // Only update if user hasn't manually set a preference
      if (savedMode === null) {
        setIsDarkMode(e.matches);
        updateDarkMode(e.matches);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const updateDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    updateDarkMode(newMode);
    localStorage.setItem('quizmaster_darkMode', JSON.stringify(newMode));
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode: (isDark) => {
      setIsDarkMode(isDark);
      updateDarkMode(isDark);
      localStorage.setItem('quizmaster_darkMode', JSON.stringify(isDark));
    }
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

/**
 * Hook to use Dark Mode
 */
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};
