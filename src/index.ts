import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';


console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Connected/Defined" : "❌ undefined");

// Shows just the first 7 characters of your key (e.g., nsk-a1b...)
const apiKey = process.env.NEBIUS_API_KEY;
console.log("NEBIUS_API_KEY:", apiKey ? `${apiKey.substring(0, 7)}...` : "❌ undefined");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(logger);

app.use(router);

app.get('/test-error', () => {
  throw new Error('Test error');
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});