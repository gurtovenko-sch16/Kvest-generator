import { ArrowUpRight, Compass, Layers, Users } from 'lucide-react';
import { QUICK_EXAMPLES } from '../types/quest';
import type { QuickExample } from '../types/quest';

interface HowItWorksProps {
  onSelectExample: (example: QuickExample) => void;
}

export function HowItWorks({ onSelectExample }: HowItWorksProps) {
  return (
    <div className="space-y-16 pt-6">
      {/* Як це працює на уроці */}
      <section id="how-it-works" className="scroll-mt-24 space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F294D] text-balance">
            Як використати сюжет на реальному уроці
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Сюжетна передісторія займає 2–3 хвилини на старті заняття та перетворює звичайні вправи на єдину пригодницьку місію.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-sky-200/80 p-6 space-y-3 shadow-[0_4px_20px_-6px_rgba(15,41,77,0.06)]">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-700">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#0F294D]">
              01. Задайте вектор уроку
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Оберіть предмет, клас від 1 до 11 та тему. Система автоматично налаштує складність мови й сюжетні образи під вік ваших учнів.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sky-200/80 p-6 space-y-3 shadow-[0_4px_20px_-6px_rgba(15,41,77,0.06)]">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-700">
              <Users className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#0F294D]">
              02. Занурте клас у роль
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Зачитайте передісторію вголос або виведіть PDF на інтерактивну дошку — учні одразу зрозуміють, ким вони є та яку проблему мають розвʼязати.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sky-200/80 p-6 space-y-3 shadow-[0_4px_20px_-6px_rgba(15,41,77,0.06)]">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-700">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#0F294D]">
              03. Додайте власні завдання
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Історія не навʼязує готових тестів — ви вільно підʼєднуєте свої вправи, станції квесту, задачі або групову роботу до створеної завʼязки.
            </p>
          </div>
        </div>
      </section>

      {/* Готові стартові сценарії */}
      <section id="examples" className="scroll-mt-24 space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F294D] text-balance">
            Спробуйте на готовому прикладі
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Натисніть на будь-яку тему, щоб підставити параметри у конструктор і одразу згенерувати історію.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onSelectExample(example)}
              className="group text-left bg-white rounded-2xl border border-sky-200/80 p-5 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 tabular-nums">
                  {example.subject} · {example.grade} клас
                </p>
                <p className="font-display text-base font-bold text-[#0F294D] leading-snug">
                  {example.topic}
                </p>
                <p className="text-xs text-slate-500">
                  {example.genre} · {example.atmosphere}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 group-hover:text-[#0F294D]">
                <span>Згенерувати цей квест</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
