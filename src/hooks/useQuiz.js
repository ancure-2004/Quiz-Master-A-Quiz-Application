import { useState, useEffect, useRef } from 'react';
import { fetchQuestionsWithRetry } from '../utils/api';
import questionsData from '../data/questions.json';

/**
 * Custom hook for managing quiz state and logic
 */
export const useQuiz = (options = {}) => {
  const {
    useAPI = false,
    amount = 10,
    category = null,
    difficulty = null,
    timeLimit = 30 // seconds per question
  } = options;

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const timerRef = useRef(null);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [useAPI, amount, category, difficulty]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, timerActive]);

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} New shuffled array
   */
  const shuffleQuestions = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * Load questions from API or local data
   */
  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let questionData;
      
      if (useAPI) {
        questionData = await fetchQuestionsWithRetry(amount, category, difficulty);
      } else {
        // Use local questions and filter/limit as needed
        let filteredQuestions = questionsData.questions
          .filter(q => {
            if (difficulty && q.difficulty !== difficulty) return false;
            return true;
          })
          .map((question, index) => ({
            ...question,
            id: question.id || index + 1
          }));

        // FIXED: Shuffle questions before selecting to randomize order
        const shuffledQuestions = shuffleQuestions(filteredQuestions);
        
        // If we have enough questions, take random selection
        // If not enough, repeat questions by shuffling again
        if (shuffledQuestions.length >= amount) {
          questionData = shuffledQuestions.slice(0, amount);
        } else if (shuffledQuestions.length > 0) {
          // If we need more questions than available, repeat with reshuffling
          questionData = [];
          let questionsPool = [...shuffledQuestions];
          
          while (questionData.length < amount) {
            if (questionsPool.length === 0) {
              // Reshuffle original questions when pool is empty
              questionsPool = shuffleQuestions(filteredQuestions);
            }
            
            // Take one question from pool
            const question = questionsPool.pop();
            
            // Assign new ID to avoid conflicts with repeated questions
            questionData.push({
              ...question,
              id: questionData.length + 1
            });
          }
        } else {
          questionData = [];
        }
      }

      if (questionData.length === 0) {
        throw new Error('No questions found');
      }

      setQuestions(questionData);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizCompleted(false);
      setScore(0);
      setTimeRemaining(timeLimit);
      setTimerActive(false);
      setStartTime(null);
      setEndTime(null);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err.message || 'Failed to load questions');
      
      // Fallback to local questions if API fails
      if (useAPI) {
        try {
          // Apply same shuffling logic for fallback
          const shuffledQuestions = shuffleQuestions(questionsData.questions);
          const fallbackQuestions = shuffledQuestions.slice(0, amount);
          setQuestions(fallbackQuestions);
          setError('Using offline questions due to connection issues');
        } catch (fallbackErr) {
          setError('Failed to load questions');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Start the quiz and timer
   */
  const startQuiz = () => {
    setStartTime(new Date());
    setTimerActive(true);
  };

  /**
   * Handle answer selection
   */
  const selectAnswer = (answerIndex) => {
    if (quizCompleted) return;

    const questionId = questions[currentQuestionIndex].id;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  /**
   * Move to next question
   */
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(timeLimit);
    } else {
      finishQuiz();
    }
  };

  /**
   * Move to previous question
   */
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeRemaining(timeLimit);
    }
  };

  /**
   * Handle time up for current question
   */
  const handleTimeUp = () => {
    setTimerActive(false);
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeRemaining(timeLimit);
        setTimerActive(true);
      } else {
        finishQuiz();
      }
    }, 1000);
  };

  /**
   * Finish the quiz and calculate results
   */
  const finishQuiz = () => {
    setTimerActive(false);
    setEndTime(new Date());
    
    let correctAnswers = 0;
    const results = questions.map((question, index) => {
      const userAnswer = selectedAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        question,
        userAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer
      };
    });

    setScore(correctAnswers);
    setQuizCompleted(true);

    return {
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100),
      results,
      timeTaken: startTime ? new Date() - startTime : 0
    };
  };

  /**
   * Restart the quiz with new shuffled questions
   */
  const restartQuiz = () => {
    // Reload questions to get a new random set
    loadQuestions();
  };

  /**
   * Skip current question
   */
  const skipQuestion = () => {
    nextQuestion();
  };

  // Computed values
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const hasSelectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] !== undefined : false;
  const canGoNext = hasSelectedAnswer || quizCompleted;
  const canGoPrevious = currentQuestionIndex > 0 && !quizCompleted;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const quizResults = quizCompleted ? {
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    results: questions.map(question => ({
      question,
      userAnswer: selectedAnswers[question.id],
      isCorrect: selectedAnswers[question.id] === question.correctAnswer,
      correctAnswer: question.correctAnswer
    })),
    timeTaken: startTime && endTime ? endTime - startTime : 0
  } : null;

  return {
    // State
    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    isLoading,
    error,
    quizCompleted,
    score,
    timeRemaining,
    timerActive,
    startTime,
    endTime,
    
    // Computed values
    progress,
    hasSelectedAnswer,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    quizResults,
    
    // Actions
    loadQuestions,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    finishQuiz,
    restartQuiz
  };
};

export default useQuiz;
