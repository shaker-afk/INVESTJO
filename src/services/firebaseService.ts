export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FeasibilityStudy {
  id: string;
  title: string;
  size: string;
  date: Date;
}

export interface RegulatoryData {
  messages: ChatMessage[];
  studies: FeasibilityStudy[];
}

/**
 * Mocks a Firestore call to fetch current regulatory conversational context
 * and related documents from Firebase Storage references.
 */
export const fetchRegulatoryData = async (): Promise<RegulatoryData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        messages: [
          {
            id: '1',
            role: 'assistant',
            content: 'Welcome to the AI Regulatory Assistant. How can I help you navigate the investment landscape in Jordan today?',
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: '2',
            role: 'user',
            content: 'What are the foreign ownership limits for renewable energy projects in the designated development zones?',
            timestamp: new Date(Date.now() - 1800000),
          },
          {
            id: '3',
            role: 'assistant',
            content: 'Under the Investment Environment Law, foreign investors can generally own up to 100% of projects in development zones, including renewable energy initiatives. However, specific tax exemptions and incentives require registration with the Ministry of Investment. Would you like me to pull the latest directive on development zone tax frameworks?',
            timestamp: new Date(Date.now() - 1750000),
          },
        ],
        studies: [
          {
            id: 'doc1',
            title: 'Ma\'an Solar Park Feasibility',
            size: '2.4 MB',
            date: new Date('2023-11-12'),
          },
          {
            id: 'doc2',
            title: 'Aqaba Green Hydrogen Framework',
            size: '5.1 MB',
            date: new Date('2024-01-05'),
          },
          {
            id: 'doc3',
            title: 'Investment Law No. 21 Translation',
            size: '1.2 MB',
            date: new Date('2024-02-28'),
          },
        ]
      });
    }, 800);
  });
};
