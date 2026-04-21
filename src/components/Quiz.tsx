import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import { CheckCircle, XCircle, Home, Clock, Target, BookOpen, Brain, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onFinish: () => void;
  onAnswer: (questionId: number, correct: boolean) => void;
  onComplete: (correctCount: number, wrongIds: number[], timeSpent: number) => void;
}

export function Quiz({ questions, onFinish, onAnswer, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answerParts = currentQuestion.answer.includes(',')
    ? currentQuestion.answer.split(',')
    : currentQuestion.answer.split('');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleSingleSelect = useCallback((value: string) => {
    if (isConfirmed) return;
    setSelectedAnswers([value]);
  }, [isConfirmed]);

  const handleMultiSelect = useCallback((value: string) => {
    if (isConfirmed) return;
    setSelectedAnswers(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      return [...prev, value];
    });
  }, [isConfirmed]);

  const confirmAnswer = useCallback(() => {
    if (selectedAnswers.length === 0) return;

    const answerParts = currentQuestion.answer.includes(',')
      ? currentQuestion.answer.split(',')
      : currentQuestion.answer.split('');
    const correctAnswer = answerParts.sort().join(',');
    const selected = selectedAnswers.sort().join(',');
    const correct = correctAnswer === selected;

    setIsCorrect(correct);
    setIsConfirmed(true);
    onAnswer(currentQuestion.id, correct);

    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongIds(prev => [...prev, currentQuestion.id]);
    }
  }, [currentQuestion, selectedAnswers, onAnswer]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setIsConfirmed(false);
      setIsCorrect(null);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete(correctCount + (isCorrect ? 0 : 0), wrongIds, timeSpent);
    }
  }, [currentIndex, questions.length, currentQuestion.id, correctCount, wrongIds, isCorrect, startTime, onComplete]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswers([]);
      setIsConfirmed(false);
      setIsCorrect(null);
    }
  }, [currentIndex]);

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case '容易': return 'easy';
      case '適中': return 'medium';
      case '困難': return 'hard';
      default: return 'secondary';
    }
  };

  const getOptionClass = (optionLetter: string) => {
    if (!isConfirmed) {
      const isSelected = selectedAnswers.includes(optionLetter);
      return cn(
        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      );
    }

    const isSelected = selectedAnswers.includes(optionLetter);
    const isAnswer = answerParts.includes(optionLetter);

    if (isAnswer) {
      return "flex items-center gap-4 p-4 rounded-xl border-2 border-green-500 bg-green-100 text-green-900 shadow-sm font-medium";
    }
    if (isSelected && !isAnswer) {
      return "flex items-center gap-4 p-4 rounded-xl border-2 border-red-500 bg-red-100 text-red-900 shadow-sm font-medium";
    }
    return "flex items-center gap-4 p-4 rounded-xl border-2 border-muted-foreground/20 bg-muted/50 text-muted-foreground opacity-60";
  };

  return (
    <div className="bg-background">
      {/* Top Bar */}
      <div className="sticky top-16 z-20 glass border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button onClick={onFinish} variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                離開
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                {currentIndex + 1} / {questions.length}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(elapsed)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3">
                <Target className="w-3.5 h-3.5" />
                {correctCount} 對
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Question Card */}
          <div className="md:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl leading-relaxed font-semibold">
                    {currentQuestion.question}
                  </CardTitle>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Badge variant={currentQuestion.type === 'multiple' ? 'secondary' : 'outline'}>
                      {currentQuestion.type === 'multiple' ? '多選' : '單選'}
                    </Badge>
                    <Badge variant={getDifficultyVariant(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4" />
                  {currentQuestion.topic}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Options */}
                {currentQuestion.type === 'multiple' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">可複選，選完後按確認</div>
                    {currentQuestion.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      return (
                        <div
                          key={letter}
                          onClick={() => handleMultiSelect(letter)}
                          className={getOptionClass(letter)}
                        >
                          <Checkbox
                            checked={selectedAnswers.includes(letter)}
                            disabled={isConfirmed}
                            className="shrink-0"
                          />
                          <span className="font-bold text-lg shrink-0 w-8">{letter}.</span>
                          <span className="text-sm flex-1">{option.substring(3)}</span>
                          {isConfirmed && answerParts.includes(letter) && (
                            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                          )}
                          {isConfirmed && selectedAnswers.includes(letter) && !answerParts.includes(letter) && (
                            <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAnswers[0] || ''}
                    onValueChange={handleSingleSelect}
                    disabled={isConfirmed}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      return (
                        <div
                          key={letter}
                          onClick={() => handleSingleSelect(letter)}
                          className={getOptionClass(letter)}
                        >
                          <RadioGroupItem value={letter} className="shrink-0" />
                          <span className="font-bold text-lg shrink-0 w-8">{letter}.</span>
                          <span className="text-sm flex-1">{option.substring(3)}</span>
                          {isConfirmed && answerParts.includes(letter) && (
                            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                          )}
                          {isConfirmed && selectedAnswers.includes(letter) && !answerParts.includes(letter) && (
                            <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}

                {/* Result Feedback */}
                {isConfirmed && (
                  <div className={cn(
                    "p-5 rounded-xl border-2 animate-scale-in",
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  )}>
                    <div className="flex items-center gap-3 font-bold text-lg mb-2">
                      {isCorrect ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-green-800">答對了！</span>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-red-800">答錯了</span>
                        </>
                      )}
                    </div>
                    {!isCorrect && (
                      <p className="text-sm text-red-700 font-medium ml-13">
                        正確答案：<span className="font-bold">{currentQuestion.answer}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {isConfirmed && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="explanation" className="border-0">
                      <AccordionTrigger className="bg-muted/50 rounded-xl px-4 hover:no-underline hover:bg-muted/70 transition-colors">
                        <span className="flex items-center gap-2 font-medium">
                          <Brain className="w-4 h-4 text-primary" />
                          查看詳解
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 text-sm leading-relaxed text-muted-foreground bg-muted/30 rounded-b-xl">
                          {currentQuestion.explanation}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一題
                  </Button>
                  {!isConfirmed ? (
                    <Button
                      onClick={confirmAnswer}
                      disabled={selectedAnswers.length === 0}
                      className="gradient-primary shadow-lg hover:opacity-90"
                      size="lg"
                    >
                      確認答案
                    </Button>
                  ) : (
                    <Button
                      onClick={nextQuestion}
                      className="gradient-primary shadow-lg hover:opacity-90"
                      size="lg"
                    >
                      {currentIndex < questions.length - 1 ? (
                        <>下一題 <ChevronRight className="w-4 h-4 ml-1" /></>
                      ) : (
                        <>完成練習</>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="hidden md:block">
            <Card className="shadow-lg sticky top-40">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">題目導航</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-1.5">
                  {questions.map((q, idx) => {
                    const isAnswered = idx < currentIndex || (idx === currentIndex && isConfirmed);
                    const isCurrent = idx === currentIndex;
                    const isWrong = wrongIds.includes(q.id);

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setSelectedAnswers([]);
                          setIsConfirmed(false);
                          setIsCorrect(null);
                        }}
                        className={cn(
                          "w-8 h-8 rounded-md text-xs font-medium transition-all",
                          isCurrent
                            ? "bg-primary text-primary-foreground shadow-md"
                            : isAnswered
                              ? isWrong
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-100" />
                    <span>答對</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-100" />
                    <span>答錯</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-muted" />
                    <span>未答</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}