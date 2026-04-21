import { Button } from '@/components/ui/button';
import { Moon, Sun, Home, History, BookOpen, Menu, X, List } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  show: boolean;
  darkMode: boolean;
  onToggleDark: () => void;
  onHome: () => void;
  onHistory: () => void;
  onReview: () => void;
}

export function Navbar({ show, darkMode, onToggleDark, onHome, onHistory, onReview }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!show) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onHome}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-lg leading-tight">LawQuiz</div>
            <div className="text-xs text-muted-foreground">資訊與法律課</div>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onHome}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            首頁
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReview}
            className="gap-2"
          >
            <List className="w-4 h-4" />
            題目總覽
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onHistory}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            練習歷史
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            className="rounded-full"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 glass border-b transition-all duration-200 overflow-hidden",
          mobileOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => { onHome(); setMobileOpen(false); }}
          >
            <Home className="w-5 h-5" />
            首頁
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => { onReview(); setMobileOpen(false); }}
          >
            <List className="w-5 h-5" />
            題目總覽
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => { onHistory(); setMobileOpen(false); }}
          >
            <History className="w-5 h-5" />
            練習歷史
          </Button>
        </div>
      </div>
    </nav>
  );
}