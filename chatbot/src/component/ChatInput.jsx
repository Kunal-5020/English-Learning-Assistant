import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";
import "./css/ChatInput.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [history, setHistory] = useState([]);
  const [UserResponse, loadResponse] = useState("");
  const [conversationStarted, setConversationStarted] = useState(false);

  // Start listening for speech
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en" });
  };

  // Stop listening for speech
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  // Handle starting the conversation
  const handleStartConversation = async () => {
    const startMessage = "Start the conversation";
    const userMessage = { text: startMessage, sender: "user" };
    setHistory((prevHistory) => [...prevHistory, userMessage]);
    onSendMessage(userMessage);

    try {
      const response = await axios.post("http://localhost:5000/api/chat/generate", {
        messagePayload: {
          history: [userMessage],
          current_message: { sender: "user", text: startMessage },
        },
      });

      const Response = response.data.response;
      const botResponse = Response.BotResponse;
      const userResponse = Response.UserResponse;

      setHistory((prevHistory) => [...prevHistory, { text: botResponse, sender: "bot" }]);
      onSendMessage({ text: botResponse, sender: "bot" });
      loadResponse(userResponse);
      setConversationStarted(true);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Handle sending user input
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setHistory((prevHistory) => [...prevHistory, userMessage]);
    onSendMessage(userMessage);
    setInput("");

    try {
      const messagePayload = {
        history: history.concat(userMessage),
        current_message: { sender: "user", text: input },
      };

      const response = await axios.post("http://localhost:5000/api/chat/generate", {
        messagePayload,
      });

      const Response = response.data.response;
      const botResponse = Response.BotResponse;
      const userResponse = Response.UserResponse;

      setHistory((prevHistory) => [...prevHistory, { text: botResponse, sender: "bot" }]);
      onSendMessage({ text: botResponse, sender: "bot" });
      loadResponse(userResponse);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="chat-input">
      {conversationStarted && UserResponse && (
        <div className="user-response-display">
          <strong>Expected Response:</strong> {UserResponse}
        </div>
      )}

      <div className="input-container">
        {!conversationStarted ? (
          <button className="start-button" onClick={handleStartConversation}>
            Start the Conversation
          </button>
        ) : (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response here..."
              className="input-field"
            />
            <button
              className="mic-button"
              onMouseDown={startListening}
              onMouseUp={stopListening}
            >
              <FaMicrophone />
            </button>
            <button className="send-button" onClick={handleSend}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 7V17M12 7L16 11M12 7L8 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#2f2f2f"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
