// QuestionPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Question, Answer } from '../types';

interface QuestionPageProps {
  question: Question;
  onAnswer: (selectedAnswer: Answer, questionIndex: number) => void;
  questionIndex: number;
  currentStep: number;
  totalSteps: number;
  selectedScore?: number;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  questionIndex,
  onAnswer,
  currentStep,
  totalSteps,
  selectedScore,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Question {currentStep} of {totalSteps}
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-8 text-gray-800">
        {question.questionText}
      </h2>

      <div className="space-y-4">
        {question.answers.map((option, index) => {
          const isActive =
            selectedScore !== undefined && selectedScore === option.score;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onAnswer(option, questionIndex)}
              className={`w-full p-6 text-left border-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'border-blue-500 shadow-lg bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg'
              }`}
            >
              <span
                className={`text-lg ${
                  isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                }`}
              >
                {option.answerText}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
