import React, { useEffect } from 'react';
import { ChatProps } from '../../types/Chat';
import Message from '../Message/Messsage';

const FreeChat: React.FC<ChatProps> = ({ messages, onMessageSubmit }) => {
  const [input, setInput] = React.useState('');
  const [isFirstMessage, setIsFirstMessage] = React.useState(true);

  // בקשת השאלה הראשונית מהשרת בטעינה
  useEffect(() => {
    const getInitialQuestion = async () => {
      if (isFirstMessage && messages.length === 0) {
        try {
          await onMessageSubmit({ 
            sender: 'system', 
            text: 'INITIAL_PROMPT' 
          });
          setIsFirstMessage(false);
        } catch (error) {
          console.error('Failed to get initial question:', error);
        }
      }
    };

    getInitialQuestion();
  }, [isFirstMessage, messages.length, onMessageSubmit]);

  const handleSubmit = async () => {
    if (input.trim()) {
      try {
        await onMessageSubmit({
          sender: 'user',
          text: input
        });
        setInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {msg.sender === 'user' ? 'You' : 'AI Assistant'}
              </div>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="sticky bottom-0 bg-white border-t pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 p-3 border rounded-lg"
            placeholder="Type your message..."
          />
          <button 
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeChat;