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

interface FallbackQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
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
    resetAssessment,
    setResults
  } = useAssessmentStore();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityVerified, setSecurityVerified] = useState(false);
  const [assessmentStartTime, setAssessmentStartTime] = useState<number | null>(null);

  // Handle security verification
  const handleSecurityVerified = () => {
    setSecurityVerified(true);
    setAssessmentStartTime(Date.now());
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
      }
    };

    const handleVisibilityChange = () => {
      if (securityVerified && document.hidden) {
        toast.error('⚠️ Security Alert: Tab switching detected');
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

  // AI question generation using Google Gemini
  const generateQuestionsWithAI = useCallback(async (jobRoles: string[]): Promise<Question[]> => {
    // Create detailed prompts for each role
    const rolePrompts = jobRoles.map(role => {
      switch (role.toLowerCase()) {
        case 'frontend developer':
          return 'React components, hooks, state management, JavaScript ES6+, CSS Grid/Flexbox, responsive design, TypeScript, component lifecycle, event handling, virtual DOM';
        case 'backend developer':
          return 'Node.js, Express.js, RESTful APIs, database design, authentication/authorization, middleware, error handling, server architecture, API security, data validation';
        case 'full stack developer':
          return 'full stack architecture, React + Node.js integration, database connections, API development, deployment strategies, version control, frontend-backend communication';
        case 'data scientist':
          return 'Python data analysis, pandas/numpy, machine learning algorithms, statistical analysis, data visualization, model evaluation, feature engineering, data preprocessing';
        case 'machine learning engineer':
          return 'deep learning, neural networks, TensorFlow/PyTorch, model deployment, MLOps, hyperparameter tuning, model optimization, production ML systems';
        case 'devops engineer':
          return 'Docker containerization, Kubernetes orchestration, CI/CD pipelines, cloud platforms (AWS/Azure), infrastructure as code, monitoring and logging, automation';
        case 'ui/ux designer':
          return 'user experience principles, design thinking, prototyping tools, user research methods, accessibility standards, design systems, usability testing';
        case 'cybersecurity analyst':
          return 'network security, threat detection, penetration testing, security protocols, vulnerability assessment, incident response, compliance frameworks';
        case 'product manager':
          return 'product strategy, agile methodology, user stories, market analysis, stakeholder management, product roadmaps, data-driven decisions';
        default:
          return 'general programming concepts, problem-solving, software engineering principles, algorithms and data structures';
      }
    }).join(', ');

    const prompt = `Generate exactly 15 technical assessment questions for a candidate applying for these specific roles: ${jobRoles.join(' and ')}.

IMPORTANT: Questions must be highly relevant to these specific job roles and cover these key areas: ${rolePrompts}

Requirements:
- Generate exactly 15 questions (no more, no less)
- Each question must have exactly 4 multiple choice options
- Include practical, hands-on scenarios relevant to the job roles
- Mix of difficulty: 5 easy, 5 medium, 5 hard questions
- Focus on real-world application rather than theory
- Avoid generic programming questions - make them role-specific

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "When building a React component, what is the best practice for handling form state?",
      "options": ["Use document.getElementById", "Use useState hook", "Use global variables", "Use localStorage directly"],
      "correctAnswer": 1,
      "difficulty": "medium",
      "category": "Frontend Development",
      "concept": "React State Management"
    }
  ]
}`;

    try {
      // Use Google Gemini API
      const apiKey = 'AIzaSyD1kOdRoqtlhQJOJ9_3fJJD6mUhDJFEFGE';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }

      const result = await response.json();
      const generatedText = result.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('No content generated');
      }

      console.log('🤖 Raw AI Response:', generatedText);

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      
      if (!parsedResult.questions || !Array.isArray(parsedResult.questions)) {
        throw new Error('Invalid question format in AI response');
      }

      // Format and validate questions
      const formattedQuestions = parsedResult.questions.slice(0, 15).map((q: {
        question: string;
        options: string[];
        correctAnswer: number;
        difficulty: string;
        category: string;
        concept: string;
      }, index: number) => ({
        id: index + 1,
        question: q.question || `Question ${index + 1}`,
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : [`Option A`, `Option B`, `Option C`, `Option D`],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        difficulty: (['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium') as 'easy' | 'medium' | 'hard',
        category: q.category || jobRoles[0],
        concept: q.concept || 'Role-specific Knowledge'
      }));

      // Ensure we have exactly 15 questions
      while (formattedQuestions.length < 15) {
        const baseQ = formattedQuestions[formattedQuestions.length % formattedQuestions.length];
        formattedQuestions.push({
          ...baseQ,
          id: formattedQuestions.length + 1,
          question: `${baseQ.question} (Additional question)`
        });
      }

      console.log('🎯 AI Generated role-specific questions:', formattedQuestions.length);
      console.log('📝 Question topics:', formattedQuestions.map((q: Question) => q.concept));
      return formattedQuestions.slice(0, 15);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      
      // Fallback to role-specific hardcoded questions
      return generateRoleSpecificFallback(jobRoles);
    }
  }, []);

  // Role-specific fallback questions when AI fails
  const generateRoleSpecificFallback = (jobRoles: string[]): Question[] => {
    // Comprehensive question bank for each role
    const roleQuestionBank: { [role: string]: FallbackQuestion[] } = {
      'Frontend Developer': [
        { question: "What is the correct way to update state in React functional components?", options: ["this.setState()", "useState hook", "setState()", "state.update()"], correctAnswer: 1, category: "Frontend Developer", concept: "React State Management" },
        { question: "Which CSS property creates a responsive grid layout?", options: ["display: block", "display: grid", "grid-layout: responsive", "layout: grid"], correctAnswer: 1, category: "Frontend Developer", concept: "CSS Grid" },
        { question: "What is the Virtual DOM in React?", options: ["Real DOM copy", "JavaScript representation of DOM", "CSS styling engine", "HTML parser"], correctAnswer: 1, category: "Frontend Developer", concept: "React Virtual DOM" },
        { question: "How do you handle events in React?", options: ["onClick={handleClick()}", "onClick={handleClick}", "onclick='handleClick()'", "onClick='handleClick'"], correctAnswer: 1, category: "Frontend Developer", concept: "React Events" },
        { question: "What is the purpose of useEffect hook?", options: ["State management", "Side effects", "Event handling", "Component rendering"], correctAnswer: 1, category: "Frontend Developer", concept: "React Hooks" }
      ],
      'Backend Developer': [
        { question: "What is middleware in Express.js?", options: ["Database connection", "Functions in request-response cycle", "Route creation", "Static file management"], correctAnswer: 1, category: "Backend Developer", concept: "Express Middleware" },
        { question: "Which HTTP status code indicates successful resource creation?", options: ["200", "201", "204", "301"], correctAnswer: 1, category: "Backend Developer", concept: "HTTP Status Codes" },
        { question: "What is the purpose of JWT tokens?", options: ["Data storage", "Authentication", "CSS styling", "DOM manipulation"], correctAnswer: 1, category: "Backend Developer", concept: "Authentication" },
        { question: "How do you handle database connections in Node.js?", options: ["Direct file system", "Connection pools", "Only synchronous calls", "Browser localStorage"], correctAnswer: 1, category: "Backend Developer", concept: "Database Management" },
        { question: "What is RESTful API design?", options: ["Random endpoints", "Representational State Transfer principles", "CSS framework", "Database schema"], correctAnswer: 1, category: "Backend Developer", concept: "API Design" }
      ],
      'Full Stack Developer': [
        { question: "Which technology is commonly used to connect a React frontend to a Node.js backend?", options: ["WebSockets", "REST API", "GraphQL", "All of the above"], correctAnswer: 3, category: "Full Stack Developer", concept: "Frontend-Backend Communication" },
        { question: "What is a common deployment strategy for full stack apps?", options: ["Monorepo with CI/CD", "Manual FTP upload", "Emailing code", "Copy-paste to server"], correctAnswer: 0, category: "Full Stack Developer", concept: "Deployment Strategies" },
        { question: "Which database is NoSQL?", options: ["MySQL", "MongoDB", "PostgreSQL", "Oracle"], correctAnswer: 1, category: "Full Stack Developer", concept: "Database Types" },
        { question: "What is the main benefit of using TypeScript in a full stack project?", options: ["Faster runtime", "Static type checking", "Better CSS", "No benefit"], correctAnswer: 1, category: "Full Stack Developer", concept: "TypeScript" },
        { question: "Which tool is used for version control?", options: ["Git", "Docker", "Nginx", "Jenkins"], correctAnswer: 0, category: "Full Stack Developer", concept: "Version Control" }
      ],
      'Data Scientist': [
        { question: "Which Python library is primarily used for data manipulation?", options: ["numpy", "pandas", "matplotlib", "scikit-learn"], correctAnswer: 1, category: "Data Scientist", concept: "Python Libraries" },
        { question: "What is the purpose of feature engineering?", options: ["Reduce dataset size", "Improve model performance by transforming variables", "Visualize data", "Clean missing values"], correctAnswer: 1, category: "Data Scientist", concept: "Feature Engineering" },
        { question: "Which statistical measure is most appropriate for handling outliers?", options: ["Mean", "Median", "Mode", "Range"], correctAnswer: 1, category: "Data Scientist", concept: "Statistics" },
        { question: "What does cross-validation help prevent?", options: ["Underfitting", "Overfitting", "Data leakage", "Feature scaling"], correctAnswer: 1, category: "Data Scientist", concept: "Model Validation" },
        { question: "Which algorithm is best for clustering unlabeled data?", options: ["Linear Regression", "K-Means", "Logistic Regression", "Decision Trees"], correctAnswer: 1, category: "Data Scientist", concept: "Unsupervised Learning" }
      ],
      'Machine Learning Engineer': [
        { question: "Which library is commonly used for deep learning in Python?", options: ["TensorFlow", "NumPy", "Pandas", "Matplotlib"], correctAnswer: 0, category: "Machine Learning Engineer", concept: "Deep Learning Libraries" },
        { question: "What is hyperparameter tuning?", options: ["Changing model weights", "Optimizing model settings", "Cleaning data", "Visualizing results"], correctAnswer: 1, category: "Machine Learning Engineer", concept: "Model Optimization" },
        { question: "Which is a common activation function in neural networks?", options: ["ReLU", "Sigmoid", "Tanh", "All of the above"], correctAnswer: 3, category: "Machine Learning Engineer", concept: "Activation Functions" },
        { question: "What is MLOps?", options: ["Machine Learning Operations", "A type of neural network", "A data cleaning method", "A visualization tool"], correctAnswer: 0, category: "Machine Learning Engineer", concept: "MLOps" },
        { question: "Which framework is used for model deployment?", options: ["Flask", "Django", "FastAPI", "All of the above"], correctAnswer: 3, category: "Machine Learning Engineer", concept: "Model Deployment" }
      ],
      'DevOps Engineer': [
        { question: "What is the main purpose of CI/CD pipelines?", options: ["Manual deployment", "Automated build and deployment", "Writing code", "Testing only"], correctAnswer: 1, category: "DevOps Engineer", concept: "CI/CD" },
        { question: "Which tool is used for containerization?", options: ["Docker", "Jenkins", "Git", "Nginx"], correctAnswer: 0, category: "DevOps Engineer", concept: "Containerization" },
        { question: "What is Infrastructure as Code?", options: ["Writing code for infrastructure", "Manual server setup", "Database design", "UI design"], correctAnswer: 0, category: "DevOps Engineer", concept: "IaC" },
        { question: "Which platform is commonly used for cloud deployments?", options: ["AWS", "Azure", "Google Cloud", "All of the above"], correctAnswer: 3, category: "DevOps Engineer", concept: "Cloud Platforms" },
        { question: "What is Kubernetes used for?", options: ["Orchestrating containers", "Writing code", "Testing", "Monitoring"], correctAnswer: 0, category: "DevOps Engineer", concept: "Kubernetes" }
      ],
      'UI/UX Designer': [
        { question: "What is the primary goal of user experience design?", options: ["Make it look pretty", "Create usable and meaningful experiences", "Add more features", "Reduce development time"], correctAnswer: 1, category: "UI/UX Designer", concept: "UX Principles" },
        { question: "Which design principle emphasizes visual hierarchy?", options: ["Contrast", "Alignment", "Repetition", "Proximity"], correctAnswer: 0, category: "UI/UX Designer", concept: "Design Principles" },
        { question: "What is a wireframe in design?", options: ["Final design", "Low-fidelity structural blueprint", "Color palette", "Font selection"], correctAnswer: 1, category: "UI/UX Designer", concept: "Design Process" },
        { question: "Which tool is commonly used for prototyping?", options: ["Excel", "Figma", "Notepad", "Calculator"], correctAnswer: 1, category: "UI/UX Designer", concept: "Design Tools" },
        { question: "What is the purpose of user personas?", options: ["Decoration", "Represent target user groups", "Legal requirements", "Technical specifications"], correctAnswer: 1, category: "UI/UX Designer", concept: "User Research" }
      ],
      'Cybersecurity Analyst': [
        { question: "What is the primary goal of penetration testing?", options: ["To develop new software", "To identify vulnerabilities in a system", "To increase network speed", "To backup data"], correctAnswer: 1, category: "Cybersecurity Analyst", concept: "Penetration Testing" },
        { question: "Which protocol is used to securely transfer files over the Internet?", options: ["FTP", "HTTP", "SFTP", "SMTP"], correctAnswer: 2, category: "Cybersecurity Analyst", concept: "Secure Protocols" },
        { question: "What does the principle of least privilege mean?", options: ["Giving all users admin rights", "Users have only the access necessary to perform their job", "No one can access the system", "Everyone shares the same password"], correctAnswer: 1, category: "Cybersecurity Analyst", concept: "Access Control" },
        { question: "Which tool is commonly used for network packet analysis?", options: ["Photoshop", "Wireshark", "Excel", "Notepad"], correctAnswer: 1, category: "Cybersecurity Analyst", concept: "Network Analysis" },
        { question: "What is a common method for preventing phishing attacks?", options: ["Ignoring emails", "User education and email filtering", "Using weak passwords", "Disabling antivirus"], correctAnswer: 1, category: "Cybersecurity Analyst", concept: "Phishing Prevention" }
      ],
      'Product Manager': [
        { question: "What is a user story in agile methodology?", options: ["A bug report", "A feature description from the user's perspective", "A test case", "A design mockup"], correctAnswer: 1, category: "Product Manager", concept: "Agile Methodology" },
        { question: "Which tool is commonly used for product roadmapping?", options: ["Jira", "Photoshop", "Excel", "Slack"], correctAnswer: 0, category: "Product Manager", concept: "Product Roadmaps" },
        { question: "What is MVP in product development?", options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Market Value Product"], correctAnswer: 1, category: "Product Manager", concept: "Product Development" },
        { question: "What is stakeholder management?", options: ["Managing code", "Managing people with interest in the product", "Managing servers", "Managing finances"], correctAnswer: 1, category: "Product Manager", concept: "Stakeholder Management" },
        { question: "Which metric is most important for product-market fit?", options: ["Churn rate", "Net Promoter Score", "Page views", "Lines of code"], correctAnswer: 1, category: "Product Manager", concept: "Product-Market Fit" }
      ]
    };

    let selectedQuestions: FallbackQuestion[] = [];
    jobRoles.forEach(role => {
      // Priority 1: Exact match (case-insensitive)
      const exactMatch = Object.keys(roleQuestionBank).find(key => key.toLowerCase() === role.toLowerCase());
      if (exactMatch) {
        selectedQuestions.push(...roleQuestionBank[exactMatch]);
        return;
      }
      // Priority 2: Fuzzy/substring match (only if user typo or partial, not as a fallback to other roles)
      const roleLower = role.toLowerCase();
      if (roleLower.includes('frontend')) {
        selectedQuestions.push(...roleQuestionBank['Frontend Developer']);
      } else if (roleLower.includes('backend')) {
        selectedQuestions.push(...roleQuestionBank['Backend Developer']);
      } else if (roleLower.includes('full stack')) {
        selectedQuestions.push(...roleQuestionBank['Full Stack Developer']);
      } else if (roleLower.includes('machine learning')) {
        selectedQuestions.push(...roleQuestionBank['Machine Learning Engineer']);
      } else if (roleLower.includes('devops')) {
        selectedQuestions.push(...roleQuestionBank['DevOps Engineer']);
      } else if (roleLower.includes('data')) {
        selectedQuestions.push(...roleQuestionBank['Data Scientist']);
      } else if (roleLower.includes('ui') && roleLower.includes('ux')) {
        selectedQuestions.push(...roleQuestionBank['UI/UX Designer']);
      } else if (roleLower.includes('cyber') || roleLower.includes('security')) {
        selectedQuestions.push(...roleQuestionBank['Cybersecurity Analyst']);
      } else if (roleLower.includes('product')) {
        selectedQuestions.push(...roleQuestionBank['Product Manager']);
      }
    });

    // If no specific questions found, return empty (no mix from other roles)
    if (selectedQuestions.length === 0) {
      return [];
    }

    // Format and ensure 15 questions, maximizing uniqueness
    let questions: Question[] = [];
    // Shuffle selectedQuestions for randomness
    const shuffled = [...selectedQuestions].sort(() => Math.random() - 0.5);
    // Use all unique questions first
    for (let i = 0; i < Math.min(15, shuffled.length); i++) {
      questions.push({
        id: i + 1,
        question: shuffled[i].question,
        options: shuffled[i].options,
        correctAnswer: shuffled[i].correctAnswer,
        difficulty: (i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
        category: shuffled[i].category,
        concept: shuffled[i].concept
      });
    }
    // If less than 15, repeat but mark as additional
    let nextId = questions.length + 1;
    while (questions.length < 15) {
      const baseQ = shuffled[(questions.length) % shuffled.length];
      questions.push({
        id: nextId++,
        question: `${baseQ.question} (Additional question)`,
        options: baseQ.options,
        correctAnswer: baseQ.correctAnswer,
        difficulty: (questions.length < 5 ? 'easy' : questions.length < 10 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
        category: baseQ.category,
        concept: baseQ.concept
      });
    }
    return questions;
  };

  // Generate AI-powered questions specifically for user's selected job roles
  useEffect(() => {
    const generateAIQuestions = async () => {
      if (!user?.jobRoles || user.jobRoles.length === 0) {
        toast.error('No job roles selected. Please complete your profile first.');
        navigate('/skills');
        return;
      }

      setIsLoading(true);

      try {
        console.log('🎯 Generating AI questions for roles:', user.jobRoles);

        // Call local AI generation using Google Gemini
        const aiQuestions = await generateQuestionsWithAI(user.jobRoles);

        console.log('✅ Generated questions:', aiQuestions.length);
        setQuestions(aiQuestions);
        toast.success('Questions generated based on your selected roles!');
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating questions:', error);
        toast.error('Failed to generate questions. Please try again.');
        navigate('/dashboard');
        setIsLoading(false);
      }
    };

    if (securityVerified) {
      generateAIQuestions();
      resetAssessment();
    }
  }, [user?.jobRoles, resetAssessment, navigate, securityVerified, generateQuestionsWithAI]);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setAnswer(questions[currentQuestion]?.id, answerIndex.toString());
  };

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(
        answers[questions[currentQuestion + 1]?.id] 
          ? parseInt(answers[questions[currentQuestion + 1].id]) 
          : null
      );
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(
        answers[questions[currentQuestion - 1]?.id] 
          ? parseInt(answers[questions[currentQuestion - 1].id]) 
          : null
      );
    }
  };

  // Submit assessment
  const handleSubmitAssessment = useCallback(async () => {
    setIsSubmitting(true);

    // Stop the camera stream immediately after assessment is submitted
    if ((window as any).__assessmentCameraStream) {
      try {
        (window as any).__assessmentCameraStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        (window as any).__assessmentCameraStream = null;
      } catch {}
    }


    // Calculate assessment results
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    const categoryScores: { [key: string]: { correct: number; total: number } } = {};
    const skillGaps: Array<{ skill: string; score: number; needsImprovement: boolean; topics: string[] }> = [];
    // Track performance by difficulty
    const difficultyStats: { [key: string]: { correct: number; total: number; topics: string[] } } = {
      easy: { correct: 0, total: 0, topics: [] },
      medium: { correct: 0, total: 0, topics: [] },
      hard: { correct: 0, total: 0, topics: [] }
    };

    // Calculate scores by category and difficulty
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer && parseInt(userAnswer) === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      // Track category performance
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { correct: 0, total: 0 };
      }
      categoryScores[question.category].total++;
      if (isCorrect) {
        categoryScores[question.category].correct++;
      }
      // Track difficulty performance
      if (question.difficulty && difficultyStats[question.difficulty]) {
        difficultyStats[question.difficulty].total++;
        if (isCorrect) {
          difficultyStats[question.difficulty].correct++;
        } else {
          difficultyStats[question.difficulty].topics.push(question.concept);
        }
      }
    });

    // Calculate overall score
    const overallScore = Math.round((correctAnswers / totalQuestions) * 100);

    // Generate skill gaps and recommendations
    Object.entries(categoryScores).forEach(([category, scores]) => {
      const categoryScore = Math.round((scores.correct / scores.total) * 100);
      const needsImprovement = categoryScore < 70;
      if (needsImprovement) {
        skillGaps.push({
          skill: category,
          score: categoryScore,
          needsImprovement: true,
          topics: questions
            .filter(q => q.category === category && (!answers[q.id] || parseInt(answers[q.id]) !== q.correctAnswer))
            .map(q => q.concept)
        });
      }
    });

    // Calculate accurate time spent
    let timeSpent = null;
    if (assessmentStartTime) {
      timeSpent = Math.round((Date.now() - assessmentStartTime) / 1000); // in seconds
    } else {
      timeSpent = 45 * 60 - timeLeft; // fallback
    }

    // Create detailed results with proper typing
    const detailedResults = {
      totalQuestions,
      correctAnswers,
      score: overallScore,
      timeSpent,
      categoryBreakdown: categoryScores,
      categoryScores: Object.entries(categoryScores).map(([category, scores]) => ({
        category,
        score: Math.round((scores.correct / scores.total) * 100),
        correct: scores.correct,
        total: scores.total
      })),
      skillGaps,
      difficultyStats, // <-- add this for Results.tsx
      recommendations: skillGaps.length > 0 
        ? [`Focus on improving ${skillGaps.map(sg => sg.skill).join(', ')}`, 'Practice more hands-on coding exercises', 'Review fundamental concepts in weak areas']
        : ['Great job! Continue practicing to maintain your skills', 'Consider taking on more challenging projects', 'Share your knowledge with others'],
      completedAt: new Date().toISOString()
    };

    // Store results
    setResults(detailedResults);
    completeAssessment();

    // Store in localStorage for persistence
    localStorage.setItem('latestAssessmentResult', JSON.stringify(detailedResults));

    // Navigate to results
    navigate('/results');
  }, [questions, answers, timeLeft, setResults, completeAssessment, navigate, assessmentStartTime]);

  // Timer effect with handleSubmitAssessment dependency
  useEffect(() => {
    if (!securityVerified || isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [securityVerified, isLoading, handleSubmitAssessment]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update selected answer when current question changes
  useEffect(() => {
    setSelectedAnswer(
      answers[questions[currentQuestion]?.id] 
        ? parseInt(answers[questions[currentQuestion].id]) 
        : null
    );
  }, [currentQuestion, answers, questions]);

  // Show security setup first
  if (!securityVerified) {
    return (
      <AssessmentSecurity 
        onSecurityVerified={handleSecurityVerified}
        onSecurityFailed={handleSecurityFailed}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Assessment</h2>
          <p className="text-gray-600">Creating questions based on your selected job roles...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600">Unable to generate assessment questions. Please try again.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Assessment</h1>
                <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <button
                onClick={handleSubmitAssessment}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {/* Question header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentQ.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer options */}
            <div className="space-y-4 mb-8">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>

              <button
                onClick={goToNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
