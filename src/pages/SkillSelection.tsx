import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, ArrowRight, Code, Database, Globe, Brain, Shield, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

const SkillSelection = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);

  const skillCategories = [
    {
      category: 'Technical Skills',
      icon: Code,
      skills: [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
        'TypeScript', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
      ]
    },
    {
      category: 'Data Science',
      icon: BarChart,
      skills: [
        'Machine Learning', 'Data Analysis', 'SQL', 'R', 'Pandas', 'NumPy',
        'TensorFlow', 'PyTorch', 'Tableau', 'Power BI', 'Statistics'
      ]
    },
    {
      category: 'Database',
      icon: Database,
      skills: [
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite',
        'DynamoDB', 'Cassandra', 'Neo4j'
      ]
    },
    {
      category: 'Cloud & DevOps',
      icon: Globe,
      skills: [
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
        'GitLab CI', 'Terraform', 'Ansible', 'Linux'
      ]
    },
    {
      category: 'AI & ML',
      icon: Brain,
      skills: [
        'Deep Learning', 'Natural Language Processing', 'Computer Vision',
        'Reinforcement Learning', 'MLOps', 'Model Deployment'
      ]
    },
    {
      category: 'Security',
      icon: Shield,
      skills: [
        'Cybersecurity', 'Penetration Testing', 'Network Security',
        'Application Security', 'Compliance', 'Risk Assessment'
      ]
    }
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleContinue = () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }
    
    updateUser({ skills: selectedSkills });
    toast.success('Skills updated successfully!');
    navigate('/job-roles');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the skills you currently have or want to improve. This helps us create personalized assessments and learning paths.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {category.skills.map((skill) => (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill)}
                    className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                      selectedSkills.includes(skill)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    {selectedSkills.includes(skill) && (
                      <CheckCircle className="w-4 h-4 text-blue-500 absolute top-2 right-2" />
                    )}
                  </motion.button>
                ))}
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
                  Selected Skills: {selectedSkills.length}
                </h3>
                <p className="text-gray-600">
                  {selectedSkills.length === 0 
                    ? 'No skills selected yet' 
                    : `${selectedSkills.slice(0, 3).join(', ')}${selectedSkills.length > 3 ? ` and ${selectedSkills.length - 3} more` : ''}`
                  }
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                disabled={selectedSkills.length === 0}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillSelection;