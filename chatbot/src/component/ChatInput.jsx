import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";
import "./css/ChatInput.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [history, setHistory] = useState([]);  // Store conversation history
  let [UserResponse, loadResponse] = useState(""); // Store the user response given by API
  const [conversationStarted, setConversationStarted] = useState(false); // Track if conversation is started
  
  // Start listening when mic button is clicked
  const startListening = () => {
    resetTranscript(); // Clear previous transcript
    SpeechRecognition.startListening({ continuous: true, language: 'en' });
  };

  useEffect(() => {
    console.log('UserResponse Updated:', UserResponse);
  }, [UserResponse]);
  

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  // Handle starting the conversation
  const handleStartConversation = async () => {
    const startMessage = "Start the conversation"; // Message to start the conversation
    const userMessage = { text: startMessage, sender: "user" };
    setHistory((prevHistory) => [...prevHistory, userMessage]);
    onSendMessage(userMessage);
  
    try {
      const response = await axios.post("http://localhost:5000/api/chat/generate", {
        messagePayload: {
          history: [userMessage],
          current_message: { sender: "user", text: startMessage }
        }
      });
  
      const Response = response.data.response;
      const botResponse = Response.BotResponse;
      const userResponse = Response.UserResponse;
  
      const botMessage = { text: botResponse, sender: "bot" };
      setHistory((prevHistory) => [...prevHistory, botMessage]);
      onSendMessage(botMessage);
  
      console.log("User Response:", userResponse); // Log the userResponse received from the API
  
      loadResponse(userResponse);   // Reset response if necessary // Update UserResponse with the value from the API
      setConversationStarted(true); // Conversation has now started
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };



  // Handle sending user input
  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setHistory((prevHistory) => [...prevHistory, userMessage]);
      onSendMessage({ text: input, sender: "user" });
      setInput(""); // Clear the input after message is sent

      // Check if user response matches predefined response
      if (input.trim() === UserResponse.trim()) {
  // If user response matches, send it to the API
  try {
    const messagePayload = {
      history: history.concat(userMessage),
      current_message: { sender: "user", text: input }
    };

    const requestPayload = { messagePayload: messagePayload };
    const response = await axios.post("http://localhost:5000/api/chat/generate", requestPayload);

    const Response = response.data.response;
    const botResponse = Response.BotResponse;
    const userResponse = Response.UserResponse;

    const botMessage = { text: botResponse, sender: "bot" };
    setHistory((prevHistory) => [...prevHistory, botMessage]);
    onSendMessage(botMessage);
    console.log(UserResponse);
    loadResponse(userResponse);  // Ensure the new UserResponse is correctly set here  // Reset response if necessary

  } catch (error) {
    console.error("Error sending message:", error);
  }
} else {
  alert("Your response doesn't match the expected reply. Please try again.");
}


      SpeechRecognition.stopListening(); // Stop listening after sending the message
    }
  };

  // Handle key press to send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (

      <div className="chat-input">
        {/* Display UserResponse above the input field */}
        {conversationStarted && UserResponse && (
          <div className="user-response-display">
            <strong>Expected User Response: </strong>{UserResponse}
          </div>
        )}

        {/* Show 'start the conversation' button if conversation hasn't started */}
        {!conversationStarted ? (
          <button className="start-button" onClick={handleStartConversation}>
            Start the conversation
          </button>
        ) : (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}  // Handle Enter key for sending
              placeholder="Type your response here"
              className="input-field"
            />
          </>
        )}

        {/* Wrapper for buttons (mic and send) */}
        <div className="buttons-container">
          <button
            className="mic-button"
            onMouseUp={SpeechRecognition.stopListening}
            onMouseDown={startListening}
          >
            <FaMicrophone />
          </button>
          <button onClick={handleSend} className="send-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V17M12 7L16 11M12 7L8 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#2f2f2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
  );
};

export default ChatInput;
