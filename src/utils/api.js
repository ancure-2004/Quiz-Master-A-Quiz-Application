// API utility functions for Open Trivia DB
const API_BASE_URL = 'https://opentdb.com/api.php';

export const DIFFICULTY_LEVELS = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
};

export const CATEGORIES = {
  9: 'General Knowledge',
  17: 'Science & Nature',
  18: 'Computers',
  19: 'Mathematics',
  20: 'Mythology',
  21: 'Sports',
  22: 'Geography',
  23: 'History'
};

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests
let requestQueue = [];
let isProcessingQueue = false;

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Delays execution for the specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Rate-limited API request function
 * @param {string} url - API URL to fetch
 * @returns {Promise} Fetch response
 */
const rateLimitedFetch = async (url) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();
  return fetch(url);
};

/**
 * Fetches questions from Open Trivia DB API with rate limiting and error handling
 * @param {number} amount - Number of questions (1-50)
 * @param {number} category - Category ID (optional)
 * @param {string} difficulty - Difficulty level (optional)
 * @param {string} type - Question type (multiple/boolean, default: multiple)
 * @returns {Promise<Array>} Array of formatted questions
 */
export const fetchQuestionsFromAPI = async (
  amount = 10,
  category = null,
  difficulty = null,
  type = 'multiple'
) => {
  try {
    let url = `${API_BASE_URL}?amount=${amount}&type=${type}`;
    
    if (category) {
      url += `&category=${category}`;
    }
    
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    console.log(`Fetching questions from: ${url}`);

    // Use rate-limited fetch
    const response = await rateLimitedFetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      // Handle different API error codes
      switch (data.response_code) {
        case 1:
          throw new Error('NO_RESULTS');
        case 2:
          throw new Error('INVALID_PARAMETER');
        case 3:
          throw new Error('TOKEN_NOT_FOUND');
        case 4:
          throw new Error('TOKEN_EMPTY');
        case 5:
          throw new Error('RATE_LIMIT');
        default:
          throw new Error(`API_ERROR_${data.response_code}`);
      }
    }

    const formattedQuestions = data.results.map((question, index) => ({
      id: index + 1,
      category: question.category,
      difficulty: question.difficulty,
      question: decodeHTMLEntities(question.question),
      options: shuffleArray([
        ...question.incorrect_answers.map(decodeHTMLEntities),
        decodeHTMLEntities(question.correct_answer)
      ]),
      correctAnswer: question.correct_answer,
      explanation: `The correct answer is: ${decodeHTMLEntities(question.correct_answer)}`
    }));

    // ENHANCEMENT: Shuffle questions for better randomization
    return shuffleArray(formattedQuestions);

  } catch (error) {
    console.error('Error fetching questions from API:', error);
    
    // Handle specific error types
    if (error.message === 'RATE_LIMIT_EXCEEDED' || error.message === 'RATE_LIMIT') {
      throw new Error('Rate limit exceeded. Please wait a few seconds and try again, or switch to offline mode.');
    } else if (error.message === 'NO_RESULTS') {
      throw new Error('No questions found for the selected criteria. Try different settings or use offline mode.');
    } else if (error.message === 'INVALID_PARAMETER') {
      throw new Error('Invalid quiz settings. Please check your configuration.');
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your internet connection or try offline mode.');
    }
    
    throw error;
  }
};

/**
 * Enhanced version that handles rate limiting better
 * @param {number} amount - Number of questions needed
 * @param {number} category - Category ID (optional) 
 * @param {string} difficulty - Difficulty level (optional)
 * @param {string} type - Question type
 * @returns {Promise<Array>} Array of varied questions
 */
export const fetchQuestionsWithRetry = async (
  amount = 10,
  category = null,
  difficulty = null,
  type = 'multiple',
  maxRetries = 2
) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to fetch questions`);
      
      // For retry attempts, wait progressively longer
      if (attempt > 1) {
        const waitTime = attempt * 3000; // 3s, 6s, etc.
        console.log(`Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
      
      const questions = await fetchQuestionsFromAPI(amount, category, difficulty, type);
      console.log(`Successfully fetched ${questions.length} questions on attempt ${attempt}`);
      return questions;
      
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      // If it's a rate limit error, wait longer before retry
      if (error.message.includes('Rate limit') || error.message.includes('429')) {
        if (attempt < maxRetries) {
          const waitTime = 10000; // 10 seconds for rate limit
          console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
          await delay(waitTime);
        }
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }
  
  // All retries failed
  throw lastError;
};

/**
 * Decodes HTML entities in strings
 * @param {string} text - Text with HTML entities
 * @returns {string} Decoded text
 */
export const decodeHTMLEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

/**
 * Formats time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates percentage score
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} Percentage score (0-100)
 */
export const calculatePercentage = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Gets performance message based on score percentage
 * @param {number} percentage - Score percentage
 * @returns {object} Performance data with message and color
 */
export const getPerformanceMessage = (percentage) => {
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

/**
 * Saves score to localStorage for high scores tracking
 * @param {object} scoreData - Score data to save
 */
export const saveScore = (scoreData) => {
  try {
    const existingScores = getHighScores();
    const newScores = [...existingScores, scoreData].sort((a, b) => b.percentage - a.percentage);
    const topScores = newScores.slice(0, 10); // Keep only top 10 scores
    localStorage.setItem('quizmaster_scores', JSON.stringify(topScores));
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

/**
 * Gets high scores from localStorage
 * @returns {Array} Array of high scores
 */
export const getHighScores = () => {
  try {
    const scores = localStorage.getItem('quizmaster_scores');
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Error loading scores:', error);
    return [];
  }
};

/**
 * Clears all saved scores
 */
export const clearHighScores = () => {
  try {
    localStorage.removeItem('quizmaster_scores');
  } catch (error) {
    console.error('Error clearing scores:', error);
  }
};

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if we're currently rate limited
 * @returns {boolean} True if we should wait before making another request
 */
export const isRateLimited = () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  return timeSinceLastRequest < MIN_REQUEST_INTERVAL;
};

/**
 * Get time until next allowed request
 * @returns {number} Milliseconds to wait
 */
export const getTimeUntilNextRequest = () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  return Math.max(0, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
};