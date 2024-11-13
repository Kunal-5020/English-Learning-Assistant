// src/components/api.js
const API_URL = 'http://localhost:5000/api/chat/generate'; 

const api = {
  sendMessage: async (message) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }), // Send the message in the required format
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data; // Return the entire response object
    } catch (error) {
      console.error('Error in API call:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  },
};

export default api;