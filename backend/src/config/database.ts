import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // Use environment variable or hardcoded Atlas connection for testing
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://swethapugaz:Pvs%4001092004@hexamentor-cluster.uqrvbvq.mongodb.net/hexamentor?retryWrites=true&w=majority&appName=hexamentor-cluster';
    
    // Skip connection if using dummy database
    if (mongoURI.startsWith('dummy://')) {
      console.log('⚠️  Using dummy database - some features may be limited');
      return;
    }
    
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Continuing with limited functionality...');
    // Don't exit - continue with dummy data instead
  }
};
