import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FreeChat from '../FreeChat';
import StructuredChat from './StructuredChat';
import ProgressBar from './ProgressBar';
import ChatModeSwitcher from './ChatModeSwitcher';
import axios from 'axios';

// קומפוננטת השיחה הראשית
const ChatManager = () => {
  // סטייטים לניהול מצב השיחה, רשימת ההודעות, ואחוזי ההשלמה
  const [currentMode, setCurrentMode] = useState('free'); // מצב השיחה (חופשי/מובנה)
  const [messages, setMessages] = useState([]); // רשימת ההודעות
  const completionData = useSelector((state) => state.completionData); // נתוני ההשלמה מ-Redux
  const dispatch = useDispatch();

  // הפונקציה מופעלת כאשר הקומפוננטה נטענת, מביאה את כל ההודעות הקיימות
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/messages'); // מביא הודעות מהשרת
        setMessages(response.data); // שומר את ההודעות בסטייט
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  // פונקציה למעבר בין מצב חופשי למובנה
  const toggleMode = () => {
    setCurrentMode((prevMode) => (prevMode === 'free' ? 'structured' : 'free'));
  };

  // מוסיפה הודעה חדשה לסטייט ול-DB
  const updateMessages = async (message) => {
    try {
      const response = await axios.post('/api/messages', { message }); // שומר את ההודעה בשרת
      setMessages((prevMessages) => [...prevMessages, response.data]); // מעדכן את הסטייט עם ההודעה החדשה
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  // פונקציה לעדכון אחוזי ההשלמה על בסיס השאלות שנענו
  const updateCompletion = () => {
    const totalQuestions = 100; // נניח שיש 100 שאלות כלליות
    const answeredQuestions = messages.length; // מספר ההודעות שנענו
    const completionPercentage = (answeredQuestions / totalQuestions) * 100;

    dispatch({
      type: 'UPDATE_COMPLETION',
      payload: { completionPercentage },
    });
  };

  // מעדכנת את ההשלמה בכל פעם שהודעה חדשה מתווספת
  useEffect(() => {
    updateCompletion();
  }, [messages]);

  return (
    <div className="chat-manager">
      <ProgressBar progress={completionData.completionPercentage} /> {/* מציג את התקדמות ההשלמה */}
      <ChatModeSwitcher currentMode={currentMode} onSwitch={toggleMode} /> {/* מעבר בין מצבי השיחה */}

      {/* בחירה בין שיחה חופשית לשיחה מובנית */}
      {currentMode === 'free' ? (
        <FreeChat messages={messages} onMessageSubmit={updateMessages} />
      ) : (
        <StructuredChat messages={messages} onMessageSubmit={updateMessages} />
      )}
    </div>
  );
};

export default ChatManager;
