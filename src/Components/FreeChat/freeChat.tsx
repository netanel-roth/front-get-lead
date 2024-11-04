import React from 'react';
import { ChatProps } from '../../types/Chat';


const FreeChat: React.FC<ChatProps> = ({ messages, onMessageSubmit }) => {
  const [input, setInput] = React.useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onMessageSubmit({ sender: 'user', text: input });
      setInput('');
    }
  };
  return (
    <div>
      <div>
        {messages.map((msg:any, idx:number) => (
          <div key={idx} className={msg.sender === 'user' ? 'user-message' : 'system-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
    </div>
  );
};

export default FreeChat;
