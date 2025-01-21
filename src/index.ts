import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';

dotenv.config();

const app = express();

// Enable CORS with specific configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from your front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
}));

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Express + TypeScript Server is running!');
});

// Route for tasks
app.use('/tasks', tasksRouter);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
