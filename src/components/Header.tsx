import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onNewQuest: () => void;
}

export function Header({ onNewQuest }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#0F294D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
        >
          КвестМайстер
        </a>

        <nav
          aria-label="Основна навігація"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#builder"
            className="hover:text-[#0F294D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Конструктор
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#0F294D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Як це працює
          </a>
          <a
            href="#examples"
            className="hover:text-[#0F294D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Приклади для уроків
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onNewQuest}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-[#0F294D] text-white text-sm font-semibold hover:bg-[#173B6D] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Новий квест</span>
          </button>
        </div>
      </div>
    </header>
  );
}
