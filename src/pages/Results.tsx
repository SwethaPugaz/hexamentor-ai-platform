import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Star
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SkillAnalysis {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  category: 'technical' | 'analytical' | 'creative' | 'leadership';
  improvement: string;
}

interface CompetencyMetric {
  name: string;
  score: number;
  maxScore: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
}

const Results = () => {
  const { detailedResults, isCompleted, setResults, setSkillGaps } = useAssessmentStore();
  const [loading, setLoading] = useState(true);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[]>([]);
  const [competencyMetrics, setCompetencyMetrics] = useState<CompetencyMetric[]>([]);

  // Exit fullscreen and cleanup camera when entering results page
  useEffect(() => {
    const cleanupSecurity = async () => {
      // Exit fullscreen if still active
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
          toast.success('Assessment completed - Exited secure mode');
        } catch (error) {
          console.log('Fullscreen exit handled');
        }
      }

      // Stop any camera streams
      const streams = await navigator.mediaDevices.enumerateDevices();
      streams.forEach(device => {
        if (device.kind === 'videoinput') {
          // Stop any active video tracks
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              stream.getTracks().forEach(track => track.stop());
            })
            .catch(() => {
              // Camera might not be active, ignore error
            });
        }
      });
    };

    cleanupSecurity();
  }, []);

  useEffect(() => {
    const generateResults = async () => {
      setLoading(true);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock comprehensive skill analysis
      const mockSkillAnalysis: SkillAnalysis[] = [
        {
          skill: 'Problem Solving',
          currentLevel: 75,
          requiredLevel: 90,
          gap: 15,
          category: 'analytical',
          improvement: 'Practice algorithm challenges and case studies'
        },
        {
          skill: 'Logical Thinking',
          currentLevel: 82,
          requiredLevel: 95,
          gap: 13,
          category: 'analytical',
          improvement: 'Work on logical reasoning puzzles and formal logic'
        },
        {
          skill: 'Technical Implementation',
          currentLevel: 88,
          requiredLevel: 92,
          gap: 4,
          category: 'technical',
          improvement: 'Focus on advanced design patterns'
        },
        {
          skill: 'Critical Analysis',
          currentLevel: 70,
          requiredLevel: 88,
          gap: 18,
          category: 'analytical',
          improvement: 'Practice data interpretation and analytical thinking'
        },
        {
          skill: 'Innovation & Creativity',
          currentLevel: 65,
          requiredLevel: 80,
          gap: 15,
          category: 'creative',
          improvement: 'Engage in creative problem-solving exercises'
        },
        {
          skill: 'System Design',
          currentLevel: 78,
          requiredLevel: 90,
          gap: 12,
          category: 'technical',
          improvement: 'Study scalable architecture patterns'
        }
      ];

      const mockCompetencyMetrics: CompetencyMetric[] = [
        {
          name: 'Problem Solving',
          score: 82,
          maxScore: 100,
          level: 'Advanced',
          description: 'Strong analytical and problem-solving capabilities'
        },
        {
          name: 'Logical Thinking',
          score: 78,
          maxScore: 100,
          level: 'Advanced',
          description: 'Good logical reasoning with room for improvement'
        },
        {
          name: 'Technical Skills',
          score: 85,
          maxScore: 100,
          level: 'Advanced',
          description: 'Solid technical foundation with modern practices'
        },
        {
          name: 'Critical Analysis',
          score: 72,
          maxScore: 100,
          level: 'Intermediate',
          description: 'Developing analytical thinking skills'
        },
        {
          name: 'Innovation',
          score: 68,
          maxScore: 100,
          level: 'Intermediate',
          description: 'Growing creative problem-solving abilities'
        }
      ];

      setSkillAnalysis(mockSkillAnalysis);
      setCompetencyMetrics(mockCompetencyMetrics);
      setResults(mockCompetencyMetrics.map(metric => ({
        skillCategory: metric.name,
        score: metric.score,
        maxScore: metric.maxScore,
        competencyLevel: metric.level
      })));
      setSkillGaps(mockSkillAnalysis.filter(skill => skill.gap > 10).map(skill => skill.skill));
      setLoading(false);
    };

    if (isCompleted) {
      generateResults();
    }
  }, [isCompleted, setResults, setSkillGaps]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900">AI is analyzing your results...</h3>
          <p className="text-gray-600">Generating comprehensive skill gap analysis</p>
        </motion.div>
      </div>
    );
  }

  if (!isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assessment Results</h3>
          <p className="text-gray-600 mb-6">Complete an assessment to view your skill gap analysis</p>
          <Link
            to="/assessment"
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  const averageScore = competencyMetrics.reduce((sum, metric) => sum + metric.score, 0) / competencyMetrics.length;
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  const radarData = competencyMetrics.map(metric => ({
    subject: metric.name,
    A: metric.score,
    fullMark: 100
  }));

  const progressData = competencyMetrics.map((metric, index) => ({
    name: metric.name,
    current: metric.score,
    target: 90,
    gap: 90 - metric.score
  }));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10"></div>
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Your AI-Powered Skill Analysis 🎯
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Comprehensive assessment results powered by Hexaware's AI engine
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{Math.round(averageScore)}%</div>
                  <div className="text-sm opacity-90">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{detailedResults?.correctAnswers || 0}/{detailedResults?.totalQuestions || 15}</div>
                  <div className="text-sm opacity-90">Questions Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{skillAnalysis.filter(s => s.gap > 10).length}</div>
                  <div className="text-sm opacity-90">Skill Gaps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{competencyMetrics.filter(m => m.level === 'Advanced' || m.level === 'Expert').length}</div>
                  <div className="text-sm opacity-90">Strong Areas</div>
                </div>
              </div>

              {/* Assessment Summary */}
              {detailedResults && (
                <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Assessment Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{detailedResults.timeSpent || 'N/A'}</div>
                      <div className="text-sm opacity-90">Minutes Taken</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{detailedResults.totalQuestions || 15}</div>
                      <div className="text-sm opacity-90">Total Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{detailedResults.correctAnswers || 0}</div>
                      <div className="text-sm opacity-90">Correct Answers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {detailedResults.totalQuestions ? Math.round(((detailedResults.totalQuestions - detailedResults.correctAnswers) / detailedResults.totalQuestions) * 100) : 0}%
                      </div>
                      <div className="text-sm opacity-90">Error Rate</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Competency Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
              Skill Gap Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#3B82F6" name="Current Level" />
                <Bar dataKey="gap" fill="#EF4444" name="Skill Gap" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-500" />
              Competency Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={competencyMetrics}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="score"
                  label={({ name, score }) => `${name}: ${score}%`}
                >
                  {competencyMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-500" />
            360° Skill Assessment
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Your Skills" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detailed Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Your Strengths
            </h3>
            <div className="space-y-4">
              {skillAnalysis.filter(skill => skill.gap <= 10).map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <h4 className="font-semibold text-green-800">{skill.skill}</h4>
                    <p className="text-sm text-green-600">Strong performance - {skill.currentLevel}%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-700">{skill.currentLevel}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Improvement Areas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-4">
              {skillAnalysis.filter(skill => skill.gap > 10).map((skill, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-orange-800">{skill.skill}</h4>
                    <span className="text-sm font-medium text-orange-600">Gap: {skill.gap}%</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${skill.currentLevel}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-orange-700">{skill.improvement}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Competency Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-500" />
            Detailed Competency Analysis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competencyMetrics.map((metric, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{metric.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.level === 'Expert' ? 'bg-purple-100 text-purple-700' :
                    metric.level === 'Advanced' ? 'bg-blue-100 text-blue-700' :
                    metric.level === 'Intermediate' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {metric.level}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score</span>
                    <span>{metric.score}/{metric.maxScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
            <Zap className="w-6 h-6 mr-2" />
            AI-Recommended Next Steps
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Based on your assessment, our AI recommends personalized courses to bridge your skill gaps
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>View Recommended Courses</span>
            </Link>
            <button
              onClick={() => {
                toast.success('Assessment results downloaded!');
              }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all flex items-center justify-center space-x-2"
            >
              <Award className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;