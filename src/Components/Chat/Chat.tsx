import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FreeChat from '../FreeChat/freeChat';
import StructuredChat from '../StructuredChat/structuredChat';
import ProgressBar from '../ProgressBar/progressBar';
import { fetchInitialData ,addMessage, selectMessages,selectPersonalData, selectAccidentData, selectInjuryData, getAIResponse, addMessageThunk} from '../../Redux/formSlice';
import { RootState,AppDispatch  } from '../../Redux/store';
import { MessageType } from '../../types/message';
import { useAppDispatch } from '../../Redux/hooks';
//import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


// קומפוננטת ChatManager המקורית עם עיצוב משופר
const ChatManager = () => {
  const dispatch = useAppDispatch();  // במקום useDispatch רגיל

  const [currentMode, setCurrentMode] = useState('free');
  const messages = useSelector((state: RootState) => state.form.messages);
  const [progress, setProgress] = useState({
    free: {
      personal: 0,
      accident: 0,
      injury: 0
    },
    structured: {
      personal: 0,
      accident: 0,
      injury: 0
    }
  });

  // חישוב התקדמות בשיחה חופשית
  const calculateFreeChatProgress = useCallback(() => {
    const messageCount = messages.length;
    const baseProgress = Math.min((messageCount * 10), 100);
   
    return {
      personal: baseProgress * 0.8,
      accident: baseProgress * 0.6,
      injury: baseProgress * 0.4
    };
  }, [messages]);

  // עדכון התקדמות בשיחה מובנית
  const handleStructuredProgressUpdate = (topic: 'personal' | 'accident' | 'injury', value: number) => {
    setProgress(prev => ({
      ...prev,
      structured: {
        ...prev.structured,
        [topic]: value
      }
    }));
  };


      // יש להחזיר לאחר שהשרת יעבוד!!!!!!!!!!


  // טעינת כל הנתונים בתחילת הרכיב
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await dispatch(fetchInitialData()).unwrap();
        
        // אם אנחנו במצב שיחה חופשית ואין הודעות, נבקש שאלה ראשונית
        if (currentMode === 'free' && messages.length === 0) {
          await dispatch(getAIResponse({ prevMessage: undefined }));
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [dispatch]);



  const handleMessageSubmit = async (newMessage: MessageType) => {
    try {
        // קודם שומרים את הודעת המשתמש
        await dispatch(addMessageThunk(newMessage)).unwrap();
        
        // מבקשים תשובה מהמערכת ושומרים אותה
        const resultAction = await dispatch(getAIResponse({ 
          prevMessage: newMessage 
        }));
        if (currentMode === 'free') {
          if (getAIResponse.fulfilled.match(resultAction)) {
          await dispatch(addMessageThunk(resultAction.payload)).unwrap();

          const newProgress = calculateFreeChatProgress();
          setProgress(prev => ({
            ...prev,
            free: newProgress
          }));
        }
      }
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-800">
            {currentMode === 'free' ? 'Free Chat Mode' : 'Structured Chat Mode'}
          </span>
          <button
            onClick={() => setCurrentMode(prev => prev === 'free' ? 'structured' : 'free')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Switch to {currentMode === 'free' ? 'Structured' : 'Free'} Chat
          </button>
        </div>
      </div>

      {/* Progress Tracking */}
      <ProgressBar progress={currentMode === 'free' ? progress.free : progress.structured} />

   
      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {currentMode === 'free' ? (
          <FreeChat
            messages={messages}
            onMessageSubmit={handleMessageSubmit}
          />
        ) : (
          <StructuredChat
            messages={messages}
            onMessageSubmit={handleMessageSubmit}
            onProgressUpdate={handleStructuredProgressUpdate}
          />
        )}
      </div>
    </div>
  );
};
 export default ChatManager