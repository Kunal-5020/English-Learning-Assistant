// controllers/chatController.js
import { GoogleGenerativeAI } from '@google/generative-ai'; // Using import instead of require
import dotenv from 'dotenv'; // Import dotenv to load environment variables

import { generatePromptWithHistory } from './prompt.js';

dotenv.config(); // Load environment variables from the .env file

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to generate AI response
export const generateResponse = async (req, res) => {
  const { messagePayload } = req.body; // Extract the prompt from the request body

  if (!messagePayload) {
    return res.status(400).json({ error: 'No prompt Given' }); // Return an error if the prompt is not provided
  }

  const prompt = generatePromptWithHistory(messagePayload);

  try {
    const result = await model.generateContent(prompt); // Generate content using the model
    const cleanedResponse = result.response.text().replace(/```json\n|\n```/g, "");
    const parsedResponse = JSON.parse(cleanedResponse);
    return res.json({ response : parsedResponse}); // Send the response back as JSON
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: 'Failed to generate content' }); // Handle errors
  }
};
