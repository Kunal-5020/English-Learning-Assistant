// routes/chatRoutes.js
import express from 'express';
import { generateResponse } from '../controllers/chatController.js';

const router = express.Router();

// POST request to generate AI response
router.post('/generate', generateResponse);

export default router;
