import { InvestorQuestionnaireModel } from './types';

export const cmsData: InvestorQuestionnaireModel = {
    questions: [
        {
            "questionId": 1061,
            "questionText": "What is your investment experience?",
            "answers": [
                {
                    "answerText": "None",
                    "score": 1
                },
                {
                    "answerText": "Some",
                    "score": 2
                },
                {
                    "answerText": "Extensive",
                    "score": 3
                }
            ]
        },
        {
            "questionId": 1065,
            "questionText": "Do you have loans?",
            "answers": [
                {
                    "answerText": "Yes",
                    "score": 1
                },
                {
                    "answerText": "No",
                    "score": 3
                }
            ]
        },
        {
            "questionId": 1075,
            "questionText": "How would you react if your investment lost 20% of its value in a year?",
            "answers": [
                {
                    "answerText": "I would sell immediately to prevent further losses",
                    "score": 1
                },
                {
                    "answerText": "I would be concerned but wait to see if it recovers",
                    "score": 2
                },
                {
                    "answerText": "I understand market fluctuations and would stay invested",
                    "score": 3
                },
                {
                    "answerText": "I would see it as an opportunity to invest more",
                    "score": 4
                }
            ]
        },
        {
            "questionId": 1080,
            "questionText": "How long do you plan to keep your money invested?",
            "answers": [
                {
                    "answerText": "Less than 1 year",
                    "score": 1
                },
                {
                    "answerText": "1-3 years",
                    "score": 2
                },
                {
                    "answerText": "3-5 years",
                    "score": 3
                },
                {
                    "answerText": "More than 5 years",
                    "score": 4
                }
            ]
        }
    ],
    riskProfile: "Moderate",
    suggestedProducts: [
        {
            "productId": 1087,
            "productName": "Conservative Growth Fund",
            "description": "A low-risk fund focused on capital preservation with steady returns",
            "image": "http://localhost:10768/media/uptknunp/photo-1460925895917-afdab827c52f.jpeg",
            "riskLevel": "Low",
            "expectedReturn": "3-5%"
        },
        {
            "productId": 1090,
            "productName": "Balanced Growth Portfolio",
            "description": "A balanced mix of stocks and bonds for moderate growth",
            "image": "http://localhost:10768/media/xythyiqd/photo-1590283603385-17ffb3a7f29f.jpeg",
            "riskLevel": "Moderate",
            "expectedReturn": "6-8%"
        },
        {
            "productId": 1092,
            "productName": "Aggressive Growth Fund",
            "description": "High-growth potential through diversified equity investments",
            "image": "http://localhost:10768/media/ipfncdhp/photo-1611974789855-9c2a0a7236a3.jpeg",
            "riskLevel": "High",
            "expectedReturn": "9-12%"
        }
    ]
}