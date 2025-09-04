import React from 'react';
import { Timer, ProgressBar } from './common';
// import { DarkModeToggle } from './DarkModeToggle';

/**
 * Layout Component
 * Provides consistent layout structure for all pages
 */
export const Layout = ({ 
  children, 
  showTimer = false,
  timeRemaining = 0,
  totalTime = 30,
  onTimeUp,
  showProgress = false,
  progress = 0,
  progressLabel = '',
  title = '',
  subtitle = '',
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${className}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <QuizMasterIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">QuizMaster</h1>
                <p className="text-xs text-gray-600 dark:text-gray-300 hidden sm:block">Challenge Your Knowledge</p>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-4">
              {/* <DarkModeToggle size="sm" /> */}

              {/* Timer */}
              {showTimer && (
                <Timer
                  timeRemaining={timeRemaining}
                  totalTime={totalTime}
                  onTimeUp={onTimeUp}
                  className="hidden sm:flex"
                />
              )}
            </div>
          </div>

          {/* Mobile Timer */}
          {showTimer && (
            <div className="pb-4 sm:hidden">
              <Timer
                timeRemaining={timeRemaining}
                totalTime={totalTime}
                onTimeUp={onTimeUp}
                className="flex justify-center"
              />
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && (
            <div className="pb-4">
              <ProgressBar
                progress={progress}
                label={progressLabel}
                showLabel={!!progressLabel}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex justify-center">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © 2024 QuizMaster. Challenge yourself, expand your knowledge.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <a href="#" className="hover:text-primary-600 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * QuizMaster Icon Component
 */
export const QuizMasterIcon = ({ className = "w-6 h-6", ...props }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
      <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" />
      <path d="M5 15L6.09 18.26L10 19L6.09 19.74L5 23L3.91 19.74L0 19L3.91 18.26L5 15Z" />
    </svg>
  );
};

/**
 * Container Component
 * Provides consistent container styling
 */
export const Container = ({ 
  children, 
  size = 'default', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    default: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Section Component
 * Provides consistent section styling
 */
export const Section = ({ 
  children, 
  className = '',
  background = 'transparent',
  padding = 'default'
}) => {
  const backgroundClasses = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50'
  };

  const paddingClasses = {
    none: '',
    sm: 'py-8',
    default: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  };

  return (
    <section className={`
      ${backgroundClasses[background]} 
      ${paddingClasses[padding]} 
      ${className}
    `}>
      {children}
    </section>
  );
};

/**
 * Page Wrapper Component
 * Combines Layout with common page patterns
 */
export const PageWrapper = ({ 
  children,
  title,
  subtitle,
  showTimer = false,
  showProgress = false,
  timerProps = {},
  progressProps = {},
  className = ''
}) => {
  return (
    <Layout
      title={title}
      subtitle={subtitle}
      showTimer={showTimer}
      showProgress={showProgress}
      className={className}
      {...timerProps}
      {...progressProps}
    >
      {children}
    </Layout>
  );
};

