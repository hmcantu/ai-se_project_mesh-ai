import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});