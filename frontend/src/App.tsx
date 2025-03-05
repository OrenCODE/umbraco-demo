import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { SummaryPage } from './pages/SummaryPage';
import { useEffect, useState } from 'react';
import { InvestorQuestionnaireModel } from './types';
import axios from 'axios';
import Loader from './components/Loader';
// import { cmsDummyData } from './data';
import { mapDeliveryResponseToModel } from './utils/mapDeliveryResponseToModel';

function App() {
  const [cmsData, setCmsData] = useState<InvestorQuestionnaireModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<InvestorQuestionnaireModel>('/umbraco/delivery/api/v2/content/item/09bdd61c-ecd9-4528-9e94-d5321fe0d982')
      //     .get<InvestorQuestionnaireModel>('/umbraco/api/QuestionnaireApi/GetQuestionnaire')
      .then(response => {
        const x = mapDeliveryResponseToModel(response.data)
        setCmsData(x);
        // setCmsData(response.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Error fetching data. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader count={3} color="bg-blue-500" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!cmsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">No data available.</p>
      </div>
    );
  }

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

export default App;
