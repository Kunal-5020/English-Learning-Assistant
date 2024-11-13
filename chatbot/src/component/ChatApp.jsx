import React, { useState, useRef} from "react";
import  ChatDisplay from "./ChatDisplay";
import ChatInput from "./ChatInput";
import Navbar from "./Navbar.jsx";
import "./css/ChatApp.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(-1);
  const chatRef = useRef(null);


  const handleScrollToMessage = (index) => {
    if (chatRef.current) {
      chatRef.current.scrollToMessage(index); // Call scrollToMessage using the ref
    }
  };


  const handleSendMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    // Only set currentResponseIndex if the message is from the bot
    if (message.sender === "bot") {
      setCurrentResponseIndex(messages.length); // Set current index to the latest bot message
    }
  };

  const handleNewChat = () => {

    setMessages([]);
    setCurrentResponseIndex(-1);
  };


// Handle navigating to the previous bot response
const handlePreviousResponse = () => {
  for (let i = currentResponseIndex - 1; i >= 0; i--) {
    if (messages[i].sender === "bot") {
      setCurrentResponseIndex(i);
      handleScrollToMessage(i); // Scroll to the message
      setTimeout(() => setCurrentResponseIndex(-1), 3000); // Remove highlight after 3 seconds
      return;
    }
  }
};

// Handle navigating to the next bot response
const handleNextResponse = () => {
  for (let i = currentResponseIndex + 1; i < messages.length; i++) {
    if (messages[i].sender === "bot") {
      setCurrentResponseIndex(i);
      handleScrollToMessage(i); // Scroll to the message
      setTimeout(() => setCurrentResponseIndex(-1), 3000); // Remove highlight after 3 seconds
      return;
    }
  }
};

  return (
    <div className="app-container">
      <Navbar
        onNewChat={handleNewChat}
        onPreviousResponse={handlePreviousResponse}
        onNextResponse={handleNextResponse}
      />
      <ChatDisplay messages={messages} currentResponseIndex={currentResponseIndex} />
      <ChatInput onSendMessage={handleSendMessage}/>
    </div>
  );
};

export default App;