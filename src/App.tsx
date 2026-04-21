import { useState, useEffect, useCallback } from 'react';
import { Question, QuizRecord } from '@/types/quiz';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import { Home } from '@/components/Home';
import { Quiz } from '@/components/Quiz';
import { Result } from '@/components/Result';
import { History } from '@/components/History';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QuestionReview } from '@/components/QuestionReview';
import { generateId } from '@/lib/utils';
import quizData from '../public/data/資訊與法律課_考前猜題_all.json';

type Screen = 'home' | 'quiz' | 'result' | 'history' | 'review';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [mode, setMode] = useState<'all' | 'wrong' | 'easy-wrong' | 'topic'>('all');
  const [topicFilter, setTopicFilter] = useState<string | undefined>();
  const [resultData, setResultData] = useState<{
    correctCount: number;
    wrongIds: number[];
    timeSpent: number;
  } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const {
    records,
    saveRecord,
    updateQuestionRecord,
    clearAllRecords,
  } = useQuizStorage();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    setQuestions(quizData.questions as Question[]);
  }, []);

  const handleStartQuiz = useCallback((newMode: 'all' | 'wrong' | 'easy-wrong' | 'topic', quizQuestions: Question[], topic?: string) => {
    setMode(newMode);
    setCurrentQuestions(quizQuestions);
    setTopicFilter(topic);
    setResultData(null);
    setScreen('quiz');
  }, []);

  const handleAnswer = useCallback((questionId: number, correct: boolean) => {
    updateQuestionRecord(questionId, correct);
  }, [updateQuestionRecord]);

  const handleComplete = useCallback((correctCount: number, wrongIds: number[], timeSpent: number) => {
    setResultData({ correctCount, wrongIds, timeSpent });

    const record: QuizRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      totalQuestions: currentQuestions.length,
      correctCount,
      wrongIds,
      mode,
      topicFilter,
      timeSpent,
    };
    saveRecord(record);

    setScreen('result');
  }, [currentQuestions.length, mode, topicFilter, saveRecord]);

  const handleRestart = useCallback(() => {
    const shuffled = [...currentQuestions].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    setResultData(null);
    setScreen('quiz');
  }, [currentQuestions]);

  const handleReviewWrong = useCallback(() => {
    if (!resultData) return;
    const wrongQuestions = currentQuestions.filter(q => resultData.wrongIds.includes(q.id));
    if (wrongQuestions.length > 0) {
      setMode('wrong');
      setCurrentQuestions(wrongQuestions);
      setResultData(null);
      setScreen('quiz');
    }
  }, [resultData, currentQuestions]);

  const handleBackHome = useCallback(() => {
    setScreen('home');
    setResultData(null);
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">載入題目中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        show={screen !== 'quiz'}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        onHome={() => setScreen('home')}
        onHistory={() => setScreen('history')}
        onReview={() => setScreen('review')}
      />
      <main className="pt-16 flex-1">
        {screen === 'home' && (
          <Home
            questions={questions}
            onStartQuiz={handleStartQuiz}
          />
        )}
        {screen === 'quiz' && (
          <Quiz
            questions={currentQuestions}
            onFinish={handleBackHome}
            onAnswer={handleAnswer}
            onComplete={handleComplete}
          />
        )}
        {screen === 'result' && resultData && (
          <Result
            totalQuestions={currentQuestions.length}
            correctCount={resultData.correctCount}
            wrongIds={resultData.wrongIds}
            questions={currentQuestions}
            timeSpent={resultData.timeSpent}
            onRestart={handleRestart}
            onBackHome={handleBackHome}
            onReviewWrong={handleReviewWrong}
          />
        )}
        {screen === 'history' && (
          <History
            records={records}
            onBack={handleBackHome}
            onClear={clearAllRecords}
          />
        )}
        {screen === 'review' && (
          <QuestionReview
            questions={questions}
            onClose={handleBackHome}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;