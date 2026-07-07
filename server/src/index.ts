import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

// 1. Checkpoints & Key Masking (Happens first)
console.info("MONGO_URI:", process.env.MONGO_URI ? "✅ Connected/Defined" : "❌ undefined");
const apiKey = process.env.NEBIUS_API_KEY;
console.info("NEBIUS_API_KEY:", apiKey ? `${apiKey.substring(0, 7)}...` : "❌ undefined");

// 2. Constants & App Setup
const app = express();
const port = Number(process.env.PORT || 3000);

// 3. Global Middleware
app.use(express.json());
app.use(logger);

// 4. Routes
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);

// 6. Database Connection & Server Start (Always at the very bottom)
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.info('MongoDB connected successfully! 🎉');
  })
  .catch((err) => {
  console.error("Database connection failed:", err);
});

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});