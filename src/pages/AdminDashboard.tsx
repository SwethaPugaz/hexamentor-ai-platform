import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Award,
  Target,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  assessmentsTaken: number;
  coursesCompleted: number;
  skillGaps: string[];
  lastActive: string;
  status: 'active' | 'inactive';
}

interface AIGeneratedCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  skillsAddressed: string[];
  generatedFor: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  alignment: number; // Alignment with Hexaware objectives (0-100)
}

interface AssessmentAnalytics {
  totalAssessments: number;
  averageScore: number;
  completionRate: number;
  topSkillGaps: string[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [aiCourses, setAiCourses] = useState<AIGeneratedCourse[]>([]);
  const [analytics, setAnalytics] = useState<AssessmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@hexaware.com',
          role: 'employee',
          assessmentsTaken: 3,
          coursesCompleted: 5,
          skillGaps: ['Problem Solving', 'System Design'],
          lastActive: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'Sarah Wilson',
          email: 'sarah@hexaware.com',
          role: 'employee',
          assessmentsTaken: 2,
          coursesCompleted: 8,
          skillGaps: ['Machine Learning', 'Data Analysis'],
          lastActive: '2024-01-14',
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@hexaware.com',
          role: 'employee',
          assessmentsTaken: 1,
          coursesCompleted: 2,
          skillGaps: ['Frontend Development', 'React'],
          lastActive: '2024-01-10',
          status: 'inactive'
        }
      ];

      const mockAICourses: AIGeneratedCourse[] = [
        {
          id: '1',
          title: 'Advanced Problem Solving for Enterprise Solutions',
          description: 'AI-generated course focusing on complex problem-solving methodologies specific to enterprise software development.',
          category: 'Problem Solving',
          difficulty: 'Advanced',
          estimatedDuration: '8 weeks',
          skillsAddressed: ['Algorithmic Thinking', 'System Analysis', 'Complex Problem Decomposition'],
          generatedFor: 'john@hexaware.com',
          status: 'pending',
          createdAt: '2024-01-15',
          alignment: 92
        },
        {
          id: '2',
          title: 'Hexaware Digital Transformation Strategies',
          description: 'Custom course on digital transformation aligned with Hexaware\'s strategic objectives and methodologies.',
          category: 'Strategy',
          difficulty: 'Intermediate',
          estimatedDuration: '6 weeks',
          skillsAddressed: ['Digital Strategy', 'Change Management', 'Innovation Leadership'],
          generatedFor: 'sarah@hexaware.com',
          status: 'approved',
          createdAt: '2024-01-14',
          alignment: 98
        },
        {
          id: '3',
          title: 'React Best Practices for Hexaware Projects',
          description: 'AI-curated React course incorporating Hexaware\'s coding standards and project requirements.',
          category: 'Frontend Development',
          difficulty: 'Intermediate',
          estimatedDuration: '4 weeks',
          skillsAddressed: ['React Patterns', 'Component Architecture', 'State Management'],
          generatedFor: 'mike@hexaware.com',
          status: 'pending',
          alignment: 85
        }
      ];

      const mockAnalytics: AssessmentAnalytics = {
        totalAssessments: 156,
        averageScore: 78.5,
        completionRate: 89.2,
        topSkillGaps: ['Problem Solving', 'System Design', 'Machine Learning', 'Critical Analysis', 'Innovation']
      };

      setUsers(mockUsers);
      setAiCourses(mockAICourses);
      setAnalytics(mockAnalytics);
      setLoading(false);
    };

    loadAdminData();
  }, []);

  const handleCourseAction = (courseId: string, action: 'approve' | 'reject') => {
    setAiCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, status: action === 'approve' ? 'approved' : 'rejected' }
        : course
    ));
    toast.success(`Course ${action}d successfully!`);
  };

  const filteredCourses = aiCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const chartData = [
    { month: 'Jan', assessments: 45, courses: 23 },
    { month: 'Feb', assessments: 52, courses: 31 },
    { month: 'Mar', assessments: 48, courses: 28 },
    { month: 'Apr', assessments: 61, courses: 35 },
    { month: 'May', assessments: 55, courses: 32 },
    { month: 'Jun', assessments: 67, courses: 41 }
  ];

  const skillGapData = analytics?.topSkillGaps.map((skill, index) => ({
    name: skill,
    value: Math.round(Math.random() * 50 + 20),
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900">Loading admin dashboard...</h3>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg opacity-90">Monitor and manage HexaMentor's AI-powered learning ecosystem</p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border">
          <div className="flex space-x-1 p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'courses', label: 'AI Courses', icon: Brain },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-teal-500' },
                  { label: 'AI Courses', value: aiCourses.length, icon: Brain, color: 'from-purple-500 to-pink-500' },
                  { label: 'Pending Reviews', value: aiCourses.filter(c => c.status === 'pending').length, icon: AlertTriangle, color: 'from-orange-500 to-red-500' },
                  { label: 'Avg Score', value: `${analytics?.averageScore}%`, icon: Award, color: 'from-green-500 to-teal-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="assessments" stroke="#3B82F6" strokeWidth={3} />
                      <Line type="monotone" dataKey="courses" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Top Skill Gaps</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={skillGapData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {skillGapData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">AI-Generated Courses</h2>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Courses List */}
              <div className="space-y-4">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            course.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            course.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {course.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Category:</span>
                            <p className="text-gray-900">{course.category}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                            <p className="text-gray-900">{course.difficulty}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Duration:</span>
                            <p className="text-gray-900">{course.estimatedDuration}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-700">Skills Addressed:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {course.skillsAddressed.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Generated for:</span>
                            <p className="text-gray-900">{course.generatedFor}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">Hexaware Alignment:</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    course.alignment >= 90 ? 'bg-green-500' :
                                    course.alignment >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${course.alignment}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{course.alignment}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {course.status === 'pending' && (
                        <div className="flex items-center space-x-2 ml-6">
                          <button
                            onClick={() => handleCourseAction(course.id, 'approve')}
                            className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleCourseAction(course.id, 'reject')}
                            className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg border"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Assessments</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Courses</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Skill Gaps</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Active</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900">{user.assessmentsTaken}</td>
                          <td className="py-4 px-4 text-gray-900">{user.coursesCompleted}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {user.skillGaps.slice(0, 2).map((gap, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                  {gap}
                                </span>
                              ))}
                              {user.skillGaps.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  +{user.skillGaps.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900">{user.lastActive}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Analytics</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Assessments', value: analytics?.totalAssessments, icon: Brain },
                    { label: 'Average Score', value: `${analytics?.averageScore}%`, icon: Award },
                    { label: 'Completion Rate', value: `${analytics?.completionRate}%`, icon: CheckCircle },
                    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: Users }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="assessments" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;