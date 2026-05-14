import express from 'express';

const app = express();
const port = 3000;

// Basic middleware to parse JSON
app.use(express.json());

// A simple health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'MeshAI API is live' });
});

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});