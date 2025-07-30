import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { 
  User, 
  Target, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock,
  Play,
  CheckCircle,
  ArrowRight,
  Brain,
  Users,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { results, isCompleted } = useAssessmentStore();

  const stats = [
    {
      label: 'Skills Selected',
      value: user?.skills?.length || 0,
      icon: Target,
      color: 'from-blue-500 to-teal-500'
    },
    {
      label: 'Job Roles',
      value: user?.jobRoles?.length || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Assessments',
      value: isCompleted ? 1 : 0,
      icon: Brain,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Courses',
      value: 12,
      icon: BookOpen,
      color: 'from-green-500 to-teal-500'
    }
  ];

  const recentActivities = [
    {
      type: 'assessment',
      title: 'Completed JavaScript Assessment',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      type: 'course',
      title: 'Started React Advanced Course',
      time: '1 day ago',
      icon: Play,
      color: 'text-blue-500'
    },
    {
      type: 'skill',
      title: 'Added Machine Learning skill',
      time: '3 days ago',
      icon: Target,
      color: 'text-purple-500'
    }
  ];

  const upcomingAssessments = [
    {
      title: 'Python Programming',
      difficulty: 'Intermediate',
      duration: '45 min',
      icon: Brain
    },
    {
      title: 'Data Structures',
      difficulty: 'Advanced',
      duration: '60 min',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10"></div>
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Ready to enhance your skills? Let's continue your learning journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/assessment"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>Take Assessment</span>
                </Link>
                <Link
                  to="/courses"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Browse Courses</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/assessment"
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        Start Assessment
                      </h3>
                      <p className="text-sm text-gray-600">
                        Take adaptive quizzes based on your job roles
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </Link>

                <Link
                  to="/results"
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                        View Results
                      </h3>
                      <p className="text-sm text-gray-600">
                        Analyze your skill gaps and progress
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                  </div>
                </Link>

                <Link
                  to="/courses"
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                        Browse Courses
                      </h3>
                      <p className="text-sm text-gray-600">
                        Explore AI-curated learning paths
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                        Update Profile
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage skills and preferences
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Assessments */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Suggested Assessments</h3>
              <div className="space-y-3">
                {upcomingAssessments.map((assessment, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                      <assessment.icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {assessment.difficulty}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{assessment.duration}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        {isCompleted && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Progress Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {results.slice(0, 3).map((result, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + (result.score / result.maxScore) * 50}% 0%, 50% 50%)`
                      }}
                    ></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round((result.score / result.maxScore) * 100)}%
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{result.skillCategory}</h3>
                  <p className="text-sm text-gray-600">{result.competencyLevel}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                to="/results"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>View detailed analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;