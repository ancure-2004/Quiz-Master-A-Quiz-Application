import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Alert, Modal } from '../components/common';
import { QuizMasterIcon } from '../components/Layout';
import { useHighScores, useQuizStats } from '../hooks/useLocalStorage';
import { pageTransition, textAnimations, cardAnimations } from '../utils/animations';

/**
 * Home Page Component
 * Landing page with quiz options and statistics
 */
const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  
  const { highScores, getBestScore } = useHighScores();
  const { stats, formatTimeSpent } = useQuizStats();

  // State for settings modal
  const [showSettings, setShowSettings] = useState(false);
  const [useAPI, setUseAPI] = useState(true); // DEFAULT TO TRUE for API questions
  const [customSettings, setCustomSettings] = useState({
    difficulty: 'mixed',
    questionCount: 10,
    timeLimit: 30,
    category: null
  });

  useEffect(() => {
    // Page entrance animation
    if (containerRef.current) {
      pageTransition.enter(containerRef.current);
    }

    // Stagger cards animation
    setTimeout(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          setTimeout(() => {
            cardAnimations.bounce(card);
          }, index * 100);
        }
      });
    }, 500);

    // Load saved preferences
    const savedUseAPI = localStorage.getItem('quizmaster_useAPI');
    if (savedUseAPI !== null) {
      setUseAPI(JSON.parse(savedUseAPI));
    }
  }, []);

  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem('quizmaster_useAPI', JSON.stringify(useAPI));
  }, [useAPI]);

  const handleStartQuiz = (options = {}) => {
    const quizOptions = {
      ...options,
      useAPI, // Use the current API setting
    };
    navigate('/quiz', { state: quizOptions });
  };

  const handleCustomQuiz = () => {
    const options = {
      ...customSettings,
      useAPI,
    };
    navigate('/quiz', { state: options });
    setShowSettings(false);
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const bestScore = getBestScore();

  const quizOptions = [
    {
      title: 'Quick Quiz',
      description: useAPI ? 'Fresh questions from our database' : '5 local questions for quick testing',
      icon: '⚡',
      difficulty: 'mixed',
      questionCount: 5,
      timeLimit: 30,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Standard Quiz',
      description: useAPI ? 'Classic 10-question challenge from API' : 'Standard quiz with local questions',
      icon: '🎯',
      difficulty: 'mixed',
      questionCount: 10,
      timeLimit: 30,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'Expert Challenge',
      description: useAPI ? 'Hard questions from global database' : 'Hard local questions for experts',
      icon: '🏆',
      difficulty: 'hard',
      questionCount: 10,
      timeLimit: 45,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: 'Lightning Round',
      description: useAPI ? '10 API questions, 15 seconds each' : '10 local questions, fast-paced',
      icon: '⚡',
      difficulty: 'easy',
      questionCount: 10,
      timeLimit: 15,
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    }
  ];

  const features = [
    {
      icon: useAPI ? '🌐' : '💾',
      title: useAPI ? 'Fresh API Questions' : 'Local Questions',
      description: useAPI ? 'Thousands of questions from Open Trivia DB' : 'Curated set of offline questions'
    },
    {
      icon: '⏱️',
      title: 'Timed Questions',
      description: 'Challenge yourself with time limits'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'See your improvement over time'
    },
    {
      icon: '🎨',
      title: 'Beautiful Interface',
      description: 'Smooth animations and responsive design'
    }
  ];

  const difficultyOptions = [
    { value: 'mixed', label: 'Mixed' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const categoryOptions = [
    { value: null, label: 'Any Category' },
    { value: 9, label: 'General Knowledge' },
    { value: 17, label: 'Science & Nature' },
    { value: 18, label: 'Computers' },
    { value: 19, label: 'Mathematics' },
    { value: 20, label: 'Mythology' },
    { value: 21, label: 'Sports' },
    { value: 22, label: 'Geography' },
    { value: 23, label: 'History' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
        
        <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Logo and Title */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl">
                  <QuizMasterIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    QuizMaster
                  </h1>
                  <p className="text-gray-600">Challenge Your Knowledge</p>
                </div>
              </div>
            </div>

            {/* Question Source Toggle */}
            <div className="max-w-md mx-auto">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Question Source</div>
                    <div className="text-sm text-gray-600">
                      {useAPI ? 'Using Fresh API Questions' : 'Using Local Questions'}
                    </div>
                  </div>
                  <button
                    onClick={() => setUseAPI(!useAPI)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      useAPI ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        useAPI ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {useAPI 
                    ? '🌐 Live questions from Open Trivia Database' 
                    : '💾 Offline questions for reliable testing'
                  }
                </div>
              </Card>
            </div>

            {/* Subtitle */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl text-gray-700 mb-4">
                {useAPI 
                  ? 'Test your knowledge with fresh questions from our global database'
                  : 'Practice with our curated collection of offline questions'
                }
              </h2>
              <p className="text-gray-600">
                Choose your difficulty level, race against time, and track your progress as you become a true QuizMaster!
              </p>
            </div>

            {/* Quick Start Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => handleStartQuiz()}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-12 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {useAPI ? 'Start Fresh Quiz 🌐' : 'Start Quick Quiz 💾'}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="px-8 py-4 text-lg border-2"
              >
                Custom Quiz ⚙️
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* API Status Alert */}
      {useAPI && (
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="info" className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌐</span>
                <div>
                  <strong>Live API Mode:</strong> Questions are fetched from Open Trivia Database for maximum variety and freshness!
                </div>
              </div>
            </Alert>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {stats.totalQuizzes > 0 && (
        <section className="py-12 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Your Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stats.totalQuizzes}</div>
                <div className="text-gray-600">Quizzes Taken</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.averageScore}%</div>
                <div className="text-gray-600">Average Score</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.bestStreak}</div>
                <div className="text-gray-600">Best Streak</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTimeSpent()}</div>
                <div className="text-gray-600">Time Played</div>
              </Card>
            </div>
            
            {bestScore && (
              <div className="mt-6 text-center">
                <Alert variant="success" className="max-w-md mx-auto">
                  🏆 Your best score: {bestScore.percentage}% ({bestScore.score}/{bestScore.total})
                </Alert>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Quiz Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Challenge
            </h3>
            <p className="text-xl text-gray-600">
              Select the perfect quiz mode for your skill level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizOptions.map((option, index) => (
              <Card
                key={option.title}
                ref={el => cardsRef.current[index] = el}
                className="relative overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300"
                onClick={() => handleStartQuiz({
                  difficulty: option.difficulty,
                  questionCount: option.questionCount,
                  timeLimit: option.timeLimit
                })}
              >
                <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${option.color}`} />
                <div className="relative">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="primary" size="sm">
                      {option.questionCount} questions
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      {option.timeLimit}s per question
                    </Badge>
                    {option.difficulty !== 'mixed' && (
                      <Badge 
                        variant={option.difficulty === 'easy' ? 'success' : option.difficulty === 'hard' ? 'error' : 'warning'} 
                        size="sm"
                      >
                        {option.difficulty}
                      </Badge>
                    )}
                    <Badge 
                      variant={useAPI ? 'info' : 'secondary'} 
                      size="sm"
                    >
                      {useAPI ? '🌐 API' : '💾 Local'}
                    </Badge>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300"
                  >
                    Start Quiz
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose QuizMaster?
            </h3>
            <p className="text-xl text-gray-600">
              The most engaging quiz experience you'll ever have
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quiz Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Custom Quiz Settings"
        size="lg"
      >
        <div className="space-y-6">
          {/* Question Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Source
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{useAPI ? 'API Questions' : 'Local Questions'}</div>
                <div className="text-sm text-gray-600">
                  {useAPI ? 'Fresh questions from Open Trivia DB' : 'Offline curated questions'}
                </div>
              </div>
              <button
                onClick={() => setUseAPI(!useAPI)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  useAPI ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    useAPI ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <div className="flex space-x-2">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  onClick={() => setCustomSettings({ ...customSettings, questionCount: count })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    customSettings.questionCount === count
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={customSettings.difficulty}
              onChange={(e) => setCustomSettings({ ...customSettings, difficulty: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category (only show for API) */}
          {useAPI && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={customSettings.category || ''}
                onChange={(e) => setCustomSettings({ 
                  ...customSettings, 
                  category: e.target.value ? parseInt(e.target.value) : null 
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value || 'any'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time per Question (seconds)
            </label>
            <div className="flex space-x-2">
              {[15, 30, 45, 60].map(time => (
                <button
                  key={time}
                  onClick={() => setCustomSettings({ ...customSettings, timeLimit: time })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    customSettings.timeLimit === time
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomQuiz}
              className="flex-1"
            >
              Start Custom Quiz
            </Button>
          </div>
        </div>
      </Modal>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Challenge Yourself?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {useAPI 
              ? 'Join thousands of quiz enthusiasts with fresh questions from our global database!'
              : 'Practice with our carefully curated collection of offline questions!'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => handleStartQuiz()}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8"
            >
              {useAPI ? 'Start Fresh Quiz 🌐' : 'Start Practice Quiz 💾'}
            </Button>
            
            {highScores.length > 0 && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleViewResults}
                className="border-white text-white hover:bg-white hover:text-primary-600 px-8"
              >
                View High Scores
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;