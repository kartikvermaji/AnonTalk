import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    // Already connected, skip reconnecting
    return mongoose.connection;
  }

  const dbURI = process.env.MONGO_URI;

  try {
    // Connecting to MongoDB
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }

  return mongoose.connection;
};

export default connectToDatabase;
