import React, { useEffect } from 'react';
import { ChatProps } from '../../types/Chat';
import Message from '../Message/Messsage';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { addMessage, getAIResponse } from '../../Redux/formSlice';

const FreeChat: React.FC<ChatProps> = ({ messages, onMessageSubmit }) => {
  const [input, setInput] = React.useState('');
  const [isFirstMessage, setIsFirstMessage] = React.useState(true);
  const dispatch = useAppDispatch();

   // קבלת שאלה ראשונית מה-AI בטעינה

   useEffect(() => {
    if (messages.length === 0) {
      // יש להחזיר לאחר שהשרת יעבוד!!!!!!!!!!

       //dispatch(getAIResponse({}));  // שולחים אובייקט ריק
    // יש להשמיט לאחר שהשרת יעבוד!!!!!!!!!!

  dispatch(addMessage({
    sender: 'system',
    text: 'שלום, נשאר לך רק קצת נתונים להשלים, איפה היתה התאונה?'  }));
    }
  }, [dispatch, messages.length]);

  const handleSubmit = async () => {
    if (input.trim()) {
            // יש להחזיר לאחר שהשרת יעבוד!!!!!!!!!!
      // await onMessageSubmit({
      //   sender: 'user',
      //   text: input.trim()
      // });
    // יש להשמיט לאחר שהשרת יעבוד!!!!!!!!!!
    dispatch(addMessage({
      sender: 'user',
      text: input.trim() }));
       setInput('');

       dispatch(addMessage({
        sender: 'system',
        text: 'מעולה, איך אתה מרגיש היום?'}));
    } 
    }
  
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