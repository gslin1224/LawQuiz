import { Heart, Linkedin, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg">LawQuiz 刷題系統</p>
            <p className="text-sm text-muted-foreground">
              目標：考 120 分！
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>作者：林冠勳（Kuan-Hsun Lin）</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">國立臺北護理健康大學</span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/khlin-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://orcid.org/0009-0002-8058-073X"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-red-500" /> by 林冠勳
          </p>
        </div>
      </div>
    </footer>
  );
}