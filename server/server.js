import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bot from './controllers/botcontroller.js'; 
 
dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Telegraf bot setup
bot.launch();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});