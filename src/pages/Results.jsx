import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button, Card, Badge, Alert, Modal } from '../components/common';
import { useHighScores } from '../hooks/useLocalStorage';
import { pageTransition, scoreAnimations, textAnimations } from '../utils/animations';

/**
 * Results Page Component
 * Shows detailed quiz results and allows restart
 */
const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const scoreRef = useRef(null);
  
  const { highScores, clearScores } = useHighScores();
  
  // Get results from navigation state
  const results = location.state?.results;
  const options = location.state?.options;
  
  const [showAnswers, setShowAnswers] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Redirect to home if no results
  useEffect(() => {
    if (!results) {
      navigate('/');
      return;
    }

    // Page entrance animation
    if (containerRef.current) {
      pageTransition.enter(containerRef.current);
    }

    // Animate score
    setTimeout(() => {
      if (scoreRef.current) {
        scoreAnimations.celebrate(scoreRef.current);
        setTimeout(() => {
          scoreAnimations.countUp(scoreRef.current.querySelector('.score-number'), results.percentage);
        }, 600);
      }
    }, 500);
  }, [results, navigate]);

  if (!results) {
    return null; // Will redirect
  }

  const handleRestartQuiz = () => {
    navigate('/quiz', { state: options });
  };

  const handleNewQuiz = () => {
    navigate('/');
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) {
      return {
        title: 'Outstanding! 🏆',
        message: 'You\'re a true QuizMaster!',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      };
    } else if (percentage >= 80) {
      return {
        title: 'Excellent! 🌟',
        message: 'Great job! You really know your stuff.',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    } else if (percentage >= 70) {
      return {
        title: 'Good Work! 👍',
        message: 'Nice performance! Keep it up.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    } else if (percentage >= 60) {
      return {
        title: 'Not Bad! 📚',
        message: 'Room for improvement, but you\'re getting there.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      };
    } else {
      return {
        title: 'Keep Learning! 💪',
        message: 'Don\'t give up! Practice makes perfect.',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const performance = getPerformanceMessage(results.percentage);
  const isNewHighScore = highScores.length === 0 || results.percentage > highScores[0].percentage;

  return (
    <Layout>
      <div ref={containerRef} className="max-w-4xl mx-auto space-y-8">
        {/* Main Results Card */}
        <Card className="text-center space-y-6">
          {/* Performance Icon */}
          <div className="text-8xl">
            {results.percentage >= 90 ? '🏆' : 
             results.percentage >= 80 ? '🌟' : 
             results.percentage >= 70 ? '👍' : 
             results.percentage >= 60 ? '📚' : '💪'}
          </div>

          {/* Score Display */}
          <div ref={scoreRef} className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Quiz Completed!
            </h1>
            
            <div className="space-y-2">
              <div className={`text-7xl font-bold ${performance.color}`}>
                <span className="score-number">0</span>%
              </div>
              <div className="text-xl text-gray-600">
                {results.score} out of {results.total} questions correct
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <Alert variant={results.percentage >= 70 ? 'success' : 'warning'} className={performance.bgColor}>
            <div className="text-center">
              <h3 className={`font-bold text-lg ${performance.color}`}>
                {performance.title}
              </h3>
              <p className={performance.color}>{performance.message}</p>
            </div>
          </Alert>

          {/* New High Score Banner */}
          {isNewHighScore && (
            <Alert variant="success" className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-center">
                <h3 className="font-bold text-yellow-800 text-lg">
                  🎉 New High Score! 🎉
                </h3>
                <p className="text-yellow-700">
                  Congratulations! You've achieved your best score yet!
                </p>
              </div>
            </Alert>
          )}
        </Card>

        {/* Quiz Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-gray-900">
              {results.timeTaken ? formatTime(results.timeTaken) : 'N/A'}
            </div>
            <div className="text-gray-600">Time Taken</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-green-600">
              {results.score}
            </div>
            <div className="text-gray-600">Correct Answers</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-2xl font-bold text-red-600">
              {results.total - results.score}
            </div>
            <div className="text-gray-600">Incorrect Answers</div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleRestartQuiz}
            variant="primary"
            className="w-full"
          >
            🔄 Retry Quiz
          </Button>

          <Button
            onClick={handleNewQuiz}
            variant="secondary"
            className="w-full"
          >
            🏠 New Quiz
          </Button>

          <Button
            onClick={() => setShowAnswers(!showAnswers)}
            variant="outline"
            className="w-full"
          >
            {showAnswers ? '👁️ Hide' : '📝 Review'} Answers
          </Button>

          <Button
            onClick={() => setShowHighScores(!showHighScores)}
            variant="outline"
            className="w-full"
          >
            🏆 High Scores
          </Button>
        </div>

        {/* Detailed Answers Review */}
        {showAnswers && (
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Answer Review</h3>
              <Badge variant="primary">
                {results.results.filter(r => r.isCorrect).length}/{results.results.length} Correct
              </Badge>
            </div>

            <div className="space-y-4">
              {results.results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Question {index + 1}: {result.question.question}
                      </h4>
                      
                      <div className="space-y-2">
                        {/* User's Answer */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600">Your answer:</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            result.isCorrect 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.userAnswer !== undefined 
                              ? result.question.options[result.userAnswer] || 'No answer'
                              : 'No answer'
                            }
                          </span>
                          {result.isCorrect ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!result.isCorrect && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-600">Correct answer:</span>
                            <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                              {result.question.options[result.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Explanation */}
                      {result.question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">💡</span>
                            <div>
                              <h5 className="font-medium text-blue-900 text-sm">Explanation</h5>
                              <p className="text-blue-800 text-sm">{result.question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Badge 
                        variant={result.isCorrect ? 'success' : 'error'}
                        size="sm"
                      >
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                      {result.question.difficulty && (
                        <Badge 
                          variant={
                            result.question.difficulty === 'easy' ? 'success' :
                            result.question.difficulty === 'hard' ? 'error' : 'warning'
                          }
                          size="sm"
                          className="ml-2"
                        >
                          {result.question.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* High Scores */}
        {showHighScores && (
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">High Scores</h3>
              {highScores.length > 0 && (
                <Button
                  onClick={() => setShowClearModal(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear Scores
                </Button>
              )}
            </div>

            {highScores.length > 0 ? (
              <div className="space-y-3">
                {highScores.slice(0, 10).map((score, index) => (
                  <div 
                    key={score.id} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200' :
                      index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {score.percentage}% ({score.score}/{score.total})
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(score.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="primary" size="sm">
                        {score.difficulty || 'Mixed'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🏆</div>
                <p>No high scores yet. Keep playing to build your record!</p>
              </div>
            )}
          </Card>
        )}

        {/* Clear Scores Confirmation Modal */}
        <Modal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          title="Clear High Scores?"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to clear all high scores? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </Button>
              
              <Button
                variant="error"
                onClick={() => {
                  clearScores();
                  setShowClearModal(false);
                  setShowHighScores(false);
                }}
              >
                Clear Scores
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Results;
