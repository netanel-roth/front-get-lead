import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updateCompletionPercentage } from '../redux/actions/formActions';
import Message from './Message';

const StructuredConversation = ({ initialQuestions, topic }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(initialQuestions);
  const dispatch = useDispatch();

  // פונקציה לשליחת התשובה לשרת ולעדכן את Redux
  const handleAnswer = async (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      await axios.post('/api/saveAnswer', { question: currentQuestion, answer });
      
      dispatch({
        type: `UPDATE_${topic.toUpperCase()}_QUESTION`,
        payload: { question: currentQuestion, answer }
      });
      
      dispatch(updateCompletionPercentage());

      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  // פונקציה לבדיקת שאלה והצגתה
  const askQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      const response = await axios.get(`/api/getAnswer?question=${currentQuestion}`);
      const existingAnswer = response.data.answer;

      if (existingAnswer) {
        return (
          <Message sender="system" text={`כבר ענית על ${currentQuestion}: ${existingAnswer}. האם זה תקין?`} />
        );
      } else {
        return <Message sender="system" text={currentQuestion} />;
      }
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  };

  return (
    <div>
      {askQuestion()}
      <input
        type="text"
        placeholder="Your answer..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAnswer(e.target.value);
        }}
      />
    </div>
  );
};

export default StructuredConversation;
