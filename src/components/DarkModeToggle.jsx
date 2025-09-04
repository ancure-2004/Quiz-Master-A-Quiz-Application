import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

/**
 * Dark Mode Toggle Component
 */
export const DarkModeToggle = ({ className = '', size = 'default' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const sizes = {
    sm: 'w-12 h-6',
    default: 'w-14 h-7',
    lg: 'w-16 h-8'
  };

  const thumbSizes = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center ${sizes[size]} rounded-full 
        transition-colors duration-300 ease-in-out focus:outline-none 
        focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
        focus:ring-offset-white dark:focus:ring-offset-gray-800
        ${isDarkMode 
          ? 'bg-primary-600 hover:bg-primary-700' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Toggle thumb */}
      <span
        className={`
          inline-block ${thumbSizes[size]} transform rounded-full 
          bg-white shadow-lg transition-transform duration-300 ease-in-out
          flex items-center justify-center
          ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}
        `}
      >
        {/* Icons */}
        <span className="text-xs">
          {isDarkMode ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
};

/**
 * Simple Dark Mode Toggle Button
 */
export const DarkModeButton = ({ className = '', variant = 'outline' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const baseClasses = 'inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
  
  const variants = {
    outline: `border-2 ${isDarkMode 
      ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
    }`,
    solid: `${isDarkMode 
      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`,
    ghost: `${isDarkMode 
      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-lg">
        {isDarkMode ? '🌙' : '☀️'}
      </span>
      <span className="text-sm hidden sm:inline">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};
