import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import webhookHandler from './api/webhook.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // 30 seconds timeout
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Telegram webhook route
app.post('/api/webhook', webhookHandler);

// Default route
app.get('/', (req, res) => {
  res.json('SERVER RUNNING');
});
    

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


