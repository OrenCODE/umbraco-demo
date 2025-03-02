import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { SummaryPage } from './pages/SummaryPage';
import { useEffect, useState } from 'react';
import { InvestorQuestionnaireModel } from './types';
import axios from 'axios';

function App() {

  const [cmsData, setCmsData] = useState<InvestorQuestionnaireModel | null>(null);

  useEffect(() => {
    axios
      .get<InvestorQuestionnaireModel>('/umbraco/api/QuestionnaireApi/GetQuestionnaire')
      .then(response => {
        setCmsData(response.data);
        console.log()
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, []);

  if (!cmsData) return <div>Loading...</div>;

  return (
    <Router>
      <QuestionnaireProvider cmsData={cmsData}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Investment Profile Questionnaire
              </h1>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-12">
            <Routes>
              <Route path="/question/:index" element={<QuestionnairePage />} />
              <Route path="/summary" element={<SummaryPage />} />
              <Route path="*" element={<Navigate to="/question/0" replace />} />
            </Routes>
          </main>
        </div>
      </QuestionnaireProvider>
    </Router>
  );
}

export default App