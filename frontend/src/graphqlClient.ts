// src/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient('http://localhost:5173/graphql', {
  // If your Umbraco is at a different port/URL, adjust accordingly.
  // Also add headers if you have authentication or need any special tokens.
});

// The exact GraphQL query you posted:
export const GET_INVESTOR_QUESTIONNAIRE = /* GraphQL */ `
  query {
    contentByGuid(id: "09bdd61c-ecd9-4528-9e94-d5321fe0d982") {
      name
      key
      urlSegment
      updateDate
      properties {
        ... on InvestorQuestionnaire {
          riskProfile {
            value
          }
          questions {
            blocks {
              contentAlias
              contentProperties {
                ... on Question {
                  questionText {
                    value
                  }
                  answers {
                    blocks {
                      contentAlias
                      contentProperties {
                        ... on Answer {
                          answerText {
                            value
                          }
                          score {
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          suggestedProducts {
            blocks {
              contentAlias
              contentProperties {
                ... on Product {
                  productName {
                    value
                  }
                  description {
                    value
                  }
                  riskLevel {
                    value
                  }
                  expectedReturn {
                    value
                  }
                  image {
                    mediaItems {
                      url(urlMode: ABSOLUTE)
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
