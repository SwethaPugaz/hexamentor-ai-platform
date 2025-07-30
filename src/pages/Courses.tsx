import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Filter,
  Search,
  Target,
  Brain,
  Award,
  Users,
  TrendingUp,
  Zap,
  Code,
  Database,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  category: string;
  skills: string[];
  instructor: string;
  thumbnail: string;
  isRecommended: boolean;
  progress?: number;
  isEnrolled?: boolean;
  aiGenerated: boolean;
  skillGapsFilled: string[];
}

const Courses = () => {
  const { user } = useAuthStore();
  const { skillGaps } = useAssessmentStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(true);

  useEffect(() => {
    const generateCourses = async () => {
      setLoading(true);
      
      // Simulate AI course generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Advanced Problem Solving Techniques',
          description: 'Master algorithmic thinking and complex problem-solving strategies using AI-powered methodologies.',
          duration: '8 weeks',
          difficulty: 'Advanced',
          rating: 4.8,
          students: 1247,
          category: 'Problem Solving',
          skills: ['Algorithm Design', 'Logical Thinking', 'Pattern Recognition'],
          instructor: 'Dr. Sarah Chen',
          thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
          isRecommended: skillGaps.includes('Problem Solving'),
          aiGenerated: true,
          skillGapsFilled: ['Problem Solving', 'Logical Thinking']
        },
        {
          id: '2',
          title: 'Critical Analysis & Data Interpretation',
          description: 'Develop advanced analytical skills for data-driven decision making and strategic thinking.',
          duration: '6 weeks',
          difficulty: 'Intermediate',
          rating: 4.7,
          students: 892,
          category: 'Analytics',
          skills: ['Data Analysis', 'Critical Thinking', 'Statistical Reasoning'],
          instructor: 'Prof. Michael Rodriguez',
          thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
          isRecommended: skillGaps.includes('Critical Analysis'),
          aiGenerated: true,
          skillGapsFilled: ['Critical Analysis']
        },
        {
          id: '3',
          title: 'Innovation & Creative Problem Solving',
          description: 'Unlock your creative potential with structured innovation methodologies and design thinking.',
          duration: '5 weeks',
          difficulty: 'Intermediate',
          rating: 4.6,
          students: 634,
          category: 'Innovation',
          skills: ['Design Thinking', 'Creativity', 'Innovation Methods'],
          instructor: 'Emma Thompson',
          thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
          isRecommended: skillGaps.includes('Innovation & Creativity'),
          aiGenerated: true,
          skillGapsFilled: ['Innovation & Creativity']
        },
        {
          id: '4',
          title: 'System Architecture & Design Patterns',
          description: 'Master scalable system design and advanced architectural patterns for enterprise applications.',
          duration: '10 weeks',
          difficulty: 'Advanced',
          rating: 4.9,
          students: 1567,
          category: 'System Design',
          skills: ['Architecture', 'Design Patterns', 'Scalability'],
          instructor: 'David Kim',
          thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
          isRecommended: skillGaps.includes('System Design'),
          aiGenerated: true,
          skillGapsFilled: ['System Design']
        },
        {
          id: '5',
          title: 'Advanced JavaScript & React Patterns',
          description: 'Deep dive into modern JavaScript and React with advanced patterns and performance optimization.',
          duration: '7 weeks',
          difficulty: 'Advanced',
          rating: 4.8,
          students: 2143,
          category: 'Frontend Development',
          skills: ['JavaScript', 'React', 'Performance Optimization'],
          instructor: 'Lisa Wang',
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
          isRecommended: user?.skills?.includes('JavaScript'),
          aiGenerated: false,
          skillGapsFilled: []
        },
        {
          id: '6',
          title: 'Machine Learning Fundamentals',
          description: 'Learn the foundations of machine learning with hands-on projects and real-world applications.',
          duration: '12 weeks',
          difficulty: 'Intermediate',
          rating: 4.7,
          students: 3421,
          category: 'Machine Learning',
          skills: ['Python', 'ML Algorithms', 'Data Science'],
          instructor: 'Dr. Alex Johnson',
          thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
          isRecommended: user?.jobRoles?.includes('Data Scientist'),
          aiGenerated: false,
          skillGapsFilled: []
        }
      ];
      
      setCourses(mockCourses);
      setLoading(false);
    };

    generateCourses();
  }, [skillGaps, user?.skills, user?.jobRoles]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    const matchesRecommended = !showRecommendedOnly || course.isRecommended;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesRecommended;
  });

  const categories = ['all', ...Array.from(new Set(courses.map(course => course.category)))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const handleEnroll = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, progress: 0 }
        : course
    ));
    toast.success('Successfully enrolled in course!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900">AI is generating personalized courses...</h3>
          <p className="text-gray-600">Creating learning paths based on your skill gaps</p>
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
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Curated Learning Paths 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized courses designed by AI to bridge your specific skill gaps and accelerate your career growth
          </p>
        </motion.div>

        {/* AI Recommendations Banner */}
        {skillGaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl font-bold">AI-Powered Recommendations</h2>
            </div>
            <p className="mb-4">
              Based on your assessment, we've identified {skillGaps.length} key areas for improvement:
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, index) => (
                <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {gap}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border mb-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRecommendedOnly}
                onChange={(e) => setShowRecommendedOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Recommended Only</span>
            </label>
          </div>
        </motion.div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all ${
                  course.isRecommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {/* Course Thumbnail */}
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.isRecommended && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Target className="w-3 h-3" />
                      <span>Recommended</span>
                    </div>
                  )}
                  {course.aiGenerated && (
                    <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>AI Generated</span>
                    </div>
                  )}
                  {course.isEnrolled && (
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Enrolled</span>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600">{course.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{course.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Skill Gaps Addressed */}
                  {course.skillGapsFilled.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-green-700 mb-1">Addresses your skill gaps:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.skillGapsFilled.map((gap, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Instructor:</span> {course.instructor}
                  </div>

                  {/* Progress Bar (if enrolled) */}
                  {course.isEnrolled && course.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEnroll(course.id)}
                    disabled={course.isEnrolled}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                      course.isEnrolled 
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : course.isRecommended
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {course.isEnrolled ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Continue Learning</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Enroll Now</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Need More Personalized Courses?</h2>
          <p className="text-lg opacity-90 mb-6">
            Our AI can generate custom learning paths based on your specific goals and skill gaps
          </p>
          <button
            onClick={() => toast.success('AI is analyzing your needs for custom courses!')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 mx-auto"
          >
            <Brain className="w-5 h-5" />
            <span>Generate Custom Course</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;