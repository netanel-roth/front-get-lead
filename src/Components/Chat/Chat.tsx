import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FreeChat from '../FreeChat/freeChat';
import StructuredChat from '../StructuredChat/structuredChat';
import ProgressBar from '../ProgressBar/progressBar';
import { fetchInitialData ,addMessage, selectMessages,selectPersonalData, selectAccidentData, selectInjuryData} from '../../Redux/formSlice';
import { RootState,AppDispatch  } from '../../Redux/store';
import { MessageType } from '../../types/message';
//import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


// קומפוננטת ChatManager המקורית עם עיצוב משופר
const ChatManager = () => {
  const [currentMode, setCurrentMode] = useState('free');
  const [messages, setMessages] = useState<MessageType[]>([]);
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
  const handleStructuredProgressUpdate = (topic: any, value: any) => {
    setProgress(prev => ({
      ...prev,
      structured: {
        ...prev.structured,
        [topic]: value
      }
    }));
  };

  const handleMessageSubmit = (newMessage: MessageType) => {
    setMessages(prev => [...prev, newMessage]);
    
    // עדכון התקדמות בשיחה חופשית
    if (currentMode === 'free') {
      const newProgress = calculateFreeChatProgress();
      setProgress(prev => ({
        ...prev,
        free: newProgress
      }));
    }
  };

  useEffect(() => {
    if (currentMode === 'free') {
      const newProgress = calculateFreeChatProgress();
      setProgress(prev => ({
        ...prev,
        free: newProgress
      }));
    }
  }, [currentMode, calculateFreeChatProgress]);

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

      {/* Chat Interface - Using Original Components */}
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

export default ChatManager;