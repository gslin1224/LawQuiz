export interface Question {
  id: number;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  answer: string;
  difficulty: '容易' | '適中' | '困難';
  explanation: string;
  topic: string;
}

export interface QuizData {
  title: string;
  total: number;
  questions: Question[];
}

export interface QuizRecord {
  id: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  wrongIds: number[];
  mode: 'all' | 'wrong' | 'easy-wrong' | 'topic';
  topicFilter?: string;
  timeSpent: number;
}

export interface QuestionRecord {
  questionId: number;
  times: number;
  correct: number;
  wrong: number;
  lastAnswer?: string;
  lastTime?: string;
}

export interface QuizState {
  currentIndex: number;
  selectedAnswers: string[];
  isConfirmed: boolean;
  isCorrect: boolean | null;
  startTime: number;
  answers: Map<number, { selected: string[]; correct: boolean }>;
}