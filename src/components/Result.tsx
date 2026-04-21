import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz';
import { formatTime } from '@/lib/utils';
import { Home, RotateCcw, Clock, AlertTriangle, Trophy, Star, Target, Zap, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultProps {
  totalQuestions: number;
  correctCount: number;
  wrongIds: number[];
  questions: Question[];
  timeSpent: number;
  onRestart: () => void;
  onBackHome: () => void;
  onReviewWrong: () => void;
}

export function Result({
  totalQuestions,
  correctCount,
  wrongIds,
  questions,
  timeSpent,
  onRestart,
  onBackHome,
  onReviewWrong,
}: ResultProps) {
  const wrongQuestions = questions.filter(q => wrongIds.includes(q.id));
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const isPerfect = correctCount === totalQuestions;

  const getGrade = () => {
    if (accuracy >= 95) return { text: 'S', color: 'from-yellow-400 via-orange-500 to-red-500', bg: 'bg-gradient-to-br from-yellow-100 to-orange-100', textColor: 'text-orange-600' };
    if (accuracy >= 90) return { text: 'A+', color: 'from-green-500 to-emerald-500', bg: 'bg-gradient-to-br from-green-100 to-emerald-100', textColor: 'text-green-600' };
    if (accuracy >= 80) return { text: 'A', color: 'from-green-400 to-teal-500', bg: 'bg-gradient-to-br from-green-50 to-teal-50', textColor: 'text-green-500' };
    if (accuracy >= 70) return { text: 'B', color: 'from-blue-500 to-cyan-500', bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', textColor: 'text-blue-500' };
    if (accuracy >= 60) return { text: 'C', color: 'from-yellow-500 to-amber-500', bg: 'bg-gradient-to-br from-yellow-50 to-amber-50', textColor: 'text-yellow-600' };
    return { text: 'D', color: 'from-red-500 to-rose-500', bg: 'bg-gradient-to-br from-red-50 to-rose-50', textColor: 'text-red-500' };
  };

  const grade = getGrade();

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Result Header */}
        <Card className="shadow-2xl overflow-hidden">
          <div className={cn("h-2", grade.color)} />
          <CardHeader className="text-center pb-2 pt-10">
            <div className="mb-6">
              {isPerfect ? (
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl animate-pulse">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              ) : accuracy >= 80 ? (
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl">
                  <Star className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-2xl">
                  <Target className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              {isPerfect ? '滿分！太棒了！' : accuracy >= 80 ? '表現優異！' : '再接再厲！'}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              目標：考 120 分
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className={cn(
                "w-40 h-40 rounded-full flex items-center justify-center text-6xl font-black shadow-2xl animate-scale-in",
                grade.bg,
                grade.textColor
              )}>
                {grade.text}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-green-100">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-muted-foreground mt-2">答對</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-4xl font-bold text-red-600">{wrongIds.length}</div>
                <div className="text-sm text-muted-foreground mt-2">答錯</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-muted-foreground mt-2">正確率</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>答題進度</span>
                <span>{correctCount} / {totalQuestions}</span>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", grade.color)}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-lg">
              <Clock className="w-5 h-5" />
              <span>總用時：{formatTime(timeSpent)}</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button onClick={onRestart} size="lg" className="h-14 text-lg shadow-xl gradient-primary hover:opacity-90">
                <RotateCcw className="w-5 h-5 mr-2" />
                再刷一次
              </Button>
              <Button onClick={onBackHome} variant="outline" size="lg" className="h-14 text-lg shadow-md">
                <Home className="w-5 h-5 mr-2" />
                回首頁
              </Button>
            </div>
            {wrongIds.length > 0 && (
              <Button onClick={onReviewWrong} size="lg" className="w-full h-14 text-lg shadow-xl bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
                <AlertTriangle className="w-5 h-5 mr-2" />
                練習錯題 ({wrongIds.length} 題)
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Wrong Questions List */}
        {wrongQuestions.length > 0 && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                錯題列表 ({wrongQuestions.length} 題)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {wrongQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border bg-gradient-to-r from-red-50/50 to-orange-50/50 hover:from-red-50 hover:to-orange-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-red-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">{q.question}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge variant="destructive" className="text-xs">
                          答案：{q.answer}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {q.topic}
                        </Badge>
                        <Badge variant={q.difficulty === '容易' ? 'easy' : q.difficulty === '適中' ? 'medium' : 'hard'} className="text-xs">
                          {q.difficulty}
                        </Badge>
                      </div>
                    </div>
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