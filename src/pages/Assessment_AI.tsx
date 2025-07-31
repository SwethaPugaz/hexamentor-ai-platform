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
    resetAssessment,
    setResults
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
        console.log('📋 Debug: Roles:', user.jobRoles.map(r => `"${r}"`).join(', '));
        
        // Add explicit debugging toast messages
        toast.loading(`Generating questions for: ${user.jobRoles.join(', ')}`, { duration: 3000 });

        // Call local AI generation using Google Gemini
        const aiQuestions = await generateQuestionsWithAI(user.jobRoles);

        console.log('✅ Generated questions:', aiQuestions.length);
        console.log('📝 Question categories:', aiQuestions.map(q => q.category));
        console.log('🏷️ Question concepts:', aiQuestions.map(q => q.concept));
        
        setQuestions(aiQuestions);
        toast.success(`Generated ${aiQuestions.length} ${user.jobRoles.join('/')} specific questions!`);
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
  }, [user?.jobRoles, resetAssessment, navigate, securityVerified]);

  // AI question generation using Google Gemini
  const generateQuestionsWithAI = async (jobRoles: string[]): Promise<Question[]> => {
    console.log('🔍 AI Generation - Input job roles:', jobRoles);
    console.log('🔍 AI Generation - Lowercase roles:', jobRoles.map(r => r.toLowerCase()));
    
    // Create detailed prompts for each role
    const rolePrompts = jobRoles.map(role => {
      const roleKey = role.toLowerCase();
      console.log(`🎯 Processing role: "${role}" -> "${roleKey}"`);
      
      switch (roleKey) {
        case 'frontend developer':
          return 'React components, hooks, state management, JavaScript ES6+, CSS Grid/Flexbox, responsive design, TypeScript, component lifecycle, event handling, virtual DOM';
        case 'backend developer':
          return 'Node.js, Express.js, RESTful APIs, database design, authentication/authorization, middleware, error handling, server architecture, API security, data validation';
        case 'full stack developer':
          return 'full stack architecture, React + Node.js integration, database connections, API development, deployment strategies, version control, frontend-backend communication';
        case 'data scientist':
          return 'Python programming, pandas/numpy for data manipulation, statistical analysis and hypothesis testing, machine learning algorithms (supervised/unsupervised), data visualization with matplotlib/seaborn, SQL database queries, feature engineering techniques, model evaluation metrics, data preprocessing and cleaning, predictive modeling';
        case 'machine learning engineer':
          return 'deep learning frameworks (TensorFlow/PyTorch), neural network architectures, model deployment and MLOps, hyperparameter tuning, model optimization and performance, production ML systems, version control for ML, A/B testing for models, scalable ML infrastructure';
        case 'devops engineer':
          return 'Docker containerization, Kubernetes orchestration, CI/CD pipeline design, cloud platforms (AWS/Azure/GCP), infrastructure as code (Terraform), monitoring and logging systems, automation scripting, security best practices, system administration';
        case 'ui/ux designer':
          return 'user experience principles, design thinking methodology, prototyping tools (Figma/Sketch), user research and testing, accessibility standards (WCAG), design systems and component libraries, usability testing, information architecture';
        case 'cybersecurity analyst':
          return 'network security protocols, threat detection and analysis, penetration testing methodologies, security frameworks and compliance, vulnerability assessment, incident response procedures, cryptography and encryption, security monitoring tools, risk assessment';
        case 'product manager':
          return 'product strategy and roadmapping, agile and scrum methodologies, user story creation, market analysis and competitive research, stakeholder management, data-driven decision making, product metrics and KPIs, feature prioritization';
        default:
          console.log(`⚠️ Unknown role: "${role}" -> using default prompt`);
          return 'general programming concepts, problem-solving methodologies, software engineering principles, algorithms and data structures, system design basics';
      }
    }).join(', ');

    console.log('📝 Generated role prompts:', rolePrompts);

    const prompt = `You are generating technical assessment questions for a candidate applying SPECIFICALLY for these job roles: ${jobRoles.join(' and ')}.

CRITICAL REQUIREMENTS:
- Generate exactly 15 questions that are EXCLUSIVELY specific to: ${jobRoles.join(', ')}
- Questions MUST ONLY cover these role-specific areas: ${rolePrompts}
- ABSOLUTELY NO generic programming questions or questions from other domains
- Every question must directly test knowledge someone in ${jobRoles.join('/')} would need daily
- If the role is UI/UX Designer, focus ONLY on design, not frontend development
- If the role is Data Scientist, focus ONLY on data science, not web development
- If the role is Cybersecurity Analyst, focus ONLY on security, not general IT

STRICT ROLE BOUNDARIES:
${jobRoles.includes('Data Scientist') ? '- Data Scientist: Python pandas operations, statistical analysis, ML algorithms, data visualization, feature engineering, model evaluation - NO web development' : ''}
${jobRoles.includes('Cybersecurity Analyst') ? '- Cybersecurity: Network security protocols, threat analysis, penetration testing, encryption methods, incident response, compliance frameworks - NO programming' : ''}
${jobRoles.includes('UI/UX Designer') ? '- UI/UX Designer: Design principles, user research methods, prototyping tools, accessibility guidelines, usability testing, design systems - NO coding or frontend development' : ''}
${jobRoles.includes('Machine Learning Engineer') ? '- ML Engineer: Deep learning frameworks, MLOps, model deployment, hyperparameter tuning, production ML systems - NO web development' : ''}
${jobRoles.includes('DevOps Engineer') ? '- DevOps: Docker/Kubernetes, CI/CD pipelines, infrastructure as code, cloud platforms, monitoring systems - NO application development' : ''}
${jobRoles.includes('Product Manager') ? '- Product Manager: Product strategy, agile methodologies, user stories, market research, stakeholder management - NO technical implementation' : ''}
${jobRoles.includes('Frontend Developer') ? '- Frontend: React/JavaScript, CSS, responsive design, browser APIs, performance optimization - NOT design theory' : ''}
${jobRoles.includes('Backend Developer') ? '- Backend: Server architecture, APIs, databases, authentication, security, scalability - NOT frontend' : ''}

QUESTION REQUIREMENTS:
- Exactly 15 questions (no more, no less)
- Each question has exactly 4 multiple choice options
- Mix difficulty: 5 easy, 5 medium, 5 hard
- Focus on practical, hands-on scenarios that distinguish this role from others
- Test real-world application knowledge specific to the role

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "In pandas, which method would you use to handle missing values in a dataset?",
      "options": ["dropna()", "fillna()", "replace()", "interpolate()"],
      "correctAnswer": 1,
      "difficulty": "medium",
      "category": "${jobRoles[0]}",
      "concept": "Data Preprocessing"
    }
  ]
}

CRITICAL: Questions must be 100% specific to ${jobRoles.join(' and ')} roles with NO cross-contamination from other domains!`;

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
      const formattedQuestions = parsedResult.questions.slice(0, 15).map((q: any, index: number) => ({
        id: index + 1,
        question: q.question || `Question ${index + 1}`,
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : [`Option A`, `Option B`, `Option C`, `Option D`],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
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
      console.log('📝 Question categories:', formattedQuestions.map((q: any) => q.category));
      console.log('📝 Question concepts:', formattedQuestions.map((q: any) => q.concept));
      console.log('🔍 Sample questions:', formattedQuestions.slice(0, 3).map((q: any) => q.question));
      return formattedQuestions.slice(0, 15);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error('AI generation failed, using role-specific fallback questions');
      
      // Fallback to role-specific hardcoded questions
      return generateRoleSpecificFallback(jobRoles);
    }
  };

  // Role-specific fallback questions when AI fails
  const generateRoleSpecificFallback = (jobRoles: string[]): Question[] => {
    console.log('🚨 FALLBACK: Entering generateRoleSpecificFallback');
    console.log('🚨 FALLBACK: Input roles:', jobRoles);
    // Comprehensive question bank for each role (15 questions per role)
    const roleQuestionBank = {
      'Frontend Developer': [
        { question: "What is the correct way to update state in React functional components?", options: ["this.setState()", "useState hook", "setState()", "state.update()"], correctAnswer: 1, concept: "React State Management" },
        { question: "Which CSS property creates a responsive grid layout?", options: ["display: block", "display: grid", "grid-layout: responsive", "layout: grid"], correctAnswer: 1, concept: "CSS Grid" },
        { question: "What is the Virtual DOM in React?", options: ["Real DOM copy", "JavaScript representation of DOM", "CSS styling engine", "HTML parser"], correctAnswer: 1, concept: "React Virtual DOM" },
        { question: "How do you handle events in React?", options: ["onClick={handleClick()}", "onClick={handleClick}", "onclick='handleClick()'", "onClick='handleClick'"], correctAnswer: 1, concept: "React Events" },
        { question: "What is the purpose of useEffect hook?", options: ["State management", "Side effects", "Event handling", "Component rendering"], correctAnswer: 1, concept: "React Hooks" },
        { question: "Which method is used for conditional rendering in React?", options: ["if-else statements", "switch statements", "ternary operator", "All of the above"], correctAnswer: 3, concept: "Conditional Rendering" },
        { question: "What is CSS Flexbox used for?", options: ["Database queries", "Layout design", "API calls", "Image processing"], correctAnswer: 1, concept: "CSS Flexbox" },
        { question: "How do you create a responsive design?", options: ["Fixed pixel values", "Media queries", "Only JavaScript", "Only HTML"], correctAnswer: 1, concept: "Responsive Design" },
        { question: "What is TypeScript?", options: ["CSS preprocessor", "Superset of JavaScript", "Database language", "Styling framework"], correctAnswer: 1, concept: "TypeScript" },
        { question: "Which lifecycle method runs after component mounts?", options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUnmount"], correctAnswer: 0, concept: "React Lifecycle" },
        { question: "What is the purpose of React Router?", options: ["State management", "Client-side routing", "API calls", "CSS styling"], correctAnswer: 1, concept: "React Router" },
        { question: "How do you optimize React app performance?", options: ["Use class components only", "Use React.memo", "Avoid hooks", "Use inline styles"], correctAnswer: 1, concept: "React Performance" },
        { question: "What is the difference between px, em, and rem?", options: ["No difference", "px=absolute, em=relative to parent, rem=relative to root", "All are relative units", "px=relative, em and rem=absolute"], correctAnswer: 1, concept: "CSS Units" },
        { question: "How do you handle forms in React?", options: ["Only uncontrolled components", "Only controlled components", "Both controlled and uncontrolled", "Forms not supported"], correctAnswer: 2, concept: "React Forms" },
        { question: "What is the purpose of webpack?", options: ["Database management", "Module bundling", "API testing", "CSS preprocessing"], correctAnswer: 1, concept: "Build Tools" }
      ],
      
      'Backend Developer': [
        { question: "What is middleware in Express.js?", options: ["Database connection", "Functions in request-response cycle", "Route creation", "Static file management"], correctAnswer: 1, concept: "Express Middleware" },
        { question: "Which HTTP status code indicates successful resource creation?", options: ["200", "201", "204", "301"], correctAnswer: 1, concept: "HTTP Status Codes" },
        { question: "What is the purpose of JWT tokens?", options: ["Data storage", "Authentication", "CSS styling", "DOM manipulation"], correctAnswer: 1, concept: "Authentication" },
        { question: "How do you handle database connections in Node.js?", options: ["Direct file system", "Connection pools", "Only synchronous calls", "Browser localStorage"], correctAnswer: 1, concept: "Database Management" },
        { question: "What is RESTful API design?", options: ["Random endpoints", "Representational State Transfer principles", "CSS framework", "Database schema"], correctAnswer: 1, concept: "API Design" },
        { question: "How do you handle errors in Express.js?", options: ["Try-catch only", "Error middleware", "Ignore errors", "Client-side handling"], correctAnswer: 1, concept: "Error Handling" },
        { question: "What is the purpose of CORS?", options: ["Database security", "Cross-origin resource sharing", "CSS styling", "File compression"], correctAnswer: 1, concept: "Web Security" },
        { question: "How do you validate input data in APIs?", options: ["Client-side only", "Server-side validation", "No validation needed", "Database validation only"], correctAnswer: 1, concept: "Data Validation" },
        { question: "What is the difference between SQL and NoSQL?", options: ["No difference", "SQL=relational, NoSQL=non-relational", "SQL=faster, NoSQL=slower", "SQL=new, NoSQL=old"], correctAnswer: 1, concept: "Database Types" },
        { question: "How do you implement pagination in APIs?", options: ["Return all data", "Limit and offset parameters", "Client-side only", "Not possible"], correctAnswer: 1, concept: "API Optimization" },
        { question: "What is the purpose of environment variables?", options: ["Styling", "Configuration management", "Database queries", "File processing"], correctAnswer: 1, concept: "Configuration" },
        { question: "How do you secure API endpoints?", options: ["No security needed", "Authentication and authorization", "Only HTTPS", "Client-side validation"], correctAnswer: 1, concept: "API Security" },
        { question: "What is database indexing?", options: ["Data backup", "Query performance optimization", "Data encryption", "Table creation"], correctAnswer: 1, concept: "Database Optimization" },
        { question: "How do you handle file uploads in Node.js?", options: ["Direct file system", "Multer middleware", "Browser only", "Not possible"], correctAnswer: 1, concept: "File Handling" },
        { question: "What is the purpose of caching in backend systems?", options: ["Data loss", "Performance improvement", "Security", "Debugging"], correctAnswer: 1, concept: "Caching" }
      ],

      'Data Scientist': [
        { question: "Which Python library is primarily used for data manipulation?", options: ["numpy", "pandas", "matplotlib", "scikit-learn"], correctAnswer: 1, concept: "Python Libraries" },
        { question: "What is the purpose of feature engineering?", options: ["Reduce dataset size", "Improve model performance by transforming variables", "Visualize data", "Clean missing values"], correctAnswer: 1, concept: "Feature Engineering" },
        { question: "Which statistical measure is most appropriate for handling outliers?", options: ["Mean", "Median", "Mode", "Range"], correctAnswer: 1, concept: "Statistics" },
        { question: "What does cross-validation help prevent?", options: ["Underfitting", "Overfitting", "Data leakage", "Feature scaling"], correctAnswer: 1, concept: "Model Validation" },
        { question: "Which algorithm is best for clustering unlabeled data?", options: ["Linear Regression", "K-Means", "Logistic Regression", "Decision Trees"], correctAnswer: 1, concept: "Unsupervised Learning" },
        { question: "What is the purpose of normalization in data preprocessing?", options: ["Remove duplicates", "Scale features to similar ranges", "Handle missing values", "Create new features"], correctAnswer: 1, concept: "Data Preprocessing" },
        { question: "Which metric is best for evaluating classification models with imbalanced data?", options: ["Accuracy", "F1-Score", "Mean Squared Error", "R-squared"], correctAnswer: 1, concept: "Model Evaluation" },
        { question: "What is the difference between supervised and unsupervised learning?", options: ["No difference", "Supervised has labeled data, unsupervised doesn't", "Supervised is faster", "Unsupervised is more accurate"], correctAnswer: 1, concept: "Machine Learning Types" },
        { question: "Which visualization is best for showing correlation between variables?", options: ["Bar chart", "Scatter plot", "Pie chart", "Line chart"], correctAnswer: 1, concept: "Data Visualization" },
        { question: "What is the purpose of train-test split?", options: ["Reduce data size", "Evaluate model performance on unseen data", "Speed up training", "Clean data"], correctAnswer: 1, concept: "Model Training" },
        { question: "Which technique helps reduce dimensionality?", options: ["Data cleaning", "PCA (Principal Component Analysis)", "Cross-validation", "Feature scaling"], correctAnswer: 1, concept: "Dimensionality Reduction" },
        { question: "What is the bias-variance tradeoff?", options: ["Speed vs accuracy", "Balance between model complexity and generalization", "Training vs testing", "Supervised vs unsupervised"], correctAnswer: 1, concept: "Model Theory" },
        { question: "Which SQL operation is used to combine data from multiple tables?", options: ["SELECT", "JOIN", "WHERE", "GROUP BY"], correctAnswer: 1, concept: "SQL" },
        { question: "What is A/B testing used for?", options: ["Data cleaning", "Comparing two versions to determine better performance", "Model training", "Feature selection"], correctAnswer: 1, concept: "Experimentation" },
        { question: "Which Python library is best for statistical analysis?", options: ["pandas", "scipy", "matplotlib", "seaborn"], correctAnswer: 1, concept: "Statistical Analysis" }
      ],

      'Cybersecurity Analyst': [
        { question: "What is the primary purpose of a firewall?", options: ["Data encryption", "Network traffic filtering", "Password management", "Virus scanning"], correctAnswer: 1, concept: "Network Security" },
        { question: "Which attack involves tricking users into revealing sensitive information?", options: ["DDoS attack", "SQL injection", "Phishing", "Buffer overflow"], correctAnswer: 2, concept: "Social Engineering" },
        { question: "What does the principle of 'least privilege' mean?", options: ["Maximum security settings", "Giving users minimum necessary access", "Using strong passwords", "Regular security updates"], correctAnswer: 1, concept: "Access Control" },
        { question: "Which encryption standard is currently most secure?", options: ["DES", "3DES", "AES", "MD5"], correctAnswer: 2, concept: "Cryptography" },
        { question: "What is the main purpose of penetration testing?", options: ["Data backup", "System performance", "Finding security vulnerabilities", "Network speed testing"], correctAnswer: 2, concept: "Security Testing" },
        { question: "What is a SQL injection attack?", options: ["Physical server attack", "Malicious code inserted into SQL statements", "Network flooding", "Password cracking"], correctAnswer: 1, concept: "Web Security" },
        { question: "Which protocol ensures secure data transmission over the internet?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], correctAnswer: 1, concept: "Secure Protocols" },
        { question: "What is the purpose of multi-factor authentication?", options: ["Faster login", "Additional security layers", "Password recovery", "User convenience"], correctAnswer: 1, concept: "Authentication" },
        { question: "Which tool is commonly used for network vulnerability scanning?", options: ["Excel", "Nmap", "Word", "PowerPoint"], correctAnswer: 1, concept: "Security Tools" },
        { question: "What is a zero-day vulnerability?", options: ["Old security flaw", "Unknown security flaw with no patch", "Fixed security issue", "False security alert"], correctAnswer: 1, concept: "Vulnerability Management" },
        { question: "What is the purpose of incident response planning?", options: ["Prevent all attacks", "Structured approach to handle security breaches", "Increase system speed", "Reduce costs"], correctAnswer: 1, concept: "Incident Response" },
        { question: "Which type of malware encrypts user files for ransom?", options: ["Virus", "Ransomware", "Trojan", "Spyware"], correctAnswer: 1, concept: "Malware Analysis" },
        { question: "What is the purpose of a VPN?", options: ["Increase internet speed", "Secure and private network connection", "Store passwords", "Scan for viruses"], correctAnswer: 1, concept: "Network Security" },
        { question: "Which compliance framework is commonly used in cybersecurity?", options: ["HTML5", "ISO 27001", "CSS3", "JSON"], correctAnswer: 1, concept: "Compliance" },
        { question: "What is social engineering in cybersecurity?", options: ["Network configuration", "Manipulating people to reveal information", "Software development", "Hardware installation"], correctAnswer: 1, concept: "Human Factors" }
      ],

      'UI/UX Designer': [
        { question: "What is the primary goal of user experience design?", options: ["Make it look pretty", "Create usable and meaningful experiences", "Add more features", "Reduce development time"], correctAnswer: 1, concept: "UX Principles" },
        { question: "Which design principle emphasizes visual hierarchy?", options: ["Contrast", "Alignment", "Repetition", "Proximity"], correctAnswer: 0, concept: "Design Principles" },
        { question: "What is a wireframe in design?", options: ["Final design", "Low-fidelity structural blueprint", "Color palette", "Font selection"], correctAnswer: 1, concept: "Design Process" },
        { question: "Which tool is commonly used for prototyping?", options: ["Excel", "Figma", "Notepad", "Calculator"], correctAnswer: 1, concept: "Design Tools" },
        { question: "What is the purpose of user personas?", options: ["Decoration", "Represent target user groups", "Legal requirements", "Technical specifications"], correctAnswer: 1, concept: "User Research" },
        { question: "Which accessibility guideline ensures web content is usable by people with disabilities?", options: ["WCAG", "HTML5", "CSS3", "JavaScript"], correctAnswer: 0, concept: "Accessibility" },
        { question: "What is A/B testing in UX design?", options: ["Testing two design versions", "Testing browser compatibility", "Testing loading speed", "Testing security"], correctAnswer: 0, concept: "Testing Methods" },
        { question: "Which color model is used for digital displays?", options: ["CMYK", "RGB", "Pantone", "Grayscale"], correctAnswer: 1, concept: "Color Theory" },
        { question: "What is the purpose of a design system?", options: ["Store files", "Consistent design language and components", "Project management", "Bug tracking"], correctAnswer: 1, concept: "Design Systems" },
        { question: "Which usability heuristic emphasizes error prevention?", options: ["Visibility of system status", "Error prevention", "Help users recover from errors", "Consistency"], correctAnswer: 1, concept: "Usability Heuristics" },
        { question: "What is the ideal line length for readability?", options: ["20-30 characters", "45-75 characters", "100-120 characters", "200+ characters"], correctAnswer: 1, concept: "Typography" },
        { question: "Which research method involves observing users in their natural environment?", options: ["Surveys", "Interviews", "Ethnographic studies", "Card sorting"], correctAnswer: 2, concept: "User Research Methods" },
        { question: "What is the purpose of information architecture?", options: ["Visual design", "Organizing and structuring content", "Writing code", "Testing functionality"], correctAnswer: 1, concept: "Information Architecture" },
        { question: "Which gesture is commonly used for navigation in mobile apps?", options: ["Double-tap", "Swipe", "Long press", "Pinch"], correctAnswer: 1, concept: "Mobile UX" },
        { question: "What is the difference between UX and UI design?", options: ["No difference", "UX focuses on experience, UI on interface", "UX is coding, UI is design", "UI is more important"], correctAnswer: 1, concept: "UX vs UI" }
      ],

      'Machine Learning Engineer': [
        { question: "Which framework is commonly used for deep learning?", options: ["pandas", "TensorFlow", "Excel", "Word"], correctAnswer: 1, concept: "Deep Learning Frameworks" },
        { question: "What is the purpose of MLOps?", options: ["Model development only", "Operationalizing ML models in production", "Data cleaning", "UI design"], correctAnswer: 1, concept: "MLOps" },
        { question: "Which technique helps prevent overfitting in neural networks?", options: ["Adding more layers", "Dropout", "Increasing learning rate", "Reducing data"], correctAnswer: 1, concept: "Regularization" },
        { question: "What is model deployment?", options: ["Training models", "Making models available for production use", "Data collection", "Feature engineering"], correctAnswer: 1, concept: "Model Deployment" },
        { question: "Which metric is used to evaluate regression models?", options: ["Accuracy", "Mean Squared Error", "F1-Score", "Precision"], correctAnswer: 1, concept: "Model Evaluation" },
        { question: "What is hyperparameter tuning?", options: ["Cleaning data", "Optimizing model parameters", "Creating features", "Collecting data"], correctAnswer: 1, concept: "Hyperparameter Optimization" },
        { question: "Which technique is used for handling imbalanced datasets?", options: ["Remove all data", "SMOTE (Synthetic Minority Oversampling)", "Ignore the problem", "Use only majority class"], correctAnswer: 1, concept: "Imbalanced Data" },
        { question: "What is the purpose of model versioning?", options: ["Delete old models", "Track and manage different model versions", "Speed up training", "Reduce memory usage"], correctAnswer: 1, concept: "Model Management" },
        { question: "Which activation function is commonly used in hidden layers?", options: ["Sigmoid", "ReLU", "Linear", "Step function"], correctAnswer: 1, concept: "Neural Networks" },
        { question: "What is the purpose of feature scaling?", options: ["Create new features", "Normalize feature ranges", "Remove features", "Visualize features"], correctAnswer: 1, concept: "Feature Engineering" },
        { question: "Which technique is used for model interpretability?", options: ["More complex models", "SHAP (SHapley Additive exPlanations)", "Faster training", "Less data"], correctAnswer: 1, concept: "Model Interpretability" },
        { question: "What is ensemble learning?", options: ["Single model", "Combining multiple models", "Data preprocessing", "Feature selection"], correctAnswer: 1, concept: "Ensemble Methods" },
        { question: "Which cloud platform is commonly used for ML deployment?", options: ["Only local computers", "AWS/Azure/GCP", "Personal laptops", "Mobile phones"], correctAnswer: 1, concept: "Cloud Computing" },
        { question: "What is the purpose of model monitoring?", options: ["One-time setup", "Continuously track model performance", "Initial training only", "Data collection"], correctAnswer: 1, concept: "Model Monitoring" },
        { question: "Which technique helps with gradient vanishing problem?", options: ["Deeper networks", "Batch normalization", "More data", "Simpler models"], correctAnswer: 1, concept: "Training Optimization" }
      ],

      'DevOps Engineer': [
        { question: "What is containerization in DevOps?", options: ["Virtual machines", "Packaging applications with dependencies", "Cloud storage", "Database management"], correctAnswer: 1, concept: "Containerization" },
        { question: "Which tool is commonly used for container orchestration?", options: ["Excel", "Kubernetes", "Word", "PowerPoint"], correctAnswer: 1, concept: "Container Orchestration" },
        { question: "What is the purpose of CI/CD pipelines?", options: ["Data analysis", "Automated build, test, and deployment", "User interface design", "Database queries"], correctAnswer: 1, concept: "CI/CD" },
        { question: "Which command is used to build a Docker image?", options: ["docker run", "docker build", "docker push", "docker pull"], correctAnswer: 1, concept: "Docker" },
        { question: "What is Infrastructure as Code (IaC)?", options: ["Writing code only", "Managing infrastructure through code", "Manual server setup", "Hardware installation"], correctAnswer: 1, concept: "Infrastructure as Code" },
        { question: "Which tool is used for configuration management?", options: ["Notepad", "Ansible", "Calculator", "Paint"], correctAnswer: 1, concept: "Configuration Management" },
        { question: "What is the purpose of monitoring in DevOps?", options: ["Decoration", "Track system performance and health", "User registration", "Data entry"], correctAnswer: 1, concept: "Monitoring" },
        { question: "Which cloud service model provides the most control?", options: ["SaaS", "PaaS", "IaaS", "FaaS"], correctAnswer: 2, concept: "Cloud Services" },
        { question: "What is the purpose of load balancing?", options: ["Reduce security", "Distribute traffic across servers", "Store data", "Design interfaces"], correctAnswer: 1, concept: "Load Balancing" },
        { question: "Which version control system is most commonly used?", options: ["SVN", "Git", "CVS", "Mercurial"], correctAnswer: 1, concept: "Version Control" },
        { question: "What is the purpose of automated testing in CI/CD?", options: ["Slow down deployment", "Ensure code quality before deployment", "Increase manual work", "Reduce security"], correctAnswer: 1, concept: "Automated Testing" },
        { question: "Which tool is used for infrastructure provisioning?", options: ["Microsoft Word", "Terraform", "Excel", "PowerPoint"], correctAnswer: 1, concept: "Infrastructure Provisioning" },
        { question: "What is blue-green deployment?", options: ["Color coding", "Deployment strategy with two environments", "Database backup", "User authentication"], correctAnswer: 1, concept: "Deployment Strategies" },
        { question: "Which protocol is commonly used for secure communication?", options: ["HTTP", "SSH", "FTP", "Telnet"], correctAnswer: 1, concept: "Security" },
        { question: "What is the purpose of container registries?", options: ["Store databases", "Store and distribute container images", "User management", "File storage"], correctAnswer: 1, concept: "Container Management" }
      ],

      'Product Manager': [
        { question: "What is the primary role of a Product Manager?", options: ["Write code", "Define product strategy and guide development", "Design interfaces", "Manage servers"], correctAnswer: 1, concept: "Product Strategy" },
        { question: "Which framework is commonly used for agile development?", options: ["Waterfall", "Scrum", "Spiral", "V-Model"], correctAnswer: 1, concept: "Agile Methodology" },
        { question: "What is a user story in product management?", options: ["Technical documentation", "Brief description of feature from user perspective", "Code repository", "Database schema"], correctAnswer: 1, concept: "User Stories" },
        { question: "Which metric is important for measuring product success?", options: ["Lines of code", "User engagement", "Server uptime", "Database size"], correctAnswer: 1, concept: "Product Metrics" },
        { question: "What is the purpose of a product roadmap?", options: ["Technical architecture", "Strategic plan showing product direction", "User interface design", "Database design"], correctAnswer: 1, concept: "Product Roadmap" },
        { question: "Which technique is used for prioritizing features?", options: ["Random selection", "MoSCoW method", "Alphabetical order", "Technical complexity"], correctAnswer: 1, concept: "Feature Prioritization" },
        { question: "What is market research in product management?", options: ["Code testing", "Understanding target market and competition", "Server monitoring", "Database optimization"], correctAnswer: 1, concept: "Market Research" },
        { question: "Which role does a PM play in cross-functional teams?", options: ["Only technical decisions", "Coordinate and align different teams", "Only design decisions", "Only business decisions"], correctAnswer: 1, concept: "Team Leadership" },
        { question: "What is A/B testing for products?", options: ["Code testing", "Comparing two product versions", "Security testing", "Performance testing"], correctAnswer: 1, concept: "Product Testing" },
        { question: "Which document defines product requirements?", options: ["Code comments", "PRD (Product Requirements Document)", "Server logs", "Database schema"], correctAnswer: 1, concept: "Documentation" },
        { question: "What is customer feedback analysis?", options: ["Code review", "Understanding user needs and pain points", "Server performance", "Database queries"], correctAnswer: 1, concept: "Customer Research" },
        { question: "Which stage comes first in product development?", options: ["Development", "Discovery and validation", "Testing", "Deployment"], correctAnswer: 1, concept: "Product Development" },
        { question: "What is competitive analysis?", options: ["Code comparison", "Studying competitor products and strategies", "Server comparison", "Database comparison"], correctAnswer: 1, concept: "Competitive Analysis" },
        { question: "Which KPI measures user retention?", options: ["Code coverage", "Monthly Active Users", "Server uptime", "Database size"], correctAnswer: 1, concept: "Product Analytics" },
        { question: "What is stakeholder management?", options: ["Code management", "Managing relationships with all interested parties", "Server management", "Database management"], correctAnswer: 1, concept: "Stakeholder Management" }
      ]
    };

    console.log('� FALLBACK: Available roles in question bank:', Object.keys(roleQuestionBank));
    console.log('�🔍 Fallback: Processing job roles:', jobRoles);
    toast.loading(`Using fallback questions for: ${jobRoles.join(', ')}`, { duration: 2000 });

    // Get questions specifically for selected roles only
    let selectedQuestions: Partial<Question>[] = [];
    
    jobRoles.forEach(role => {
      console.log('🎯 Looking for questions for role:', role);
      
      // Direct role matching (more precise) - exact key match
      if (roleQuestionBank[role as keyof typeof roleQuestionBank]) {
        const roleQuestions = roleQuestionBank[role as keyof typeof roleQuestionBank];
        console.log(`✅ EXACT MATCH: Found ${roleQuestions.length} questions for "${role}"`);
        selectedQuestions.push(...roleQuestions);
        return; // Skip fuzzy matching if exact match found
      }
      
      // Enhanced fuzzy matching with better priority order
      const roleLower = role.toLowerCase();
      console.log(`🔍 No exact match for "${role}", trying fuzzy match for "${roleLower}"`);
      
      // Priority 1: Exact lowercase matches for our known roles
      if (roleLower === 'ui/ux designer') {
        console.log('✅ Adding UI/UX Designer questions for:', role);
        selectedQuestions.push(...roleQuestionBank['UI/UX Designer']);
      } else if (roleLower === 'frontend developer') {
        console.log('✅ Adding Frontend Developer questions for:', role);
        selectedQuestions.push(...roleQuestionBank['Frontend Developer']);
      } else if (roleLower === 'backend developer') {
        console.log('✅ Adding Backend Developer questions for:', role);
        selectedQuestions.push(...roleQuestionBank['Backend Developer']);
      } else if (roleLower === 'data scientist') {
        console.log('✅ Adding Data Scientist questions for:', role);
        selectedQuestions.push(...roleQuestionBank['Data Scientist']);
      } else if (roleLower === 'machine learning engineer') {
        console.log('✅ Adding ML Engineer questions for:', role);
        selectedQuestions.push(...roleQuestionBank['Machine Learning Engineer']);
      } else if (roleLower === 'devops engineer') {
        console.log('✅ Adding DevOps questions for:', role);
        selectedQuestions.push(...roleQuestionBank['DevOps Engineer']);
      } else if (roleLower === 'cybersecurity analyst') {
        console.log('✅ Adding Cybersecurity questions for:', role);
        selectedQuestions.push(...roleQuestionBank['Cybersecurity Analyst']);
      } else if (roleLower === 'product manager') {
        console.log('✅ Adding Product Manager questions for:', role);
        selectedQuestions.push(...roleQuestionBank['Product Manager']);
      } 
      // Priority 2: Fallback substring matching (less precise)
      else if (roleLower.includes('frontend') || roleLower.includes('front-end') || roleLower.includes('react')) {
        console.log('✅ Adding Frontend Developer questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Frontend Developer']);
      } else if (roleLower.includes('backend') || roleLower.includes('back-end') || roleLower.includes('node')) {
        console.log('✅ Adding Backend Developer questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Backend Developer']);
      } else if (roleLower.includes('full stack') || roleLower.includes('fullstack')) {
        console.log('✅ Adding Full Stack questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Frontend Developer'].slice(0, 7));
        selectedQuestions.push(...roleQuestionBank['Backend Developer'].slice(0, 8));
      } else if (roleLower.includes('data') && roleLower.includes('scientist')) {
        console.log('✅ Adding Data Scientist questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Data Scientist']);
      } else if (roleLower.includes('machine learning') || roleLower.includes('ml')) {
        console.log('✅ Adding ML Engineer questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Machine Learning Engineer']);
      } else if (roleLower.includes('devops') || roleLower.includes('dev ops')) {
        console.log('✅ Adding DevOps questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['DevOps Engineer']);
      } else if (roleLower.includes('product') && roleLower.includes('manager')) {
        console.log('✅ Adding Product Manager questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Product Manager']);
      } else if ((roleLower.includes('ui') && roleLower.includes('ux')) || roleLower.includes('designer')) {
        console.log('✅ Adding UI/UX Designer questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['UI/UX Designer']);
      } else if (roleLower.includes('cyber') || roleLower.includes('security')) {
        console.log('✅ Adding Cybersecurity questions (substring match) for:', role);
        selectedQuestions.push(...roleQuestionBank['Cybersecurity Analyst']);
      } else {
        console.log(`⚠️ No questions found for unknown role: "${role}"`);
      }
    });

    console.log('📊 Total selected questions before filtering:', selectedQuestions.length);

    // If no specific questions found, this means unknown role
    if (selectedQuestions.length === 0) {
      console.log('⚠️ No questions found for roles:', jobRoles);
      // Use a mix as fallback only if truly no role matches
      selectedQuestions = [
        ...roleQuestionBank['Frontend Developer'].slice(0, 3),
        ...roleQuestionBank['Backend Developer'].slice(0, 3),
        ...roleQuestionBank['Data Scientist'].slice(0, 3),
        ...roleQuestionBank['Cybersecurity Analyst'].slice(0, 3),
        ...roleQuestionBank['UI/UX Designer'].slice(0, 3)
      ];
    }

    // Shuffle and select exactly 15 questions
    const shuffled = selectedQuestions.sort(() => 0.5 - Math.random());
    const selected15 = shuffled.slice(0, 15);

    // If we have fewer than 15, repeat some questions
    while (selected15.length < 15) {
      const additionalQuestions = shuffled.slice(15, 30);
      selected15.push(...additionalQuestions.slice(0, 15 - selected15.length));
    }

    // Format questions with proper types
    const questions: Question[] = selected15.map((q, index) => ({
      id: index + 1,
      question: q.question || `Question ${index + 1}`,
      options: q.options || ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: q.correctAnswer || 0,
      difficulty: (index < 5 ? 'easy' : index < 10 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
      category: jobRoles[0] || 'General', // Use the primary selected role
      concept: q.concept || 'Technical Knowledge'
    }));

    console.log('🎯 Final role-specific questions generated:', questions.length);
    console.log('📝 Question concepts:', questions.map(q => q.concept));
    console.log('🏷️ Categories:', [...new Set(questions.map(q => q.category))]);
    
    return questions;
  };

  // Timer effect
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
  }, [securityVerified, isLoading]);

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
    
    // Calculate assessment results
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    const categoryScores: { [key: string]: { correct: number; total: number } } = {};
    const skillGaps: Array<{ skill: string; score: number; needsImprovement: boolean; topics: string[] }> = [];

    // Calculate scores by category
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

    // Create detailed results
    const detailedResults = {
      totalQuestions,
      correctAnswers,
      score: overallScore,
      timeSpent: 45 * 60 - timeLeft,
      categoryBreakdown: categoryScores,
      skillGaps,
      recommendations: skillGaps.length > 0 
        ? [`Focus on improving ${skillGaps.map(sg => sg.skill).join(', ')}`, 'Practice more hands-on coding exercises', 'Review fundamental concepts in weak areas']
        : ['Great job! Continue practicing to maintain your skills', 'Consider taking on more challenging projects', 'Share your knowledge with others']
    };

    // Store results
    setResults(detailedResults);
    completeAssessment();

    // Store in localStorage for persistence
    localStorage.setItem('latestAssessmentResult', JSON.stringify(detailedResults));

    // Navigate to results
    navigate('/results');
  }, [questions, answers, timeLeft, setResults, completeAssessment, navigate]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
                <p className="text-xs text-blue-600">
                  Selected Roles: {user?.jobRoles?.join(', ') || 'None'} | 
                  Question Types: {[...new Set(questions.map(q => q.category))].join(', ')}
                </p>
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
              <p className="text-sm text-gray-500 mt-2">
                Concept: {currentQ.concept} | Category: {currentQ.category}
              </p>
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
