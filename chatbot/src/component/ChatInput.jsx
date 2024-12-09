import React, { useState, } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./css/ChatInput.css";

const ChatInput = ({ onSendMessage, handleExpectedResponse }) => {
  // const [input, setInput] = useState("");
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [history, setHistory] = useState([]);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Start listening for speech
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en" });
  };

  // Stop listening for speech and send the message
  const stopListeningAndSend = async () => {
    SpeechRecognition.stopListening();  // Stop the microphone listening
    if (transcript.trim()) {
      const userMessage = { text: transcript, sender: "user" };
      setHistory((prevHistory) => [...prevHistory, userMessage]);
      onSendMessage(userMessage);  // Send the message to parent component


      // setInput(""); 

      try {
        const messagePayload = {
          history: history.concat(userMessage),
          current_message: { sender: "user", text: transcript },
        };

        const response = await axios.post("https://english-assistant-server.onrender.com/api/chat/generate", {
          messagePayload,
        });

        const Response = response.data.response;
        const botResponse = Response.BotResponse;
        const userResponse = Response.UserResponse;

        setHistory((prevHistory) => [...prevHistory, { text: botResponse, sender: "bot" }]);
        onSendMessage({ text: botResponse, sender: "bot" });
        handleExpectedResponse(userResponse);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Handle starting the conversation
  const handleStartConversation = async () => {
    const startMessage = "Start the conversation";
    const userMessage = { text: startMessage, sender: "user" };
    setHistory((prevHistory) => [...prevHistory, userMessage]);
    onSendMessage(userMessage);

    try {
      const response = await axios.post("https://english-assistant-server.onrender.com/api/chat/generate", {
        messagePayload: {
          history: [userMessage],
          current_message: { sender: "user", text: startMessage },
        },
      });

      const Response = response.data.response;
      const botResponse = Response.BotResponse;
      // const userResponse = Response.UserResponse;

      setHistory((prevHistory) => [...prevHistory, { text: botResponse, sender: "bot" }]);
      onSendMessage({ text: botResponse, sender: "bot" });
      setConversationStarted(true);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // useEffect(() => {
  //   setInput(transcript);
  // }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="chat-input">
      {/* Display recorded words (transcript) in the box */}
      <div className="user-response-display">
        <strong>{transcript}</strong>   {/* Show what's recorded */}
      </div>

      <div className="input-container">
        {!conversationStarted ? (
          <button className="start-button" onClick={handleStartConversation}>
            Start the Conversation
          </button>
        ) : (
          <>
            <button
              className="mic-button"
              onMouseDown={startListening}  // Start listening when the mic button is pressed
              onMouseUp={stopListeningAndSend}  // Stop listening and send the message when the mic button is released
            >
              <FaMicrophone />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
