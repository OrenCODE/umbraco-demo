export interface InvestorQuestionnaireModel {
  questions: Question[]
  riskProfile: string
  suggestedProducts: Product[]
}

export interface Question {
  questionId: number;
  questionText: string;
  answers: Answer[];
}

export interface Answer {
  answerId: string;
  answerText: string;
  score: number;
}

export interface Product {
  productId: number;
  productName: string;
  description: string;
  riskLevel: string;
  expectedReturn: string;
  image: string;
}

