import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, ArrowRight, Code, Brain, Users, BarChart, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const JobRoleSelection = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user?.jobRoles || []);

  const jobRoles = [
    {
      title: 'Frontend Developer',
      icon: Code,
      description: 'Build user interfaces and experiences',
      skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
      level: 'Beginner to Advanced'
    },
    {
      title: 'Backend Developer',
      icon: Code,
      description: 'Develop server-side applications and APIs',
      skills: ['Node.js', 'Python', 'Java', 'Databases', 'APIs'],
      level: 'Intermediate to Advanced'
    },
    {
      title: 'Full Stack Developer',
      icon: Zap,
      description: 'Work on both frontend and backend systems',
      skills: ['React', 'Node.js', 'Databases', 'DevOps', 'APIs'],
      level: 'Intermediate to Advanced'
    },
    {
      title: 'Data Scientist',
      icon: BarChart,
      description: 'Analyze data and build predictive models',
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Visualization'],
      level: 'Intermediate to Expert'
    },
    {
      title: 'Machine Learning Engineer',
      icon: Brain,
      description: 'Deploy and scale ML models in production',
      skills: ['Python', 'TensorFlow', 'MLOps', 'Cloud', 'Statistics'],
      level: 'Advanced to Expert'
    },
    {
      title: 'DevOps Engineer',
      icon: Shield,
      description: 'Manage infrastructure and deployment pipelines',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD'],
      level: 'Intermediate to Advanced'
    },
    {
      title: 'Product Manager',
      icon: Users,
      description: 'Drive product strategy and execution',
      skills: ['Strategy', 'Analytics', 'Communication', 'Leadership', 'Agile'],
      level: 'Intermediate to Advanced'
    },
    {
      title: 'UI/UX Designer',
      icon: Brain,
      description: 'Design user experiences and interfaces',
      skills: ['Design', 'Prototyping', 'User Research', 'Figma', 'Psychology'],
      level: 'Beginner to Advanced'
    },
    {
      title: 'Cybersecurity Analyst',
      icon: Shield,
      description: 'Protect systems from security threats',
      skills: ['Security', 'Networking', 'Risk Assessment', 'Compliance', 'Linux'],
      level: 'Intermediate to Expert'
    }
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleContinue = () => {
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one job role');
      return;
    }
    
    updateUser({ jobRoles: selectedRoles });
    toast.success('Job roles updated successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Target Job Roles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the roles you're interested in or currently working towards. We'll create personalized assessments based on your selections.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleRole(role.title)}
              className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                selectedRoles.includes(role.title)
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedRoles.includes(role.title)
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-r from-blue-500 to-teal-500'
                }`}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold ${
                      selectedRoles.includes(role.title) ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {role.title}
                    </h3>
                    {selectedRoles.includes(role.title) && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    selectedRoles.includes(role.title) ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {role.description}
                  </p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedRoles.includes(role.title)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                      {role.skills.length > 3 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedRoles.includes(role.title)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          +{role.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`text-xs font-medium ${
                    selectedRoles.includes(role.title) ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {role.level}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Selected Roles: {selectedRoles.length}
                </h3>
                <p className="text-gray-600">
                  {selectedRoles.length === 0 
                    ? 'No roles selected yet' 
                    : `${selectedRoles.slice(0, 2).join(', ')}${selectedRoles.length > 2 ? ` and ${selectedRoles.length - 2} more` : ''}`
                  }
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                disabled={selectedRoles.length === 0}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobRoleSelection;