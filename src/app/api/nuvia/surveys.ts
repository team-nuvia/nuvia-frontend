
import type { NextApiRequest, NextApiResponse } from 'next';

// --- TYPE DEFINITIONS (from frontend) ---
type QuestionType = 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice';

interface QuestionOption {
  value: string;
}

interface Question {
  title: string;
  question_type: QuestionType;
  options: QuestionOption[];
}

interface SurveyData {
  title: string;
  description?: string;
  expires_at?: string | null;
  is_public: boolean;
  questions: Question[];
  management_password?: string;
}

// --- MOCK DATABASE ---
// In a real application, you would use a database like PostgreSQL, MongoDB, etc.
const mockSurveys: any[] = [];

// --- API HANDLER ---
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const surveyData: SurveyData = req.body;

      // --- VALIDATION ---
      if (!surveyData.title || surveyData.title.trim().length === 0) {
        return res.status(400).json({ message: 'Title is required.' });
      }
      if (!surveyData.questions || surveyData.questions.length === 0) {
        return res.status(400).json({ message: 'At least one question is required.' });
      }
      // NOTE: Add more robust validation as needed (e.g., for each question and option)

      // --- DATA PROCESSING ---
      const newSurvey = {
        id: `survey_${Date.now()}`,
        created_at: new Date().toISOString(),
        ...surveyData,
      };

      // Save to the mock database
      mockSurveys.push(newSurvey);
      console.log('New survey created:', newSurvey);
      console.log('All surveys:', mockSurveys);

      res.status(201).json({ 
        message: 'Survey created successfully', 
        surveyId: newSurvey.id,
        management_password: surveyData.management_password
      });

    } catch (error) {
      console.error('Error processing survey:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
