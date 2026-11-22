import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Compass,
  Copy,
  Download,
  Flag,
  Pencil,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Target,
  Users,
  X,
} from 'lucide-react';
import {
  GENRE_OPTIONS,
  countWords,
  formatQuestAsText,
} from '../types/quest';
import type { GeneratedQuest } from '../types/quest';
import { exportQuestToPdf } from '../utils/pdfExport';

interface StoryCardProps {
  quests: GeneratedQuest[];
  activeQuestId: string | null;
  onSelectQuest: (id: string) => void;
  isGenerating: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onRegenerate: () => void;
  onChangeGenreAndRegenerate: (genre: string) => void;
  onUpdateQuest: (updated: GeneratedQuest) => void;
}

const LOADING_STEPS = [
  'Вибудовуємо інтригу сюжету...',
  'Адаптуємо історію під вік учнів...',
  'Формуємо роль команди та виклик...',
];

export function StoryCard({
  quests,
  activeQuestId,
  onSelectQuest,
  isGenerating,
  errorMessage,
  onRetry,
  onRegenerate,
  onChangeGenreAndRegenerate,
  onUpdateQuest,
}: StoryCardProps) {
  const activeQuest =
    quests.find((q) => q.id === activeQuestId) ?? quests[0] ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [genreDrawerOpen, setGenreDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const [draft, setDraft] = useState<GeneratedQuest | null>(null);

  useEffect(() => {
    setIsEditing(false);
    setGenreDrawerOpen(false);
    setPdfError(null);
    setDraft(activeQuest);
  }, [activeQuest?.id]);

  useEffect(() => {
    if (!isGenerating) {
      setLoadingStepIdx(0);
      return;
    }
    const timer = window.setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const handleCopy = async () => {
    if (!activeQuest) return;
    const text = formatQuestAsText(activeQuest);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleDownloadPdf = async () => {
    if (!activeQuest || isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfError(null);
    try {
      await exportQuestToPdf(activeQuest);
    } catch (err) {
      console.error('PDF export failed:', err);
      setPdfError('Не вдалося сформувати PDF. Спробуйте ще раз.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveEdit = () => {
    if (!draft) return;
    onUpdateQuest({
      ...draft,
      missionTitle: draft.missionTitle.trim() || activeQuest!.missionTitle,
      backstory: draft.backstory.trim() || activeQuest!.backstory,
      teamRole: draft.teamRole.trim() || activeQuest!.teamRole,
      mainChallenge: draft.mainChallenge.trim() || activeQuest!.mainChallenge,
      missionStart: draft.missionStart.trim() || activeQuest!.missionStart,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraft(activeQuest);
    setIsEditing(false);
  };

  // Loading state
  if (isGenerating) {
    return (
      <div
        aria-live="polite"
        className="bg-white rounded-2xl border border-sky-200/90 shadow-[0_6px_28px_-6px_rgba(15,41,77,0.08)] p-6 sm:p-8 flex flex-col justify-between min-h-[540px]"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-sky-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                <Compass
                  className="w-5 h-5 text-blue-700 animate-spin"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-display font-bold text-[#0F294D]">
                  {LOADING_STEPS[loadingStepIdx]}
                </p>
                <p className="text-xs text-slate-500">
                  Конструктор створює унікальну сюжетну передісторію для вашого класу
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-48 bg-sky-100 rounded" />
            <div className="h-9 w-3/4 bg-sky-100 rounded-lg" />
            <div className="space-y-2.5 pt-2">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-11/12 bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-4/5 bg-slate-100 rounded" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="h-28 bg-sky-50/90 border border-sky-100 rounded-xl" />
              <div className="h-28 bg-sky-50/90 border border-sky-100 rounded-xl" />
            </div>

            <div className="h-24 bg-[#0F294D]/10 rounded-xl" />
          </div>
        </div>

        <p className="text-xs text-slate-500 pt-6">
          Зазвичай це займає 3–6 секунд.
        </p>
      </div>
    );
  }

  // Error state (when no story is currently shown or retry requested)
  if (errorMessage && !activeQuest) {
    return (
      <div
        role="alert"
        className="bg-white rounded-2xl border border-red-200 shadow-[0_6px_28px_-6px_rgba(15,41,77,0.08)] p-6 sm:p-8 flex flex-col items-start justify-center min-h-[420px] space-y-5"
      >
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-700" aria-hidden="true" />
        </div>
        <div className="space-y-2 max-w-lg">
          <h3 className="font-display text-xl font-bold text-[#0F294D]">
            Не вдалося згенерувати історію
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {errorMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0F294D] text-white text-sm font-semibold hover:bg-[#173B6D] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Спробувати ще раз</span>
        </button>
      </div>
    );
  }

  // Empty state before first generation
  if (!activeQuest) {
    return (
      <div className="bg-white rounded-2xl border border-sky-200/90 shadow-[0_6px_28px_-6px_rgba(15,41,77,0.08)] overflow-hidden flex flex-col justify-between min-h-[540px]">
        <div className="relative bg-gradient-to-b from-sky-50 to-white border-b border-sky-100">
          {!imageFailed ? (
            <img
              src="/src/assets/images/quest_adventure_hero_1795303699162.jpg"
              alt="Ілюстрація відкритої книги з компасом і паперовими літачками — символ освітнього квесту"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="w-full h-56 sm:h-64 object-cover"
            />
          ) : (
            <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-sky-100 via-blue-50 to-white flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Compass className="w-12 h-12 text-[#0F294D]" aria-hidden="true" />
              <span className="font-display font-bold text-[#0F294D]">
                Сюжетна картка квесту
              </span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-display text-2xl font-bold text-[#0F294D]">
              Тут зʼявиться сюжетна передісторія вашого уроку
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Оберіть предмет, клас і тему ліворуч та натисніть{' '}
              <strong className="text-[#0F294D]">«ЗГЕНЕРУВАТИ ІСТОРІЮ»</strong>.
              Ви отримаєте готову завʼязку, яку можна зачитати класу на початку уроку,
              відредагувати, скопіювати або зберегти у PDF.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-sky-100">
            <div>
              <p className="font-display text-sm font-bold text-[#0F294D]">
                01. Інтрига та сюжет
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                120–180 слів живої історії без шаблонних шкільних фраз.
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-[#0F294D]">
                02. Роль та виклик
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Учні стають дослідниками, детективами чи науковцями місії.
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-[#0F294D]">
                03. Старт уроку
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Мотивуючий заклик, який природно веде до ваших завдань.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wordCount = countWords(activeQuest.backstory);

  return (
    <article
      aria-live="polite"
      className="bg-white rounded-2xl border border-sky-200/90 shadow-[0_6px_28px_-6px_rgba(15,41,77,0.08)] p-5 sm:p-8 space-y-6 transition-opacity duration-200"
    >
      {/* Inline error banner if regeneration failed while previous story exists */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle
              className="w-4 h-4 text-red-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-semibold text-red-800 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Повторити
          </button>
        </div>
      )}

      {/* Session variants switcher if teacher generated multiple versions */}
      {quests.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100">
          <span className="text-xs font-medium text-slate-500">
            Згенеровані варіанти у цій сесії:
          </span>
          <div className="flex items-center gap-1 p-1 bg-[#F4F8FD] rounded-lg border border-sky-100">
            {quests.map((q, index) => {
              const isSelected = q.id === activeQuest.id;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onSelectQuest(q.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#0F294D] shadow-sm'
                      : 'text-slate-600 hover:text-[#0F294D]'
                  }`}
                >
                  Варіант {quests.length - index}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Unboxed clean metadata header (zero-pill discipline) */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-medium text-slate-500">
          <span className="text-blue-700 font-semibold">{activeQuest.subject}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{activeQuest.grade} клас</span>
          <span aria-hidden="true">·</span>
          <span>{activeQuest.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{activeQuest.atmosphere}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{wordCount} слів</span>
        </div>
        <p className="text-xs text-slate-500">
          Тема уроку: <span className="text-slate-700 font-medium">{activeQuest.topic}</span>
        </p>
      </div>

      {/* Mission Title */}
      <div className="space-y-1.5 pt-1">
        <p className="text-xs font-bold tracking-wider uppercase text-blue-700">
          Назва місії
        </p>
        {isEditing && draft ? (
          <input
            type="text"
            aria-label="Назва місії"
            value={draft.missionTitle}
            onChange={(e) =>
              setDraft({ ...draft, missionTitle: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-[#F8FBFF] font-display text-xl sm:text-2xl font-extrabold text-[#0F294D] focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
          />
        ) : (
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F294D] leading-tight text-balance">
            {activeQuest.missionTitle}
          </h3>
        )}
      </div>

      {/* Story Backstory */}
      <div className="space-y-2 pt-2 border-t border-sky-100">
        <p className="text-xs font-bold tracking-wider uppercase text-blue-700">
          Сюжетна передісторія
        </p>
        {isEditing && draft ? (
          <textarea
            aria-label="Сюжетна передісторія"
            rows={7}
            value={draft.backstory}
            onChange={(e) => setDraft({ ...draft, backstory: e.target.value })}
            className="w-full px-3.5 py-3 rounded-xl border border-blue-300 bg-[#F8FBFF] text-slate-800 text-base leading-relaxed focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
          />
        ) : (
          <div className="text-slate-800 text-[15.5px] sm:text-base leading-[1.72] whitespace-pre-line">
            {activeQuest.backstory}
          </div>
        )}
      </div>

      {/* Team Role + Main Challenge (2-column structural grid, no thick left borders) */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#F0F6FF] border border-sky-200/80 p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-800">
            <Users className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Ваша роль
            </span>
          </div>
          {isEditing && draft ? (
            <textarea
              aria-label="Ваша роль"
              rows={3}
              value={draft.teamRole}
              onChange={(e) => setDraft({ ...draft, teamRole: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white text-sm text-[#0F294D] leading-relaxed focus:border-blue-700 focus:outline-none"
            />
          ) : (
            <p className="text-sm sm:text-[15px] text-[#0F294D] leading-relaxed">
              {activeQuest.teamRole}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-[#F0F6FF] border border-sky-200/80 p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-800">
            <Target className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Головний виклик
            </span>
          </div>
          {isEditing && draft ? (
            <textarea
              aria-label="Головний виклик"
              rows={3}
              value={draft.mainChallenge}
              onChange={(e) =>
                setDraft({ ...draft, mainChallenge: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white text-sm text-[#0F294D] leading-relaxed focus:border-blue-700 focus:outline-none"
            />
          ) : (
            <p className="text-sm sm:text-[15px] text-[#0F294D] leading-relaxed">
              {activeQuest.mainChallenge}
            </p>
          )}
        </div>
      </div>

      {/* Mission Start Banner */}
      <div className="rounded-xl bg-[#0F294D] text-white p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 text-sky-300">
          <Flag className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Старт місії — звернення до учнів
          </span>
        </div>
        {isEditing && draft ? (
          <textarea
            aria-label="Старт місії"
            rows={2}
            value={draft.missionStart}
            onChange={(e) =>
              setDraft({ ...draft, missionStart: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-sky-400 bg-white/10 text-white text-sm sm:text-base leading-relaxed focus:bg-white/15 focus:outline-none"
          />
        ) : (
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
            {activeQuest.missionStart}
          </p>
        )}
      </div>

      {/* Edit Mode Save/Cancel Controls */}
      {isEditing && (
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl border border-sky-200 text-slate-700 text-sm font-semibold hover:bg-sky-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Скасувати</span>
          </button>
          <button
            type="button"
            onClick={handleSaveEdit}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Зберегти зміни</span>
          </button>
        </div>
      )}

      {/* Inline Genre Switcher Drawer */}
      {genreDrawerOpen && !isEditing && (
        <div className="rounded-xl bg-[#F4F8FD] border border-sky-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#0F294D]">
              Оберіть новий жанр для перегенерації історії:
            </span>
            <button
              type="button"
              onClick={() => setGenreDrawerOpen(false)}
              aria-label="Закрити вибір жанру"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F294D] hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => {
              const isCurrent = activeQuest.genre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {
                    setGenreDrawerOpen(false);
                    onChangeGenreAndRegenerate(genre);
                  }}
                  className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0F294D] text-white'
                      : 'bg-white text-slate-700 border border-sky-200 hover:border-blue-500 hover:text-[#0F294D]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pdfError && (
        <p role="alert" className="text-sm text-red-700 font-medium">
          {pdfError}
        </p>
      )}

      {/* Action Buttons Toolbar — all 5 requested buttons */}
      {!isEditing && (
        <div className="pt-4 border-t border-sky-100 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0F294D] text-white text-sm font-semibold hover:bg-[#173B6D] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Згенерувати іншу історію</span>
          </button>

          <button
            type="button"
            onClick={() => setGenreDrawerOpen((prev) => !prev)}
            aria-expanded={genreDrawerOpen}
            className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
              genreDrawerOpen
                ? 'bg-sky-100 border-blue-400 text-[#0F294D]'
                : 'bg-white border-sky-200 text-[#0F294D] hover:bg-sky-50 hover:border-blue-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Змінити жанр</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-sky-200 bg-white text-[#0F294D] text-sm font-semibold hover:bg-sky-50 hover:border-blue-300 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span className="text-emerald-800">Скопійовано!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Скопіювати текст</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-sky-200 bg-white text-[#0F294D] text-sm font-semibold hover:bg-sky-50 hover:border-blue-300 disabled:opacity-60 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {isExportingPdf ? 'Формуємо PDF...' : 'Завантажити у PDF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDraft(activeQuest);
              setIsEditing(true);
              setGenreDrawerOpen(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-sky-200 bg-white text-[#0F294D] text-sm font-semibold hover:bg-sky-50 hover:border-blue-300 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Редагувати текст</span>
          </button>
        </div>
      )}
    </article>
  );
}
