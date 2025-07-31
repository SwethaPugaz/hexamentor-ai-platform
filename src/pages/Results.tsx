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



const Results = () => {
  const { detailedResults, isCompleted } = useAssessmentStore();
  const [loading, setLoading] = useState(true);
  // Dynamic state for difficulty breakdown
  const [difficultyStats, setDifficultyStats] = useState<{ [key: string]: { total: number; correct: number; topics: string[] } }>({});
  // Dynamic state for strengths and weaknesses
  const [strengths, setStrengths] = useState<{ category: string; score: number }[]>([]);
  const [weaknesses, setWeaknesses] = useState<{ category: string; score: number; topics: string[] }[]>([]);

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

      // Stop the assessment camera stream if present
      if ((window as any).__assessmentCameraStream) {
        try {
          (window as any).__assessmentCameraStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
          (window as any).__assessmentCameraStream = null;
          toast.success('Camera turned off after assessment');
        } catch {}
      }
    };
    cleanupSecurity();
  }, []);

  useEffect(() => {
    if (!isCompleted || !detailedResults) return;
    setLoading(true);

    // Use difficultyStats from detailedResults if available, else fallback to old logic
    if (detailedResults.difficultyStats) {
      setDifficultyStats(detailedResults.difficultyStats);
    } else {
      // Fallback: Compute from questions if not present (legacy)
      const diffStats: { [key: string]: { total: number; correct: number; topics: string[] } } = {};
      if (detailedResults.questions) {
        detailedResults.questions.forEach((q: any) => {
          const diff = q.difficulty || 'medium';
          if (!diffStats[diff]) diffStats[diff] = { total: 0, correct: 0, topics: [] };
          diffStats[diff].total++;
          if (q.userAnswer !== undefined && parseInt(q.userAnswer) === q.correctAnswer) {
            diffStats[diff].correct++;
          } else if (q.userAnswer !== undefined && parseInt(q.userAnswer) !== q.correctAnswer) {
            diffStats[diff].topics.push(q.concept || '');
          }
        });
      }
      setDifficultyStats(diffStats);
    }

    // Compute strengths and weaknesses from categoryScores
    const strengthsArr: { category: string; score: number }[] = [];
    const weaknessesArr: { category: string; score: number; topics: string[] }[] = [];
    if (detailedResults.categoryScores) {
      detailedResults.categoryScores.forEach((cat: any) => {
        if (cat.score >= 70) {
          strengthsArr.push({ category: cat.category, score: cat.score });
        } else {
          // Find topics for this category from skillGaps
          const gap = detailedResults.skillGaps?.find((g: any) => g.skill === cat.category);
          weaknessesArr.push({ category: cat.category, score: cat.score, topics: gap?.topics || [] });
        }
      });
    }
    setStrengths(strengthsArr);
    setWeaknesses(weaknessesArr);
    setLoading(false);
  }, [isCompleted, detailedResults]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900">Analyzing your real assessment results...</h3>
          <p className="text-gray-600">Generating dynamic skill gap and difficulty analysis</p>
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

  const averageScore = detailedResults?.score || 0;
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Radar and bar chart data from real results
  const radarData = detailedResults?.categoryScores?.map((cat: any) => ({
    subject: cat.category,
    A: cat.score,
    fullMark: 100
  })) || [];

  const progressData = detailedResults?.categoryScores?.map((cat: any) => ({
    name: cat.category,
    current: cat.score,
    target: 90,
    gap: 90 - cat.score
  })) || [];

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
                <div className="text-3xl font-bold">{weaknesses.length}</div>
                <div className="text-sm opacity-90">Skill Gaps</div>
                </div>
                <div className="text-center">
                <div className="text-3xl font-bold">{strengths.length}</div>
                <div className="text-sm opacity-90">Strong Areas</div>
                </div>
              </div>
        {/* Competency Analysis (Dynamic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-500" />
            Competency Analysis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(detailedResults?.categoryScores || []).map((cat, idx) => {
              let level = 'Beginner';
              if (cat.score >= 85) level = 'Expert';
              else if (cat.score >= 70) level = 'Advanced';
              else if (cat.score >= 50) level = 'Intermediate';
              return (
                <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{cat.category}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      level === 'Expert' ? 'bg-purple-100 text-purple-700' :
                      level === 'Advanced' ? 'bg-blue-100 text-blue-700' :
                      level === 'Intermediate' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {level}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span>{cat.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {level === 'Expert' && 'Outstanding mastery in this area.'}
                    {level === 'Advanced' && 'Strong performance, keep it up!'}
                    {level === 'Intermediate' && 'Good foundation, but more practice recommended.'}
                    {level === 'Beginner' && 'Needs significant improvement.'}
                  </p>
                </div>
              );
            })}
            {(detailedResults?.categoryScores?.length === 0 || !detailedResults?.categoryScores) && (
              <div className="text-gray-500 col-span-full">No competency data available.</div>
            )}
          </div>
        </motion.div>

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
                  data={detailedResults?.categoryScores?.map((cat: any) => ({ name: cat.category, score: cat.score })) || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="score"
                  label={({ name, score }) => `${name}: ${score}%`}
                >
                  {(detailedResults?.categoryScores || []).map((entry: any, index: number) => (
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

        {/* Detailed Analysis - Dynamic Strengths and Weaknesses */}
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
              {strengths.length === 0 && <div className="text-gray-500">No strong areas detected.</div>}
              {strengths.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <h4 className="font-semibold text-green-800">{s.category}</h4>
                    <p className="text-sm text-green-600">Score: {s.score}%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-700">{s.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weaknesses/Skill Gaps */}
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
              {weaknesses.length === 0 && <div className="text-gray-500">No major skill gaps detected.</div>}
              {weaknesses.map((w, idx) => (
                <div key={idx} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-orange-800">{w.category}</h4>
                    <span className="text-sm font-medium text-orange-600">Score: {w.score}%</span>
                  </div>
                  {w.topics && w.topics.length > 0 && (
                    <div className="text-xs text-orange-700 mb-1">Topics to review: {w.topics.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
            Performance by Difficulty Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['easy','medium','hard'].map(level => (
              <div key={level} className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold capitalize mb-2">{level}</h4>
                <div>Correct: {difficultyStats[level]?.correct || 0} / {difficultyStats[level]?.total || 0}</div>
                {difficultyStats[level]?.topics?.length > 0 && (
                  <div className="text-xs text-red-600 mt-1">Topics missed: {difficultyStats[level].topics.join(', ')}</div>
                )}
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
            Based on your assessment, here are personalized courses to bridge your specific skill gaps:
          </p>
          <div className="flex flex-col gap-4 items-center">
            {/* Show recommended courses for each skill gap */}
            {detailedResults?.skillGaps && detailedResults.skillGaps.length > 0 ? (
              detailedResults.skillGaps.map((gap, idx) => (
                <div key={gap.skill} className="bg-white text-purple-700 rounded-lg shadow p-4 w-full max-w-xl flex flex-col sm:flex-row items-center justify-between border border-purple-200 mb-2">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                    <div>
                      <div className="font-bold text-lg">{gap.skill}</div>
                      {gap.topics && gap.topics.length > 0 && (
                        <div className="text-xs text-purple-400">Topics: {gap.topics.join(', ')}</div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/courses?skill=${encodeURIComponent(gap.skill)}`}
                    className="mt-2 sm:mt-0 bg-purple-100 text-purple-700 px-4 py-2 rounded font-semibold hover:bg-purple-200 transition-all flex items-center space-x-2"
                  >
                    <span>View Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-white opacity-80">No major skill gaps detected. Explore more courses to upskill!</div>
            )}
            <button
              onClick={() => {
                toast.success('Assessment results downloaded!');
              }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all flex items-center justify-center space-x-2 mt-4"
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