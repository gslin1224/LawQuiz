import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz';
import { CheckCircle, BookOpen, Search, ChevronDown, ChevronUp, X, List, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionReviewProps {
  questions: Question[];
  onClose: () => void;
}

export function QuestionReview({ questions, onClose }: QuestionReviewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set(questions.map(q => q.id)));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter(q => {
    if (searchTerm && !q.question.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(questions.map(q => q.id)));
  const collapseAll = () => setExpandedIds(new Set());

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case '容易': return 'easy';
      case '適中': return 'medium';
      case '困難': return 'hard';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-background">
      <div className="sticky top-16 z-20 glass border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="ghost" size="sm" className="gap-2">
              <X className="w-4 h-4" />
              關閉
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <List className="w-4 h-4" />
              共 {filteredQuestions.length} 題
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={expandAll} variant="outline" size="sm" className="gap-1.5">
              <ChevronsUpDown className="w-4 h-4" />
              展開全部
            </Button>
            <Button onClick={collapseAll} variant="outline" size="sm" className="gap-1.5">
              <ChevronUp className="w-4 h-4" />
              收合全部
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜尋題目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">題目總覽</h1>
          <p className="text-muted-foreground">含答案與詳解</p>
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <Card
              key={q.id}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-md",
                expandedIds.has(q.id) && "ring-2 ring-primary"
              )}
              onClick={() => toggleExpanded(q.id)}
            >
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-sm font-medium text-muted-foreground shrink-0">
                      {idx + 1}.
                    </span>
                    <CardTitle className="text-base font-normal leading-relaxed">
                      {q.question}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={q.type === 'multiple' ? 'secondary' : 'outline'} className="text-xs">
                      {q.type === 'multiple' ? '多選' : '單選'}
                    </Badge>
                    <Badge variant={getDifficultyVariant(q.difficulty)} className="text-xs">
                      {q.difficulty}
                    </Badge>
                    {expandedIds.has(q.id) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedIds.has(q.id) && (
                <CardContent className="px-4 pb-4 space-y-4 animate-scale-in">
                  <div className="space-y-2">
                    {q.options.map((option, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isAnswer = q.answer.includes(letter);
                      return (
                        <div
                          key={letter}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg text-sm",
                            isAnswer
                              ? "bg-green-50 border border-green-200 text-green-900"
                              : "bg-muted/50"
                          )}
                        >
                          <span className="font-bold w-6">{letter}.</span>
                          <span className="flex-1">{option.substring(3)}</span>
                          {isAnswer && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="font-semibold">答案：{q.answer}</span>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {q.explanation}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3" />
                    <span>主題：{q.topic}</span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            找不到符合搜尋條件的題目
          </div>
        )}
      </div>
    </div>
  );
}