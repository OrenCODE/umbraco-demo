import { InvestorQuestionnaireModel, Question, Answer, Product } from '../types';

/**
 * mapDeliveryResponseToModel
 * Transforms the Umbraco Delivery API response into your InvestorQuestionnaireModel,
 * using the original GUIDs for questionId, answerId, and productId.
 */
export function mapDeliveryResponseToModel(deliveryData: any): InvestorQuestionnaireModel {
  // 1) Extract the "properties" from the main response
  const props = deliveryData?.properties || {};

  // 2) riskProfile is a simple string
  const riskProfile: string = props.riskProfile ?? '';

  // 3) Map questions
  const questionItems = props.questions?.items || [];
  const questions: Question[] = questionItems.map((qItem: any) => {
    const qContent = qItem.content || {};
    const qProps = qContent.properties || {};

    // Use the block's GUID as questionId
    const questionId = qContent.id || '';

    // questionText is a string
    const questionText = qProps.questionText || '';

    // answers is another block list in qProps.answers.items
    const answerItems = qProps.answers?.items || [];
    const answers: Answer[] = answerItems.map((aItem: any) => {
      const aContent = aItem.content || {};
      const aProps = aContent.properties || {};

      // Use the block's GUID as answerId
      const answerId = aContent.id || '';

      return {
        answerId,
        answerText: aProps.answerText || '',
        score: Number(aProps.score) || 0,
      };
    });

    return {
      questionId,
      questionText,
      answers,
    };
  });

  // 4) Map suggestedProducts
  const productItems = props.suggestedProducts?.items || [];
  const suggestedProducts: Product[] = productItems.map((pItem: any) => {
    const pContent = pItem.content || {};
    const pProps = pContent.properties || {};

    // Use the block's GUID as productId
    const productId = pContent.id || '';

    const productName = pProps.productName || '';
    const description = pProps.description || '';
    const riskLevel = pProps.riskLevel || '';
    const expectedReturn = pProps.expectedReturn || '';

    // The "image" field is an array of media items
    // We'll pick the first item if available
    let image = '';
    const images = pProps.image || [];
    if (images.length > 0) {
      const firstImg = images[0];
      // The "url" is relative, e.g. "/media/..."
      image = `http://localhost:10768${firstImg.url}`;
    }

    return {
      productId,
      productName,
      description,
      riskLevel,
      expectedReturn,
      image,
    };
  });

  // 5) Return final model
  return {
    questions,
    riskProfile,
    suggestedProducts,
  };
}
