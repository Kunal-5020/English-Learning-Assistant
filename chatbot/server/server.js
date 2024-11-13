// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/chatRoutes.js';

dotenv.config();  // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());  // For parsing JSON bodies

app.use('/api/chat', router);  // API route for chat

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
