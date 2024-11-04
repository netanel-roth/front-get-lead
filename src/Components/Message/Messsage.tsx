import React from 'react';
import './message.css';
import { MessageProps } from '../../types/message';

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  return (
    <div className={`message ${sender === 'user' ? 'message-user' : 'message-system'}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;
