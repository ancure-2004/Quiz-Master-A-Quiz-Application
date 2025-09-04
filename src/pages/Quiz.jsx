import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import Question from '../components/Question';
import { Button, LoadingSpinner, Alert, Modal } from '../components/common';
import { useQuiz } from '../hooks/useQuiz';
import { useHighScores, useQuizStats } from '../hooks/useLocalStorage';
import { pageTransition, particleEffects } from '../utils/animations';

/**
 * Quiz Page Component
 * Main quiz interface with questions and navigation
 */
const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  
  // Quiz options from navigation state
  const quizOptions = location.state || {
    difficulty: 'mixed',
    questionCount: 10,
    timeLimit: 30,
    useAPI: true  // FIXED: Default to API questions
  };

  // Quiz hook
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    isLoading,
    error,
    quizCompleted,
    timeRemaining,
    timerActive,
    progress,
    hasSelectedAnswer,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    quizResults,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    finishQuiz,
    restartQuiz
  } = useQuiz({
    amount: quizOptions.questionCount,
    difficulty: quizOptions.difficulty === 'mixed' ? null : quizOptions.difficulty,
    timeLimit: quizOptions.timeLimit,
    useAPI: quizOptions.useAPI
  });

  // Local storage hooks
  const { addScore } = useHighScores();
  const { updateStats } = useQuizStats();

  // Local state
  const [showExitModal, setShowExitModal] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Page entrance animation
  useEffect(() => {
    if (containerRef.current) {
      pageTransition.enter(containerRef.current);
    }
  }, []);

  // Handle quiz completion
  useEffect(() => {
    if (quizCompleted && quizResults) {
      // Save score and update stats
      const scoreData = {
        score: quizResults.score,
        total: quizResults.total,
        percentage: quizResults.percentage,
        difficulty: quizOptions.difficulty,
        timeTaken: quizResults.timeTaken,
        category: 'Mixed'
      };

      addScore(scoreData);
      updateStats(quizResults);

      // Show celebration animation
      if (quizResults.percentage >= 80) {
        setTimeout(() => {
          particleEffects.confetti(document.body);
        }, 1000);
      }

      // Navigate to results after a delay
      setTimeout(() => {
        navigate('/results', { 
          state: { 
            results: quizResults,
            options: quizOptions
          } 
        });
      }, 2000);
    }
  }, [quizCompleted, quizResults, navigate, addScore, updateStats, quizOptions]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    startQuiz();
  };

  const handleAnswerSelect = (answerIndex) => {
    selectAnswer(answerIndex);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleSkip = () => {
    skipQuestion();
  };

  const handleExitQuiz = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    navigate('/');
  };

  const handleTimeUp = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      nextQuestion();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preparing Your Quiz
              </h3>
              <p className="text-gray-600">
                Loading {quizOptions.questionCount} questions...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    const isRateLimitError = error.includes('Rate limit') || error.includes('429');
    const isNetworkError = error.includes('Network') || error.includes('connection');
    
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Alert variant="error" className="mb-6">
            <div>
              <h3 className="font-semibold mb-2">
                {isRateLimitError ? '⏱️ Rate Limit Exceeded' : 
                 isNetworkError ? '🌐 Connection Issue' : 
                 'Error Loading Quiz'}
              </h3>
              <p className="mb-3">{error}</p>
              
              {isRateLimitError && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="font-medium text-yellow-800 mb-2">What you can do:</p>
                  <ul className="text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Wait 10-15 seconds and try again</li>
                    <li>Switch to offline mode using the toggle on home page</li>
                    <li>Try a smaller number of questions</li>
                  </ul>
                </div>
              )}
              
              {isNetworkError && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <p className="font-medium text-blue-800 mb-2">Suggestions:</p>
                  <ul className="text-blue-700 space-y-1 list-disc list-inside">
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page</li>
                    <li>Switch to offline mode for local questions</li>
                  </ul>
                </div>
              )}
            </div>
          </Alert>
          
          <div className="text-center space-y-4">
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                {isRateLimitError ? 'Try Again' : 'Refresh Page'}
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="secondary"
              >
                Back to Home
              </Button>
            </div>
            
            {isRateLimitError && (
              <p className="text-sm text-gray-600">
                💡 Tip: Toggle to offline mode on the home page for instant quizzes without rate limits!
              </p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Quiz start screen
  if (!quizStarted && questions.length > 0) {
    return (
      <Layout>
        <div ref={containerRef} className="max-w-2xl mx-auto text-center">
          <div className="card space-y-6">
            <div className="text-6xl mb-4">🧠</div>
            
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Start?
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Questions:</span>
                <span>{questions.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Time per question:</span>
                <span>{quizOptions.timeLimit} seconds</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Difficulty:</span>
                <span className="capitalize">{quizOptions.difficulty}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Read each question carefully</li>
                <li>Select your answer before the timer runs out</li>
                <li>You can navigate back to previous questions</li>
                <li>Your final score will be shown at the end</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="flex-1"
              >
                Start Quiz 🚀
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Quiz completed screen
  if (quizCompleted && quizResults) {
    return (
      <Layout>
        <div ref={containerRef} className="max-w-2xl mx-auto text-center">
          <div className="card space-y-6">
            <div className="text-6xl mb-4">
              {quizResults.percentage >= 90 ? '🏆' : 
               quizResults.percentage >= 70 ? '🌟' : 
               quizResults.percentage >= 50 ? '👍' : '📚'}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900">
              Quiz Completed!
            </h2>
            
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary-600">
                {quizResults.percentage}%
              </div>
              <div className="text-lg text-gray-600">
                {quizResults.score} out of {quizResults.total} correct
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                {quizResults.percentage >= 90 ? 'Outstanding! You\'re a true QuizMaster! 🏆' :
                 quizResults.percentage >= 80 ? 'Excellent work! You really know your stuff! 🌟' :
                 quizResults.percentage >= 70 ? 'Good job! Keep up the great work! 👍' :
                 quizResults.percentage >= 60 ? 'Not bad! There\'s room for improvement! 📈' :
                 'Keep learning! Practice makes perfect! 💪'}
              </p>
            </div>

            <p className="text-gray-600">
              Redirecting to detailed results...
            </p>

            <div className="animate-pulse">
              <LoadingSpinner showText={false} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Main quiz interface
  return (
    <Layout
      showTimer={timerActive}
      timeRemaining={timeRemaining}
      totalTime={quizOptions.timeLimit}
      onTimeUp={handleTimeUp}
      showProgress={true}
      progress={progress}
      progressLabel={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
    >
      <div ref={containerRef} className="w-full max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QuizMaster Challenge</h1>
            <p className="text-gray-600">
              {quizOptions?.difficulty?.charAt(0)?.toUpperCase() + quizOptions?.difficulty?.slice(1)} Difficulty
            </p>
          </div>
          
          <Button
            onClick={handleExitQuiz}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-red-600"
          >
            Exit Quiz
          </Button>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <Question
            question={currentQuestion}
            selectedAnswer={selectedAnswers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLastQuestion={isLastQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        )}

        {/* Exit Confirmation Modal */}
        <Modal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          title="Exit Quiz?"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to exit the quiz? Your progress will be lost.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowExitModal(false)}
              >
                Continue Quiz
              </Button>
              
              <Button
                variant="error"
                onClick={confirmExit}
              >
                Exit Quiz
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Quiz;
