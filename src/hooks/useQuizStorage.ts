import { useState, useEffect, useCallback } from 'react';
import { Question, QuizRecord, QuestionRecord } from '@/types/quiz';

const QUIZ_RECORDS_KEY = 'quiz_records';
const QUESTION_RECORDS_KEY = 'question_records';

export function useQuizStorage() {
  const [records, setRecords] = useState<QuizRecord[]>([]);
  const [questionRecords, setQuestionRecords] = useState<Map<number, QuestionRecord>>(new Map());

  useEffect(() => {
    const savedRecords = localStorage.getItem(QUIZ_RECORDS_KEY);
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }

    const savedQuestionRecords = localStorage.getItem(QUESTION_RECORDS_KEY);
    if (savedQuestionRecords) {
      const parsed = JSON.parse(savedQuestionRecords);
      setQuestionRecords(new Map(Object.entries(parsed).map(([k, v]) => [Number(k), v as QuestionRecord])));
    }
  }, []);

  const saveRecord = useCallback((record: QuizRecord) => {
    const newRecords = [record, ...records].slice(0, 50);
    setRecords(newRecords);
    localStorage.setItem(QUIZ_RECORDS_KEY, JSON.stringify(newRecords));
  }, [records]);

  const updateQuestionRecord = useCallback((questionId: number, correct: boolean) => {
    const existing = questionRecords.get(questionId) || {
      questionId,
      times: 0,
      correct: 0,
      wrong: 0,
    };

    const updated: QuestionRecord = {
      ...existing,
      times: existing.times + 1,
      correct: existing.correct + (correct ? 1 : 0),
      wrong: existing.wrong + (correct ? 0 : 1),
      lastTime: new Date().toISOString(),
    };

    const newMap = new Map(questionRecords);
    newMap.set(questionId, updated);
    setQuestionRecords(newMap);
    localStorage.setItem(QUESTION_RECORDS_KEY, JSON.stringify(Object.fromEntries(newMap)));
  }, [questionRecords]);

  const getWrongQuestions = useCallback((questions: Question[]): Question[] => {
    return questions.filter(q => {
      const record = questionRecords.get(q.id);
      return record && record.wrong > 0;
    });
  }, [questionRecords]);

  const getEasyWrongQuestions = useCallback((questions: Question[]): Question[] => {
    return questions.filter(q => {
      const record = questionRecords.get(q.id);
      return record && record.wrong >= 2;
    });
  }, [questionRecords]);

  const clearAllRecords = useCallback(() => {
    setRecords([]);
    setQuestionRecords(new Map());
    localStorage.removeItem(QUIZ_RECORDS_KEY);
    localStorage.removeItem(QUESTION_RECORDS_KEY);
  }, []);

  return {
    records,
    questionRecords,
    saveRecord,
    updateQuestionRecord,
    getWrongQuestions,
    getEasyWrongQuestions,
    clearAllRecords,
  };
}

export function getTopics(questions: Question[]): string[] {
  const topics = new Set(questions.map(q => q.topic));
  return ['全部', ...Array.from(topics).sort()];
}

export function getDifficulties(): string[] {
  return ['全部', '容易', '適中', '困難'];
}

export function filterQuestions(
  questions: Question[],
  topic: string,
  difficulty: string,
  type: string
): Question[] {
  return questions.filter(q => {
    if (topic !== '全部' && q.topic !== topic) return false;
    if (difficulty !== '全部' && q.difficulty !== difficulty) return false;
    if (type !== '全部' && q.type !== type) return false;
    return true;
  });
}