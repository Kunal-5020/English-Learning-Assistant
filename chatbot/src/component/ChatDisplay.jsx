import React, { useEffect, useRef, useImperativeHandle } from "react";
import "./css/ChatDisplay.css";

// ChatDisplay Component wrapped with React.forwardRef
const ChatDisplay = React.forwardRef(({ messages, currentResponseIndex }, ref) => {
  const chatEndRef = useRef(null);
  const messageRefs = useRef([]);
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
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 0V2H13L16 8.5L13 15H3L0 8.5L3 2H7V0H9ZM4.59794 11.7384L8 12.2618L11.4021 11.7384L11.0979 9.76163L8 10.2382L4.90206 9.76163L4.59794 11.7384ZM7 6.75C7 7.44036 6.44036 8 5.75 8C5.05964 8 4.5 7.44036 4.5 6.75C4.5 6.05964 5.05964 5.5 5.75 5.5C6.44036 5.5 7 6.05964 7 6.75ZM10.25 8C10.9404 8 11.5 7.44036 11.5 6.75C11.5 6.05964 10.9404 5.5 10.25 5.5C9.55964 5.5 9 6.05964 9 6.75C9 7.44036 9.55964 8 10.25 8Z"
                    fill="#fff"
                  ></path>
                </g>
              </svg>
            </span>
          )}
          <span className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }}></span>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
});

export default ChatDisplay ;
