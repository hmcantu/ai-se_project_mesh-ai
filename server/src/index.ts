import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import router from './routes/index.js';
import { logger } from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

// 1. Checkpoints & Key Masking (Using Winston logger)
logger.info(`MONGO_URI: ${process.env.MONGO_URI ? "✅ Connected/Defined" : "❌ undefined"}`);
const apiKey = process.env.NEBIUS_API_KEY;
logger.info(`NEBIUS_API_KEY: ${apiKey ? `${apiKey.substring(0, 7)}...` : "❌ undefined"}`);

// 2. Constants & App Setup
const app = express();
app.set('trust proxy', 1);
const port = Number(process.env.PORT || 3000);

// 3. Global Middleware
app.use(express.json());

// Step 2: HTTP Request Logging with Morgan based on NODE_ENV
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// Step 4: Temporary error route for log testing
app.get('/test-error', () => {
  throw new Error('Test error');
});

// 4. Routes
app.use(router);
app.use(notFoundHandler);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.message || 'Internal Error', { stack: err.stack });
  errorHandler(err, req, res);
});

// 5. Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info('MongoDB connected successfully! 🎉');
  })
  .catch((err) => {
    logger.error('Database connection failed:', { stack: err.stack || err });
  });

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
