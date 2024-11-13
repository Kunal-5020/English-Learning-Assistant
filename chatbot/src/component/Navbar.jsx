import React from "react";
import "./css/Navbar.css";
import { ReactComponent as NewChat } from '../asset/newChat.svg';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';

const Navbar = ({ onNewChat, onPreviousResponse, onNextResponse }) => {
  return (
    <div className="navbar">
      <button className="new-chat-button" onClick={onNewChat} aria-label="New Chat">
        <NewChat style={{ fill: '#ccc' }} />
      </button>
      <div className="arrow-container">
        <button className="arrow-button" onClick={onPreviousResponse} aria-label="Previous Response">
          <AiOutlineArrowUp size={24} color="#fff" />
        </button>
        <button className="arrow-button" onClick={onNextResponse} aria-label="Next Response">
          <AiOutlineArrowDown size={24} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
