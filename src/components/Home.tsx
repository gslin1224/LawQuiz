import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Question } from '@/types/quiz';
import { useQuizStorage, getTopics, getDifficulties, filterQuestions } from '@/hooks/useQuizStorage';
import { BookOpen, Target, AlertTriangle, Play, Clock, TrendingUp, Sparkles, Zap, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeProps {
  questions: Question[];
  onStartQuiz: (mode: 'all' | 'wrong' | 'easy-wrong' | 'topic', filteredQuestions: Question[], topic?: string) => void;
}

export function Home({ questions, onStartQuiz }: HomeProps) {
  const [mode, setMode] = useState<'all' | 'wrong' | 'easy-wrong' | 'topic'>('all');
  const [topic, setTopic] = useState('全部');
  const [difficulty, setDifficulty] = useState('全部');
  const [questionType, setQuestionType] = useState('全部');
  const [customCount, setCustomCount] = useState('100');
  const { records, getWrongQuestions, getEasyWrongQuestions } = useQuizStorage();

  const topics = getTopics(questions);
  const difficulties = getDifficulties();

  const wrongCount = getWrongQuestions(questions).length;
  const easyWrongCount = getEasyWrongQuestions(questions).length;

  const filteredQuestions = filterQuestions(questions, topic, difficulty, questionType);

  const handleStart = () => {
    let questionsToUse = questions;
    let actualTopic: string | undefined;

    switch (mode) {
      case 'wrong':
        questionsToUse = getWrongQuestions(questions);
        break;
      case 'easy-wrong':
        questionsToUse = getEasyWrongQuestions(questions);
        break;
      case 'topic':
        questionsToUse = filteredQuestions;
        actualTopic = topic;
        break;
      case 'all':
        const count = parseInt(customCount, 10);
        if (count > 0 && count < questions.length) {
          questionsToUse = questions.slice(0, count);
        }
        break;
    }

    if (questionsToUse.length === 0) {
      alert('沒有題目可以練習');
      return;
    }

    onStartQuiz(mode, questionsToUse, actualTopic);
  };

  const modeCards = [
    { key: 'all', icon: BookOpen, label: '全部題目', desc: '刷完所有題目', color: 'from-blue-500 to-blue-600' },
    { key: 'wrong', icon: AlertTriangle, label: '錯題練習', desc: '只練答錯的題目', color: 'from-orange-500 to-orange-600' },
    { key: 'easy-wrong', icon: TrendingUp, label: '易錯題', desc: '錯2次以上的題目', color: 'from-purple-500 to-purple-600' },
    { key: 'topic', icon: Target, label: '主題篩選', desc: '自訂範圍練習', color: 'from-emerald-500 to-emerald-600' },
  ] as const;

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            目標：考 120 分
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="gradient-text">LawQuiz</span>
          </h1>
          <p className="text-xl text-muted-foreground">資訊與法律課考前刷題</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up animate-delay-100">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20"
            onClick={() => setMode('all')}>
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-muted-foreground mt-1">總題數</div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-orange-200"
            onClick={() => setMode('wrong')}>
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-600">{wrongCount}</div>
              <div className="text-sm text-muted-foreground mt-1">錯題數</div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-purple-200"
            onClick={() => setMode('easy-wrong')}>
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600">{easyWrongCount}</div>
              <div className="text-sm text-muted-foreground mt-1">易錯題</div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-emerald-200"
            onClick={() => setMode('topic')}>
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">{filteredQuestions.length}</div>
              <div className="text-sm text-muted-foreground mt-1">篩選題數</div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Selection */}
        <Card className="shadow-lg animate-slide-up animate-delay-200">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              選擇練習模式
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {modeCards.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setMode(item.key)}
                  className={cn(
                    "relative p-5 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg",
                    mode === item.key
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30 bg-card"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                    `bg-gradient-to-br ${item.color}`
                  )}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.desc}</div>
                  {mode === item.key && (
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Count for All Mode */}
            {mode === 'all' && (
              <div className="space-y-4 pt-6 border-t animate-scale-in">
                <div className="flex items-center justify-center gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">做題數量</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={questions.length}
                        value={customCount}
                        onChange={(e) => setCustomCount(e.target.value)}
                        className="w-24 h-11 text-center text-lg font-semibold"
                      />
                      <span className="text-muted-foreground">/ {questions.length} 題</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomCount('50')}
                      className={customCount === '50' ? 'border-primary' : ''}
                    >
                      50
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomCount('100')}
                      className={customCount === '100' ? 'border-primary' : ''}
                    >
                      100
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomCount(String(questions.length))}
                      className={customCount === String(questions.length) ? 'border-primary' : ''}
                    >
                      全部
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            {mode === 'topic' && (
              <div className="space-y-4 pt-6 border-t animate-scale-in">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">主題</label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">難易度</label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">題型</label>
                    <Select value={questionType} onValueChange={setQuestionType}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全部">全部</SelectItem>
                        <SelectItem value="single">單選</SelectItem>
                        <SelectItem value="multiple">多選</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="font-medium">篩選後：{filteredQuestions.length} 題</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full h-14 text-lg font-semibold shadow-xl gradient-primary hover:opacity-90 transition-opacity animate-slide-up animate-delay-300"
        >
          <Play className="w-5 h-5 mr-2" />
          開始練習
        </Button>

        {/* Recent Records */}
        {records.length > 0 && (
          <Card className="shadow-lg animate-slide-up animate-delay-400">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                最近練習
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">
                      {record.mode === 'all' ? '全部題目' :
                       record.mode === 'wrong' ? '錯題練習' :
                       record.mode === 'easy-wrong' ? '易錯題練習' :
                       `${record.topicFilter} 練習`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleString('zh-TW')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {record.correctCount}/{record.totalQuestions}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((record.correctCount / record.totalQuestions) * 100)}%
                      </div>
                    </div>
                    {record.correctCount === record.totalQuestions ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}