import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error.js';

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
app.use(router);

app.get('/test-error', () => {
  throw new Error('Test error');
});

// 5. Error Handlers (Must be after routes, but before server start)
// 🎯 Removed app.use(notFoundHandler) to clean up the missing reference error
app.use(errorHandler);

// 6. Database Connection & Server Start (Always at the very bottom)
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.info('MongoDB connected successfully! 🎉');
    app.listen(port, () => {
      console.info(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error ❌', err);
  });