import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizRecord } from '@/types/quiz';
import { formatTime } from '@/lib/utils';
import { Home, Trash2, TrendingUp, Target, AlertTriangle, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryProps {
  records: QuizRecord[];
  onBack: () => void;
  onClear: () => void;
}

export function History({ records, onBack, onClear }: HistoryProps) {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'all': return <BookOpen className="w-4 h-4" />;
      case 'wrong': return <AlertTriangle className="w-4 h-4" />;
      case 'easy-wrong': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getModeText = (record: QuizRecord) => {
    switch (record.mode) {
      case 'all': return '全部題目';
      case 'wrong': return '錯題練習';
      case 'easy-wrong': return '易錯題練習';
      case 'topic': return `${record.topicFilter} 練習`;
      default: return record.mode;
    }
  };

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">練習歷史</h1>
            <p className="text-muted-foreground mt-1">共 {records.length} 筆記錄</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
              <Home className="w-4 h-4" />
              回首頁
            </Button>
            {records.length > 0 && (
              <Button onClick={onClear} variant="destructive" size="lg" className="gap-2">
                <Trash2 className="w-4 h-4" />
                清除
              </Button>
            )}
          </div>
        </div>

        {/* Records List */}
        {records.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">還沒有練習記錄</p>
              <p className="text-sm text-muted-foreground mt-1">開始刷題後就會看到歷史</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record, idx) => (
              <Card key={record.id} className={cn(
                "shadow-lg transition-all hover:shadow-xl animate-slide-up",
                record.correctCount === record.totalQuestions
                  ? "border-green-200"
                  : "border-border"
              )} style={{ animationDelay: `${idx * 50}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getModeIcon(record.mode)}
                        <span className="font-semibold text-lg">{getModeText(record)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {new Date(record.date).toLocaleString('zh-TW')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Target className="w-4 h-4" />
                          {record.totalQuestions} 題
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {formatTime(record.timeSpent)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                          {Math.round((record.correctCount / record.totalQuestions) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.correctCount}/{record.totalQuestions}
                        </div>
                      </div>
                      {record.correctCount === record.totalQuestions ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                    </div>
                  </div>
                  {record.wrongIds.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        錯 {record.wrongIds.length} 題
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {record.wrongIds.slice(0, 5).join(', ')}
                        {record.wrongIds.length > 5 && `...`}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}