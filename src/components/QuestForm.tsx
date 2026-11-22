import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  ATMOSPHERE_OPTIONS,
  GENRE_OPTIONS,
  GRADE_OPTIONS,
  QUICK_EXAMPLES,
  SUBJECT_OPTIONS,
  getGradeStageLabel,
} from '../types/quest';
import type { QuestFormData, QuickExample } from '../types/quest';

interface QuestFormProps {
  formData: QuestFormData;
  onChange: (next: QuestFormData) => void;
  onSubmit: (data: QuestFormData) => void;
  isGenerating: boolean;
  validationError: string | null;
  subjectInputRef: React.RefObject<HTMLInputElement | null>;
}

export function QuestForm({
  formData,
  onChange,
  onSubmit,
  isGenerating,
  validationError,
  subjectInputRef,
}: QuestFormProps) {
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setSubjectDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSubjects = SUBJECT_OPTIONS.filter((subj) =>
    subj.toLowerCase().includes(subjectFilter.trim().toLowerCase()),
  );

  const handleSubjectSelect = (subject: string) => {
    onChange({ ...formData, subject });
    setSubjectFilter('');
    setSubjectDropdownOpen(false);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const applyQuickExample = (example: QuickExample) => {
    onChange({
      subject: example.subject,
      grade: example.grade,
      topic: example.topic,
      genre: example.genre,
      atmosphere: example.atmosphere,
    });
    setSubjectFilter('');
    setSubjectDropdownOpen(false);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="bg-white rounded-2xl border border-sky-200/90 shadow-[0_6px_28px_-6px_rgba(15,41,77,0.08)] p-5 sm:p-7 space-y-6"
    >
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0F294D]">
            Параметри навчального квесту
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Заповніть предмет, клас і тему — за бажанням оберіть жанр та атмосферу.
          </p>
        </div>
        <BookOpen
          className="w-5 h-5 text-blue-700 shrink-0 mt-1"
          aria-hidden="true"
        />
      </div>

      {/* 1. Предмет — випадаючий список із можливістю введення власного */}
      <div className="space-y-2" ref={comboboxRef}>
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="quest-subject"
            className="block text-sm font-semibold text-[#0F294D]"
          >
            Предмет <span className="text-blue-700">*</span>
          </label>
          <span className="text-xs text-slate-500">
            Оберіть або введіть свій
          </span>
        </div>

        <div className="relative">
          <input
            ref={subjectInputRef}
            id="quest-subject"
            type="text"
            role="combobox"
            aria-expanded={subjectDropdownOpen}
            aria-autocomplete="list"
            aria-controls="subject-listbox"
            value={formData.subject}
            onFocus={() => {
              setSubjectFilter('');
              setSubjectDropdownOpen(true);
            }}
            onChange={(e) => {
              const val = e.target.value;
              onChange({ ...formData, subject: val });
              setSubjectFilter(val);
              setSubjectDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSubjectDropdownOpen(false);
              }
            }}
            placeholder="Наприклад: Біологія, Історія України або власний предмет"
            className="w-full min-h-[46px] pl-4 pr-11 py-2.5 rounded-xl border border-sky-200 bg-[#F8FBFF] text-[#0F294D] placeholder:text-slate-400 text-sm sm:text-base focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
          />
          <button
            type="button"
            aria-label="Відкрити список предметів"
            onClick={() => {
              setSubjectFilter('');
              setSubjectDropdownOpen((prev) => !prev);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0F294D] hover:bg-sky-100/70 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${
                subjectDropdownOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {subjectDropdownOpen && (
            <ul
              id="subject-listbox"
              role="listbox"
              className="absolute z-20 mt-1.5 w-full max-h-60 overflow-y-auto rounded-xl border border-sky-200 bg-white shadow-lg py-1.5"
            >
              {filteredSubjects.map((subject) => {
                const isSelected = formData.subject === subject;
                return (
                  <li key={subject} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSubjectSelect(subject)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 text-blue-800 font-semibold'
                          : 'text-slate-700 hover:bg-sky-50/70 hover:text-[#0F294D]'
                      }`}
                    >
                      <span>{subject}</span>
                      {isSelected && (
                        <Check
                          className="w-4 h-4 text-blue-700 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}

              {subjectFilter.trim() &&
                !SUBJECT_OPTIONS.some(
                  (s) => s.toLowerCase() === subjectFilter.trim().toLowerCase(),
                ) && (
                  <li className="border-t border-sky-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSubjectSelect(subjectFilter.trim())}
                      className="w-full text-left px-4 py-2.5 text-sm text-blue-700 font-medium hover:bg-sky-50 transition-colors cursor-pointer"
                    >
                      Використати власний предмет: «{subjectFilter.trim()}»
                    </button>
                  </li>
                )}

              {filteredSubjects.length === 0 && !subjectFilter.trim() && (
                <li className="px-4 py-2.5 text-sm text-slate-500">
                  Введіть назву предмета у поле вище
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* 2. Клас — вибір від 1 до 11 */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span
            id="grade-label"
            className="block text-sm font-semibold text-[#0F294D]"
          >
            Клас <span className="text-blue-700">*</span>
          </span>
          <span className="text-xs font-medium text-slate-600 tabular-nums">
            {getGradeStageLabel(formData.grade)}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="grade-label"
          className="grid grid-cols-6 sm:grid-cols-11 gap-1.5"
        >
          {GRADE_OPTIONS.map((grade) => {
            const active = formData.grade === grade;
            return (
              <button
                key={grade}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`${grade} клас`}
                onClick={() => onChange({ ...formData, grade })}
                className={`min-h-[42px] rounded-lg text-sm font-semibold tabular-nums transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  active
                    ? 'bg-[#0F294D] text-white shadow-sm'
                    : 'bg-[#F4F8FD] text-slate-700 border border-sky-200/80 hover:border-blue-400 hover:text-[#0F294D]'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Тема уроку */}
      <div className="space-y-2">
        <label
          htmlFor="quest-topic"
          className="block text-sm font-semibold text-[#0F294D]"
        >
          Тема уроку <span className="text-blue-700">*</span>
        </label>
        <input
          id="quest-topic"
          type="text"
          value={formData.topic}
          onChange={(e) => onChange({ ...formData, topic: e.target.value })}
          placeholder="Наприклад: Будова клітини, Звичайні дроби, Словосполучення..."
          maxLength={240}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-sky-200 bg-[#F8FBFF] text-[#0F294D] placeholder:text-slate-400 text-sm sm:text-base focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
        />

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs text-slate-500">
          <span>Швидкий приклад:</span>
          {QUICK_EXAMPLES.slice(0, 3).map((ex, idx) => (
            <span key={ex.label} className="inline-flex items-center gap-2">
              {idx > 0 && <span aria-hidden="true">·</span>}
              <button
                type="button"
                onClick={() => applyQuickExample(ex)}
                className="text-blue-700 hover:text-[#0F294D] hover:underline underline-offset-2 font-medium cursor-pointer"
              >
                {ex.topic.split(' та ')[0]}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Жанр історії (необов'язковий) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="quest-genre"
            className="block text-sm font-semibold text-[#0F294D]"
          >
            Жанр історії
          </label>
          <span className="text-xs text-slate-500">Необовʼязково</span>
        </div>

        <div className="relative">
          <select
            id="quest-genre"
            value={formData.genre}
            onChange={(e) => onChange({ ...formData, genre: e.target.value })}
            className="w-full min-h-[46px] pl-4 pr-10 py-2.5 rounded-xl border border-sky-200 bg-[#F8FBFF] text-[#0F294D] text-sm sm:text-base appearance-none focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors cursor-pointer"
          >
            <option value="">Автоматичний вибір жанру</option>
            {GENRE_OPTIONS.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-slate-500 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 5. Атмосфера (необов'язковий) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span
            id="atmosphere-label"
            className="block text-sm font-semibold text-[#0F294D]"
          >
            Атмосфера
          </span>
          <span className="text-xs text-slate-500">
            {formData.atmosphere
              ? `Обрано: ${formData.atmosphere}`
              : 'Необовʼязково'}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="atmosphere-label"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {ATMOSPHERE_OPTIONS.map((atmosphere) => {
            const active = formData.atmosphere === atmosphere;
            return (
              <button
                key={atmosphere}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() =>
                  onChange({
                    ...formData,
                    atmosphere: active ? '' : atmosphere,
                  })
                }
                className={`min-h-[40px] px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap truncate cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  active
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-[#F4F8FD] text-slate-700 border border-sky-200/80 hover:border-blue-400 hover:text-[#0F294D]'
                }`}
              >
                {atmosphere}
              </button>
            );
          })}
        </div>
      </div>

      {validationError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm"
        >
          <AlertCircle
            className="w-4 h-4 text-red-700 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>{validationError}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full min-h-[54px] px-6 py-3.5 rounded-xl bg-[#0F294D] text-white font-display font-bold text-base tracking-wide hover:bg-[#173B6D] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
            <span>СТВОРЮЄМО ІСТОРІЮ...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>ЗГЕНЕРУВАТИ ІСТОРІЮ</span>
          </>
        )}
      </button>

      <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
        <Compass className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
        <span>
          Генерується лише сюжетна завʼязка (120–180 слів) без тестів і готових відповідей.
        </span>
      </div>
    </form>
  );
}
