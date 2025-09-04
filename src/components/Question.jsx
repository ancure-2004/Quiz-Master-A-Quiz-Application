import React, { useEffect, useRef } from 'react';
import { Badge, Button } from './common';
import { questionAnimations, optionAnimations } from '../utils/animations';

/**
 * Question Component
 * Displays a single question with multiple choice options
 */
const Question = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSkip,
  showResult = false,
  canGoNext = false,
  canGoPrevious = false,
  isLastQuestion = false,
  questionNumber = 1,
  totalQuestions = 10,
  className = ''
}) => {
  const questionRef = useRef(null);
  const optionsRef = useRef([]);

  // Animation on mount
  useEffect(() => {
    if (questionRef.current) {
      questionAnimations.slideIn(questionRef.current);
    }
  }, [question.id]);

  // Animate options after question animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (optionsRef.current.length > 0) {
        optionAnimations.staggerIn(optionsRef.current);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [question.id]);

  const handleAnswerSelect = (optionIndex) => {
    if (showResult) return; // Prevent selection after showing result

    // Animate selection
    if (optionsRef.current[optionIndex]) {
      optionAnimations.select(optionsRef.current[optionIndex]);
    }

    onAnswerSelect(optionIndex);
  };

  const handleNext = () => {
    if (questionRef.current) {
      questionAnimations.slideOut(questionRef.current).then(() => {
        onNext();
      });
    } else {
      onNext();
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'error'
    };
    return colors[difficulty] || 'default';
  };

  const getOptionStatus = (optionIndex) => {
    if (!showResult) {
      return selectedAnswer === optionIndex ? 'selected' : '';
    }

    // Show results
    if (optionIndex === question.correctAnswer) {
      return 'correct';
    } else if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return 'incorrect';
    }
    return '';
  };

  const getOptionClasses = (optionIndex) => {
    const status = getOptionStatus(optionIndex);
    const baseClasses = 'quiz-option';
    
    if (status === 'selected') return `${baseClasses} selected`;
    if (status === 'correct') return `${baseClasses} correct`;
    if (status === 'incorrect') return `${baseClasses} incorrect`;
    
    return baseClasses;
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div ref={questionRef} className="space-y-6">
        {/* Question Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">
                Question {questionNumber} of {totalQuestions}
              </span>
              <div className="h-1 w-12 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {question.category && (
              <Badge variant="primary" size="sm">
                {question.category}
              </Badge>
            )}
            {question.difficulty && (
              <Badge variant={getDifficultyColor(question.difficulty)} size="sm">
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="card">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              ref={el => optionsRef.current[index] = el}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={getOptionClasses(index)}
              aria-label={`Option ${index + 1}: ${option}`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-left flex-1">{option}</span>
                
                {/* Show result icons */}
                {showResult && (
                  <div className="flex-shrink-0">
                    {index === question.correctAnswer && (
                      <span className="text-green-600 text-xl">✓</span>
                    )}
                    {selectedAnswer === index && index !== question.correctAnswer && (
                      <span className="text-red-600 text-xl">✗</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation (shown only when showing results) */}
        {showResult && question.explanation && (
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-xl flex-shrink-0">💡</span>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex gap-3">
            {canGoPrevious && (
              <Button
                variant="secondary"
                onClick={onPrevious}
                className="flex-1 sm:flex-none"
              >
                ← Previous
              </Button>
            )}
            
            {onSkip && !showResult && (
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1 sm:flex-none"
              >
                Skip Question
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex-1 sm:flex-none min-w-[120px]"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'} →
            </Button>
          </div>
        </div>

        {/* Selection Prompt */}
        {!showResult && selectedAnswer === undefined && (
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Please select an answer to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
