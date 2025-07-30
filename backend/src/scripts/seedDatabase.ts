import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Assessment } from '../models/Assessment';
import { Course } from '../models/Course';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hexamentor');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data (be careful in production!)
    await User.deleteMany({});
    await Assessment.deleteMany({});
    await Course.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@hexamentor.com',
      password: 'admin123',
      role: 'admin',
      skills: ['Management', 'Leadership'],
      jobRoles: ['Administrator'],
      emailVerified: true
    });

    console.log('👤 Created admin user');

    // Create sample employee users
    const employees = await User.create([
      {
        name: 'John Developer',
        email: 'john@example.com',
        password: 'password123',
        role: 'employee',
        skills: ['JavaScript', 'React', 'Node.js'],
        jobRoles: ['Frontend Developer'],
        emailVerified: true
      },
      {
        name: 'Jane Data Scientist',
        email: 'jane@example.com',
        password: 'password123',
        role: 'employee',
        skills: ['Python', 'Machine Learning', 'Data Science'],
        jobRoles: ['Data Scientist'],
        emailVerified: true
      }
    ]);

    console.log('👥 Created sample employees');

    // Create sample assessments
    const assessments = await Assessment.create([
      {
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics',
        type: 'skill-based',
        targetSkills: ['JavaScript'],
        targetJobRoles: ['Frontend Developer', 'Full-Stack Developer'],
        questions: [
          {
            id: 1,
            question: 'Which of the following is the correct way to declare a variable in modern JavaScript?',
            options: ['var x = 5;', 'let x = 5;', 'variable x = 5;', 'declare x = 5;'],
            correctAnswer: 1,
            explanation: 'let is preferred over var in modern JavaScript due to block scoping.',
            difficulty: 'easy',
            category: 'JavaScript Fundamentals',
            concept: 'Variable Declaration',
            tags: ['javascript', 'variables'],
            timeLimit: 60,
            points: 1
          },
          {
            id: 2,
            question: 'What does the === operator do in JavaScript?',
            options: ['Loose equality', 'Strict equality', 'Assignment', 'Type conversion'],
            correctAnswer: 1,
            explanation: 'The === operator performs strict equality comparison without type coercion.',
            difficulty: 'medium',
            category: 'JavaScript Fundamentals',
            concept: 'Operators',
            tags: ['javascript', 'operators'],
            timeLimit: 60,
            points: 2
          }
        ],
        totalQuestions: 2,
        timeLimit: 30,
        passingScore: 70,
        difficulty: 'medium',
        isActive: true,
        isAIGenerated: false,
        createdBy: adminUser._id
      },
      {
        title: 'React Components Assessment',
        description: 'Evaluate your React component knowledge',
        type: 'skill-based',
        targetSkills: ['React', 'JavaScript'],
        targetJobRoles: ['Frontend Developer'],
        questions: [
          {
            id: 1,
            question: 'What is the primary purpose of React hooks?',
            options: [
              'To add styling to components',
              'To manage state and lifecycle in functional components',
              'To create class components',
              'To handle routing'
            ],
            correctAnswer: 1,
            explanation: 'React hooks allow functional components to use state and other React features.',
            difficulty: 'medium',
            category: 'React',
            concept: 'Hooks',
            tags: ['react', 'hooks'],
            timeLimit: 90,
            points: 2
          }
        ],
        totalQuestions: 1,
        timeLimit: 15,
        passingScore: 70,
        difficulty: 'medium',
        isActive: true,
        isAIGenerated: false,
        createdBy: adminUser._id
      }
    ]);

    console.log('📝 Created sample assessments');

    // Create sample courses
    const courses = await Course.create([
      {
        title: 'Complete JavaScript Mastery',
        description: 'Learn JavaScript from beginner to advanced level with hands-on projects and real-world examples.',
        shortDescription: 'Master JavaScript programming with comprehensive hands-on training.',
        thumbnail: 'https://via.placeholder.com/400x300/007acc/ffffff?text=JavaScript+Course',
        category: 'Programming',
        subcategory: 'Frontend Development',
        level: 'Intermediate',
        duration: 1200, // 20 hours
        instructor: {
          name: 'Sarah Johnson',
          avatar: 'https://via.placeholder.com/150/007acc/ffffff?text=SJ',
          bio: 'Senior JavaScript developer with 8+ years of experience in web development.',
          expertise: ['JavaScript', 'React', 'Node.js', 'Web Development']
        },
        modules: [
          {
            id: 'module-1',
            title: 'JavaScript Fundamentals',
            description: 'Learn the basics of JavaScript programming',
            type: 'video',
            content: 'https://example.com/video/js-fundamentals',
            duration: 120,
            order: 1,
            isRequired: true,
            prerequisites: [],
            resources: [
              {
                type: 'document',
                title: 'JavaScript Cheat Sheet',
                url: 'https://example.com/js-cheat-sheet.pdf'
              }
            ]
          },
          {
            id: 'module-2',
            title: 'DOM Manipulation',
            description: 'Learn how to interact with the DOM using JavaScript',
            type: 'interactive',
            content: 'https://example.com/interactive/dom-manipulation',
            duration: 90,
            order: 2,
            isRequired: true,
            prerequisites: ['module-1'],
            resources: []
          }
        ],
        skills: ['JavaScript', 'DOM Manipulation', 'ES6+'],
        prerequisites: ['Basic HTML', 'Basic CSS'],
        learningObjectives: [
          'Understand JavaScript fundamentals',
          'Master DOM manipulation techniques',
          'Build interactive web applications',
          'Apply modern JavaScript features'
        ],
        targetAudience: ['Web Developers', 'Frontend Developers', 'Beginners'],
        price: {
          amount: 99.99,
          currency: 'USD'
        },
        rating: {
          average: 4.5,
          count: 128,
          distribution: { 5: 64, 4: 32, 3: 16, 2: 8, 1: 8 }
        },
        enrollment: {
          count: 345,
          isOpen: true
        },
        tags: ['javascript', 'web-development', 'frontend', 'programming'],
        language: 'English',
        subtitles: ['English', 'Spanish'],
        certificate: {
          available: true,
          template: 'standard',
          criteria: {
            minimumScore: 80,
            completionRate: 90
          }
        },
        isPublished: true,
        isAIGenerated: false,
        createdBy: adminUser._id,
        seo: {
          slug: 'complete-javascript-mastery',
          metaTitle: 'Complete JavaScript Mastery - Learn JavaScript Programming',
          metaDescription: 'Master JavaScript programming from basics to advanced concepts with hands-on projects.',
          keywords: ['javascript', 'programming', 'web development', 'frontend']
        }
      },
      {
        title: 'Python for Data Science',
        description: 'Complete guide to using Python for data science and machine learning.',
        shortDescription: 'Learn Python programming for data science applications.',
        thumbnail: 'https://via.placeholder.com/400x300/3776ab/ffffff?text=Python+Course',
        category: 'Data Science',
        subcategory: 'Machine Learning',
        level: 'Beginner',
        duration: 900, // 15 hours
        instructor: {
          name: 'Dr. Michael Chen',
          avatar: 'https://via.placeholder.com/150/3776ab/ffffff?text=MC',
          bio: 'Data Science PhD with 10+ years of experience in machine learning and analytics.',
          expertise: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics']
        },
        modules: [
          {
            id: 'module-1',
            title: 'Python Basics for Data Science',
            description: 'Introduction to Python programming for data science',
            type: 'video',
            content: 'https://example.com/video/python-basics',
            duration: 150,
            order: 1,
            isRequired: true,
            prerequisites: [],
            resources: []
          }
        ],
        skills: ['Python', 'Data Analysis', 'Machine Learning', 'Statistics'],
        prerequisites: ['Basic Mathematics'],
        learningObjectives: [
          'Learn Python programming fundamentals',
          'Master data manipulation with Pandas',
          'Understand machine learning concepts',
          'Build data science projects'
        ],
        targetAudience: ['Data Scientists', 'Analysts', 'Python Beginners'],
        price: {
          amount: 79.99,
          currency: 'USD'
        },
        rating: {
          average: 4.7,
          count: 89,
          distribution: { 5: 56, 4: 22, 3: 7, 2: 2, 1: 2 }
        },
        enrollment: {
          count: 234,
          isOpen: true
        },
        tags: ['python', 'data-science', 'machine-learning', 'analytics'],
        language: 'English',
        subtitles: ['English'],
        certificate: {
          available: true,
          template: 'data-science',
          criteria: {
            minimumScore: 75,
            completionRate: 85
          }
        },
        isPublished: true,
        isAIGenerated: false,
        createdBy: adminUser._id,
        seo: {
          slug: 'python-for-data-science',
          metaTitle: 'Python for Data Science - Complete Beginner Course',
          metaDescription: 'Learn Python programming for data science and machine learning applications.',
          keywords: ['python', 'data science', 'machine learning', 'analytics']
        }
      }
    ]);

    console.log('📚 Created sample courses');
    console.log('✅ Database seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Admin: admin@hexamentor.com / admin123');
    console.log('Employee: john@example.com / password123');
    console.log('Employee: jane@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeding script
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
