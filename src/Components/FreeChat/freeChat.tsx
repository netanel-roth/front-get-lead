import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Message from './Message';

const FreeConversation = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  const handleInput = async () => {
    try {
      const userResponse = { sender: 'user', text: userMessage };
      setMessages([...messages, userResponse]);

      await axios.post('/api/saveMessage', { message: userMessage });

      const aiResponse = await axios.post('/api/analyzeMessage', { message: userMessage });
      const { identifiedFields } = aiResponse.data;

      identifiedFields.forEach(field => {
        dispatch({
          type: `UPDATE_${field.topic.toUpperCase()}_QUESTION`,
          payload: { question: field.question, answer: field.answer }
        });
      });

      dispatch({
        type: 'UPDATE_COMPLETION_PERCENTAGE'
      });

      setUserMessage("");
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  return (
    <div>
      {messages.map((msg, idx) => (
        <Message key={idx} sender={msg.sender} text={msg.text} />
      ))}
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleInput();
        }}
      />
    </div>
  );
};

export default FreeConversation;
