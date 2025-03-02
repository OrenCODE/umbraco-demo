// QuestionnairePage.tsx
import { AnimatePresence } from 'framer-motion';
import { Navigate, useParams } from 'react-router-dom';
import { QuestionPage } from '../components/QuestionPage';
import { useQuestionnaire } from '../context/QuestionnaireContext';

export const QuestionnairePage: React.FC = () => {
  const { index } = useParams<{ index: string }>();
  const questionIndex = parseInt(index || '0', 10);
  const { questions, answers, handleAnswer } = useQuestionnaire();

  if (questionIndex >= questions.length) {
    return <Navigate to="/summary" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <QuestionPage
        key={questionIndex}
        questionIndex={questionIndex}
        question={questions[questionIndex]}
        onAnswer={handleAnswer}
        currentStep={questionIndex + 1}
        totalSteps={questions.length}
        selectedScore={answers[questionIndex]?.score}
      />
    </AnimatePresence>
  );
};
