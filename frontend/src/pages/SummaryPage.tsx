import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import axios from 'axios';

const getRiskProfile = (score: number): string => {
  const avgScore = score / 4; // Assuming 2 questions
  if (avgScore <= 1.5) return "Conservative";
  if (avgScore <= 2.5) return "Moderate";
  if (avgScore <= 3.5) return "Growth";
  return "Aggressive";
};

export const SummaryPage: React.FC = () => {
  const { totalScore, resetQuestionnaire, suggestedProducts, questions, answers } = useQuestionnaire();
  const riskProfile = getRiskProfile(totalScore);

  const submitResponse = async () => {
    // Build a response model using the questions from CMS and user answers
    const userResponse = {
      submittedOn: new Date().toISOString(),
      answers: questions.map((q, i) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        selectedAnswer: answers[i]?.answerText || '',
        score: answers[i]?.score || 0,
      })),
    };

    try {
      const response = await axios.post('/umbraco/api/QuestionnaireApi/SubmitResponse', userResponse);
      alert("Response submitted successfully!");
      console.log("Response saved:", response.data);
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("There was an error submitting your response.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-8"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Your Investment Profile</h2>
          <p className="text-2xl mb-2">Risk Tolerance: <span className="font-semibold">{riskProfile}</span></p>
          <p className="text-lg opacity-90">
            Based on your responses, we've identified investment options that align with your risk tolerance and goals.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={resetQuestionnaire}
              className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retake Questionnaire
            </button>
            <button
              onClick={submitResponse}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {suggestedProducts.map((product, index) => (
          <motion.div
            key={product.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Risk Level:</span>{" "}
                  <span className="text-blue-600">{product.riskLevel}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Expected Return:</span>{" "}
                  <span className="text-blue-600">{product.expectedReturn}</span>
                </p>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg 
                               hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};