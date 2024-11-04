import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Message from '../Message/Messsage';
import { StructuredChatProps } from '../../types/structuredChat';
import { RootState } from '../../Redux/store';
import 'chart.js/auto';  // הוסף את זה בראש הקובץ

const StructuredChat: React.FC<StructuredChatProps> = ({ messages, onMessageSubmit, onProgressUpdate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<'personalData' | 'accidentData' | 'injuryData'>('personalData');

  const questionsByTopic = {
    personalData: [
      { question: 'What is your name?', field: 'name' },
      { question: 'How old are you?', field: 'age' },
      { question: 'What is your address?', field: 'address' },
    ],
    accidentData: [
      { question: 'When did the accident happen?', field: 'accidentDate' },
      { question: 'Where did the accident happen?', field: 'accidentLocation' },
    ],
    injuryData: [
      { question: 'What type of injury?', field: 'injuryType' },
      { question: 'Which body part was affected?', field: 'affectedBodyPart' },
    ],
  };

  const personalData = useSelector((state: RootState) => state.form.personalData);
  const accidentData = useSelector((state: RootState) => state.form.accidentData);
  const injuryData = useSelector((state: RootState) => state.form.injuryData);

  const getAnswerFromRedux = (topic: 'personalData' | 'accidentData' | 'injuryData', field: string) => {
    const data = { personalData, accidentData, injuryData }[topic];
    return data.questions[field as keyof typeof data.questions];
  };

  const askQuestion = () => {
    const currentQuestions = questionsByTopic[currentTopic];
    const currentQuestionInfo = currentQuestions[currentQuestionIndex];
    const existingAnswer = getAnswerFromRedux(currentTopic, currentQuestionInfo.field);

    if (existingAnswer) {
      setCurrentMessage(`כבר ענית על ${currentQuestionInfo.question}: ${existingAnswer}. האם זה תקין?`);
    } else {
      setCurrentMessage(currentQuestionInfo.question);
    }
  };

  const handleProgressUpdate = () => {
    const currentQuestions = questionsByTopic[currentTopic];
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    onProgressUpdate(currentTopic, progress);
  };

  const handleSubmit = async () => {
    if (input.trim()) {
      onMessageSubmit({ sender: 'user', text: input });

      const currentQuestions = questionsByTopic[currentTopic];
      const currentQuestionInfo = currentQuestions[currentQuestionIndex];
      await axios.post('/api/saveAnswer', { question: currentQuestionInfo.question, answer: input });
      
      setInput('');
      handleProgressUpdate();

      if (currentQuestionIndex + 1 < currentQuestions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        const topicKeys = Object.keys(questionsByTopic) as Array<'personalData' | 'accidentData' | 'injuryData'>;
        const nextTopicIndex = topicKeys.indexOf(currentTopic) + 1;
        if (nextTopicIndex < topicKeys.length) {
          setCurrentTopic(topicKeys[nextTopicIndex]);
          setCurrentQuestionIndex(0);
        }
      }
    }
  };

  useEffect(() => {
    askQuestion();
  }, [currentQuestionIndex, currentTopic]);

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'user' ? 'user-message' : 'system-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <div>{currentMessage && <Message sender="system" text={currentMessage} />}</div>
      <input
        type="text"
        placeholder="Your answer..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
    </div>
  );
};

export default StructuredChat;
