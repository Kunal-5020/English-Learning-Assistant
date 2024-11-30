import React, { useEffect, useRef, useImperativeHandle } from "react";
import "./css/ChatDisplay.css";
import TextToSpeech from "../voice/TextToSpeech"; // Import the updated TextToSpeech function
import botIcon from '../asset/ai.png';
import speakerIcon from '../asset/speaker.png';

// ChatDisplay Component wrapped with React.forwardRef
const ChatDisplay = React.forwardRef(({ messages, currentResponseIndex }, ref) => {
  const chatEndRef = useRef(null);
  const messageRefs = useRef([]); // Reference to store message elements
  const containerRef = useRef(null); // Reference for the message container

  // Update message refs whenever messages change
  useEffect(() => {
    messageRefs.current = messageRefs.current.slice(0, messages.length);
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponseIndex]);

  // Smooth scroll to the target message index
  const scrollToMessage = (index) => {
    if (messageRefs.current[index] && containerRef.current) {
      const container = containerRef.current;
      const messageElement = messageRefs.current[index];

      // Calculate the position to center the message
      const offsetTop = messageElement.offsetTop - container.offsetTop;
      const centerOffset = offsetTop - container.clientHeight / 2 + messageElement.clientHeight / 2;

      // Set scrollTop directly to ensure exact positioning
      container.scrollTo({
        top: centerOffset,
        behavior: "smooth",
      });
    }
  };

  // Expose the scrollToMessage function to the parent component
  useImperativeHandle(ref, () => ({
    scrollToMessage,
  }));

  // Function to handle the speaker icon click
  const handleSpeakClick = (messageText) => {
    TextToSpeech(messageText); // Pass the message text to TextToSpeech function
  };

  return (
    <div ref={containerRef} className="chat-display">
      {messages.map((msg, index) => (
        <div
          key={index}
          ref={(el) => (messageRefs.current[index] = el)}
          className={`message ${msg.sender} ${index === currentResponseIndex ? "highlighted" : ""}`}
        >
          {msg.sender === "bot" && (
            <span className="bot-icon">
              <img
                src={botIcon} // Use the imported image here
                alt="Chatbot Icon"
                style={{ width: "50px", height: "52px", paddingBottom: "10px" }}
              />
            </span>
          )}
          <span className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }}></span>
          {msg.sender === 'bot' && (
            <img
              src={speakerIcon} // Use the imported image here
              alt="Speaker Icon"
              style={{ position: "absolute", top: "25px", right: "15px", height: "18px", width: "18px", cursor: "pointer" }}
              onClick={() => handleSpeakClick(msg.text)} // Pass the message's text to the function
            />
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
});

export default ChatDisplay;
