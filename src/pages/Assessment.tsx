import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AssessmentSecurity } from '../components/AssessmentSecurity';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  concept: string;
}

const Assessment = () => {
  const { user } = useAuthStore();
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    setAnswer, 
    answers, 
    completeAssessment,
    resetAssessment
  } = useAssessmentStore();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [securityVerified, setSecurityVerified] = useState(false);

  // Handle security verification
  const handleSecurityVerified = () => {
    setSecurityVerified(true);
    toast.success('Assessment security verified. Starting assessment...');
  };

  const handleSecurityFailed = () => {
    toast.error('Security verification failed. Redirecting to dashboard...');
    navigate('/dashboard');
  };

  // Monitor for security violations during assessment
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (securityVerified && !document.fullscreenElement) {
        toast.error('⚠️ Security Alert: Please return to fullscreen mode');
        // You could pause the timer here or take other actions
      }
    };

    const handleVisibilityChange = () => {
      if (securityVerified && document.hidden) {
        toast.error('⚠️ Security Alert: Tab switching detected');
        // Log the violation or take appropriate action
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!securityVerified) return;
      
      // Prevent common cheating key combinations
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
        toast.error('⚠️ Action blocked for assessment security');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [securityVerified]);

  // Generate adaptive questions based on user's job roles and skills
  useEffect(() => {
    const generateQuestions = async () => {
      setIsLoading(true);
      
      // Simulate AI-generated adaptive questions
      const mockQuestions: Question[] = [
        {
          id: 1,
          question: "What is the primary purpose of React hooks?",
          options: [
            "To add styling to components",
            "To manage state and lifecycle in functional components", 
            "To create class components",
            "To handle routing"
          ],
          correctAnswer: 1,
          difficulty: 'medium',
          category: 'Frontend Development',
          concept: 'React Fundamentals'
        },
        {
          id: 2,
          question: "Which algorithm has the best average time complexity for sorting?",
          options: [
            "Bubble Sort - O(n²)",
            "Quick Sort - O(n log n)",
            "Selection Sort - O(n²)",
            "Insertion Sort - O(n²)"
          ],
          correctAnswer: 1,
          difficulty: 'medium',
          category: 'Problem Solving',
          concept: 'Algorithms'
        },
        {
          id: 3,
          question: "In machine learning, what is overfitting?",
          options: [
            "When a model performs well on training data but poorly on test data",
            "When a model has too few parameters",
            "When training takes too long",
            "When the dataset is too small"
          ],
          correctAnswer: 0,
          difficulty: 'hard',
          category: 'Data Science',
          concept: 'Machine Learning'
        },
        // Add more questions based on user's selected job roles
        ...generateAdaptiveQuestions(user?.jobRoles || [])
      ];
      
      setQuestions(mockQuestions);
      setIsLoading(false);
    };

    generateQuestions();
    resetAssessment();
  }, [user?.jobRoles, resetAssessment]);

  // Define handleSubmitAssessment before using it in useEffect
  const handleSubmitAssessment = useCallback(async () => {
    setIsSubmitting(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    completeAssessment();
    toast.success('Assessment completed successfully!');
    navigate('/results');
  }, [completeAssessment, navigate]);

  // Timer countdown - only runs when security is verified
  useEffect(() => {
    if (!securityVerified) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [securityVerified, handleSubmitAssessment]);

  const generateAdaptiveQuestions = (jobRoles: string[]): Question[] => {
    const additionalQuestions: Question[] = [];
    
    jobRoles.forEach(role => {
      if (role.includes('Frontend')) {
        additionalQuestions.push({
          id: Date.now() + Math.random(),
          question: "Which CSS property is used for creating flexible layouts?",
          options: ["display: block", "display: flex", "display: inline", "display: none"],
          correctAnswer: 1,
          difficulty: 'easy',
          category: 'Frontend Development',
          concept: 'CSS Flexbox'
        });
      }
      
      if (role.includes('Data Scientist')) {
        additionalQuestions.push({
          id: Date.now() + Math.random(),
          question: "What is the purpose of cross-validation in machine learning?",
          options: [
            "To increase model complexity",
            "To assess model performance and prevent overfitting",
            "To reduce training time",
            "To increase dataset size"
          ],
          correctAnswer: 1,
          difficulty: 'hard',
          category: 'Data Science',
          concept: 'Model Validation'
        });
      }
    });
    
    return additionalQuestions;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    setAnswer(questions[currentQuestion].id, selectedAnswer.toString());
    
    // Adaptive difficulty adjustment
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect && currentDifficulty === 'easy') {
      setCurrentDifficulty('medium');
    } else if (isCorrect && currentDifficulty === 'medium') {
      setCurrentDifficulty('hard');
    } else if (!isCorrect && currentDifficulty === 'hard') {
      setCurrentDifficulty('medium');
    } else if (!isCorrect && currentDifficulty === 'medium') {
      setCurrentDifficulty('easy');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[questions[currentQuestion - 1].id];
      setSelectedAnswer(prevAnswer ? parseInt(prevAnswer) : null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show security setup if not verified
  if (!securityVerified) {
    return (
      <AssessmentSecurity
        onSecurityVerified={handleSecurityVerified}
        onSecurityFailed={handleSecurityFailed}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-gray-900">AI-Adaptive Assessment</h1>
                  <p className="text-sm text-gray-600">Powered by Hexaware AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Question</div>
                  <div className="font-bold text-gray-900">
                    {currentQuestion + 1} of {questions.length}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border mb-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {currentQ?.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQ?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    currentQ?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentQ?.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">{currentQ?.concept}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                {currentQ?.question}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQ?.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>AI is adapting difficulty based on your responses</span>
          </div>

          {currentQuestion === questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all"
            >
              <span>{isSubmitting ? 'Analyzing...' : 'Submit Assessment'}</span>
              <CheckCircle className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6" />
            <div>
              <h3 className="font-bold">AI Assessment Engine</h3>
              <p className="text-sm opacity-90">
                Our AI is analyzing your responses in real-time to provide personalized skill gap analysis
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Assessment;