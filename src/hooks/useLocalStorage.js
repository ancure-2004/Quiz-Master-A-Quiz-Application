import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 */
export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Custom hook for managing high scores
 */
export const useHighScores = () => {
  const [highScores, setHighScores, removeHighScores] = useLocalStorage('quizmaster_scores', []);

  const addScore = (scoreData) => {
    const newScore = {
      ...scoreData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setHighScores(prevScores => {
      const updatedScores = [...prevScores, newScore]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10); // Keep only top 10
      return updatedScores;
    });
  };

  const clearScores = () => {
    removeHighScores();
  };

  const getBestScore = () => {
    return highScores.length > 0 ? highScores[0] : null;
  };

  const getAverageScore = () => {
    if (highScores.length === 0) return 0;
    const total = highScores.reduce((sum, score) => sum + score.percentage, 0);
    return Math.round(total / highScores.length);
  };

  return {
    highScores,
    addScore,
    clearScores,
    getBestScore,
    getAverageScore
  };
};

/**
 * Custom hook for managing user preferences
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('quizmaster_preferences', {
    theme: 'light',
    soundEnabled: true,
    animationsEnabled: true,
    difficulty: 'medium',
    questionCount: 10,
    timerEnabled: true,
    timerDuration: 30
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      theme: 'light',
      soundEnabled: true,
      animationsEnabled: true,
      difficulty: 'medium',
      questionCount: 10,
      timerEnabled: true,
      timerDuration: 30
    });
  };

  return {
    preferences,
    updatePreference,
    resetPreferences
  };
};

/**
 * Custom hook for managing quiz statistics
 */
export const useQuizStats = () => {
  const [stats, setStats] = useLocalStorage('quizmaster_stats', {
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    averageScore: 0,
    bestStreak: 0,
    currentStreak: 0,
    favoriteCategory: null,
    timeSpent: 0, // in milliseconds
    lastPlayed: null
  });

  const updateStats = (quizResult) => {
    setStats(prevStats => {
      const newTotalQuizzes = prevStats.totalQuizzes + 1;
      const newTotalQuestions = prevStats.totalQuestions + quizResult.total;
      const newTotalCorrect = prevStats.totalCorrect + quizResult.score;
      const newAverageScore = Math.round((newTotalCorrect / newTotalQuestions) * 100);
      
      // Update streak
      const newCurrentStreak = quizResult.percentage >= 70 ? prevStats.currentStreak + 1 : 0;
      const newBestStreak = Math.max(prevStats.bestStreak, newCurrentStreak);

      // Update time spent
      const newTimeSpent = prevStats.timeSpent + (quizResult.timeTaken || 0);

      return {
        ...prevStats,
        totalQuizzes: newTotalQuizzes,
        totalQuestions: newTotalQuestions,
        totalCorrect: newTotalCorrect,
        averageScore: newAverageScore,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        timeSpent: newTimeSpent,
        lastPlayed: new Date().toISOString()
      };
    });
  };

  const resetStats = () => {
    setStats({
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averageScore: 0,
      bestStreak: 0,
      currentStreak: 0,
      favoriteCategory: null,
      timeSpent: 0,
      lastPlayed: null
    });
  };

  const formatTimeSpent = () => {
    const hours = Math.floor(stats.timeSpent / (1000 * 60 * 60));
    const minutes = Math.floor((stats.timeSpent % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return {
    stats,
    updateStats,
    resetStats,
    formatTimeSpent
  };
};

export default {
  useLocalStorage,
  useHighScores,
  useUserPreferences,
  useQuizStats
};
