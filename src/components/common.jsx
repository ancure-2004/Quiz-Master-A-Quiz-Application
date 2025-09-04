import React, {forwardRef, useEffect, useRef } from 'react';
import { loadingAnimations, timerAnimations } from '../utils/animations';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = 'Loading...', 
  showText = true 
}) => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    if (spinnerRef.current) {
      loadingAnimations.spinner(spinnerRef.current);
    }
  }, []);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        ref={spinnerRef}
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          rounded-full border-2 border-t-transparent
        `}
      />
      {showText && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ 
  progress, 
  showLabel = true, 
  label = null, 
  className = '' 
}) => {
  const progressRef = useRef(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label || 'Progress'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          ref={progressRef}
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Timer Component
 */
export const Timer = ({ 
  timeRemaining, 
  totalTime = 30, 
  onTimeUp, 
  className = '' 
}) => {
  const timerRef = useRef(null);
  const prevTimeRef = useRef(timeRemaining);

  useEffect(() => {
    if (timeRemaining === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  useEffect(() => {
    if (timerRef.current && timeRemaining !== prevTimeRef.current) {
      if (timeRemaining <= 10 && timeRemaining > 0) {
        timerRef.current.classList.add('text-red-500', 'font-bold');
        timerAnimations.warning(timerRef.current);
      } else if (timeRemaining > 10) {
        timerRef.current.classList.remove('text-red-500', 'font-bold');
        timerAnimations.reset(timerRef.current);
      }
      
      if (timeRemaining !== prevTimeRef.current) {
        timerAnimations.tick(timerRef.current);
      }
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <svg className="h-12 w-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-gray-200"
            fill="none"
            strokeWidth="3"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`stroke-current ${timeRemaining <= 10 ? 'text-red-500' : 'text-primary-500'}`}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            ref={timerRef}
            className="text-sm font-medium text-gray-700"
          >
            {timeRemaining}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <div>Time Left</div>
        <div className="font-medium">{formatTime(timeRemaining)}</div>
      </div>
    </div>
  );
};

/**
 * Button Component
 */
export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  ...props 
}) => {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    if (buttonRef.current) {
      buttonRef.current.blur(); // Remove focus after click
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out transform focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    error: 'btn-error',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent',
    ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 bg-transparent'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <button
      ref={buttonRef}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" showText={false} color="white" />
      )}
      {!loading && children}
    </button>
  );
};

/**
 * Card Component
 */
export const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  ...props 
}, ref) => {
  const baseClasses = hover ? 'card-hover' : 'card';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Badge Component
 */
export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full 
      ${variantClasses[variant]} 
      ${sizeClasses[size]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

/**
 * Alert Component
 */
export const Alert = ({ 
  children, 
  variant = 'info', 
  onClose, 
  className = '' 
}) => {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  const iconClasses = {
    info: '🔵',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`
      flex items-start p-4 rounded-lg border 
      ${variantClasses[variant]} 
      ${className}
    `}>
      <span className="mr-3 text-lg">{iconClasses[variant]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-lg hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};

/**
 * Modal Component
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className={`
        relative bg-white rounded-lg shadow-xl max-h-full overflow-auto
        ${sizeClasses[size]} 
        ${className}
      `}>
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader Component
 */
export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '' 
}) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height }}
    />
  );
};

