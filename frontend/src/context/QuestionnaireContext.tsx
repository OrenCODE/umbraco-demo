// QuestionnaireContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Answer, InvestorQuestionnaireModel } from '../types';

interface QuestionnaireContextType {
  currentQuestionIndex: number;
  totalScore: number;
  handleAnswer: (selectedAnswer: Answer, questionIndex: number) => void;
  resetQuestionnaire: () => void;
  goToQuestion: (index: number) => void;
  riskProfile: string;
  questions: InvestorQuestionnaireModel["questions"];
  answers: Answer[];
  suggestedProducts: InvestorQuestionnaireModel["suggestedProducts"];
}

const QuestionnaireContext = createContext<QuestionnaireContextType | null>(null);

interface ProviderProps {
  children: React.ReactNode;
  cmsData: InvestorQuestionnaireModel;
}

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

export const QuestionnaireProvider: React.FC<ProviderProps> = ({ children, cmsData }) => {
  const navigate = useNavigate();
  const questions = cmsData.questions; // Use new questions from cmsData

  const [answers, setAnswers] = useState<Answer[]>(() => {
    const saved = sessionStorage.getItem('questionnaire_answers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('questionnaire_answers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (selectedAnswer: Answer, questionIndex: number) => {
    if (questionIndex < answers.length) {
      // Update an already answered question
      setAnswers(prev => prev.map((ans, i) => (i === questionIndex ? selectedAnswer : ans)));
    } else {
      // Append a new answer
      setAnswers(prev => [...prev, selectedAnswer]);
    }

    // Navigate to the next question if available, else to summary.
    if (questionIndex + 1 < questions.length) {
      navigate(`/question/${questionIndex + 1}`);
    } else {
      navigate('/summary');
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      // Optionally clear later answers if editing
      setAnswers(prev => prev.slice(0, index));
      navigate(`/question/${index}`);
    }
  };

  const resetQuestionnaire = () => {
    sessionStorage.removeItem('questionnaire_answers');
    setAnswers([]);
    navigate('/question/0');
  };

  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);

  return (
    <QuestionnaireContext.Provider
      value={{
        currentQuestionIndex: answers.length,
        questions,
        answers,
        totalScore,
        handleAnswer,
        resetQuestionnaire,
        goToQuestion,
        riskProfile: cmsData.riskProfile,
        suggestedProducts: cmsData.suggestedProducts,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};
