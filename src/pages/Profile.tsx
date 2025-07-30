import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { 
  User, 
  Mail, 
  Settings, 
  Target, 
  BookOpen, 
  Award, 
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Brain,
  TrendingUp
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ProfileForm {
  name: string;
  email: string;
}

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { results, isCompleted } = useAssessmentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>(user?.jobRoles || []);
  const [newSkill, setNewSkill] = useState('');
  const [newJobRole, setNewJobRole] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Data Analysis',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'TypeScript', 'Vue.js', 'Angular'
  ];

  const availableJobRoles = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist',
    'Machine Learning Engineer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer'
  ];

  const onSubmit = (data: ProfileForm) => {
    updateUser({ 
      name: data.name, 
      email: data.email,
      skills: selectedSkills,
      jobRoles: selectedJobRoles
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedSkills(user?.skills || []);
    setSelectedJobRoles(user?.jobRoles || []);
  };

  const addSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const addJobRole = () => {
    if (newJobRole.trim() && !selectedJobRoles.includes(newJobRole.trim())) {
      setSelectedJobRoles([...selectedJobRoles, newJobRole.trim()]);
      setNewJobRole('');
    }
  };

  const removeJobRole = (role: string) => {
    setSelectedJobRoles(selectedJobRoles.filter(r => r !== role));
  };

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Profile Settings ⚙️
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account information and learning preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Basic Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === 'admin' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user?.role === 'admin' ? 'Administrator' : 'Employee'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Management */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Skills
              </h2>
              
              {isEditing && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Suggested skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.filter(skill => !selectedSkills.includes(skill)).slice(0, 5).map(skill => (
                        <button
                          key={skill}
                          onClick={() => setSelectedSkills([...selectedSkills, skill])}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Job Roles Management */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                Target Job Roles
              </h2>
              
              {isEditing && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newJobRole}
                      onChange={(e) => setNewJobRole(e.target.value)}
                      placeholder="Add a job role..."
                      onKeyPress={(e) => e.key === 'Enter' && addJobRole()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addJobRole}
                      className="flex items-center space-x-1 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Popular roles:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableJobRoles.filter(role => !selectedJobRoles.includes(role)).slice(0, 4).map(role => (
                        <button
                          key={role}
                          onClick={() => setSelectedJobRoles([...selectedJobRoles, role])}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200"
                        >
                          + {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {selectedJobRoles.map((role, index) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                  >
                    <span className="text-sm font-medium">{role}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeJobRole(role)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Learning Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Learning Progress
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, #3B82F6 0deg, #3B82F6 ${(averageScore / 100) * 360}deg, #E5E7EB ${(averageScore / 100) * 360}deg, #E5E7EB 360deg)`
                      }}
                    ></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{averageScore}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedSkills.length}</div>
                    <div className="text-xs text-gray-600">Skills</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{selectedJobRoles.length}</div>
                    <div className="text-xs text-gray-600">Job Roles</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-500" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">Retake Assessment</span>
                </button>
                
                <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Browse Courses</span>
                </button>
                
                <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all flex items-center space-x-3">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-700">View Achievements</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            {isCompleted && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Assessment</h3>
                <div className="space-y-2">
                  {results.slice(0, 3).map((result, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{result.skillCategory}</span>
                      <span className="font-medium text-gray-900">
                        {Math.round((result.score / result.maxScore) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;