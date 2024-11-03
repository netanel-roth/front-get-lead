import React from 'react';
import './Message.css';

const Message = ({ sender, text }) => {
  return (
    <div className={`message ${sender === 'user' ? 'message-user' : 'message-system'}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;
