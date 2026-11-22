import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { QuestForm } from './components/QuestForm';
import { StoryCard } from './components/StoryCard';
import { HowItWorks } from './components/HowItWorks';
import { generateAutonomousStory } from './utils/storyGenerator';
import type {
  GeneratedQuest,
  QuestFormData,
  QuickExample,
} from './types/quest';

const INITIAL_FORM_DATA: QuestFormData = {
  subject: '',
  grade: 5,
  topic: '',
  genre: '',
  atmosphere: '',
};

export default function App() {
  const [formData, setFormData] = useState<QuestFormData>(INITIAL_FORM_DATA);
  const [quests, setQuests] = useState<GeneratedQuest[]>([]);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const subjectInputRef = useRef<HTMLInputElement>(null);
  const storyStageRef = useRef<HTMLDivElement>(null);
  const builderSectionRef = useRef<HTMLElement>(null);
  const generationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (generationTimerRef.current !== null) {
        window.clearTimeout(generationTimerRef.current);
      }
    };
  }, []);

  const activeQuest =
    quests.find((q) => q.id === activeQuestId) ?? quests[0] ?? null;

  const generateStory = (
    payload: QuestFormData,
    previousTitle?: string,
  ) => {
    const trimmedSubject = payload.subject.trim();
    const trimmedTopic = payload.topic.trim();

    if (!trimmedSubject) {
      setValidationError(
        'Будь ласка, оберіть предмет зі списку або введіть власний.',
      );
      subjectInputRef.current?.focus();
      return;
    }

    if (!Number.isInteger(payload.grade) || payload.grade < 1 || payload.grade > 11) {
      setValidationError('Будь ласка, оберіть клас від 1 до 11.');
      return;
    }

    if (!trimmedTopic) {
      setValidationError('Будь ласка, вкажіть тему уроку для створення сюжету.');
      document.getElementById('quest-topic')?.focus();
      return;
    }

    setValidationError(null);
    setApiError(null);
    setIsGenerating(true);

    if (generationTimerRef.current !== null) {
      window.clearTimeout(generationTimerRef.current);
    }

    if (window.innerWidth < 1024 && storyStageRef.current) {
      storyStageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    generationTimerRef.current = window.setTimeout(() => {
      try {
        const newQuest = generateAutonomousStory(
          {
            ...payload,
            subject: trimmedSubject,
            topic: trimmedTopic,
          },
          previousTitle,
        );

        setQuests((prev) => [newQuest, ...prev].slice(0, 6));
        setActiveQuestId(newQuest.id);
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : 'Виникла непередбачена помилка під час побудови сюжету.',
        );
      } finally {
        setIsGenerating(false);
        generationTimerRef.current = null;
      }
    }, 380);
  };

  const handleFormSubmit = (data: QuestFormData) => {
    void generateStory(data);
  };

  const handleRegenerate = () => {
    const targetData: QuestFormData = activeQuest
      ? {
          subject: formData.subject.trim() || activeQuest.subject,
          grade: formData.grade || activeQuest.grade,
          topic: formData.topic.trim() || activeQuest.topic,
          genre: formData.genre,
          atmosphere: formData.atmosphere,
        }
      : formData;
    void generateStory(targetData, activeQuest?.missionTitle);
  };

  const handleChangeGenreAndRegenerate = (newGenre: string) => {
    const nextData: QuestFormData = {
      ...formData,
      subject: formData.subject.trim() || activeQuest?.subject || '',
      grade: formData.grade || activeQuest?.grade || 5,
      topic: formData.topic.trim() || activeQuest?.topic || '',
      genre: newGenre,
    };
    setFormData(nextData);
    void generateStory(nextData, activeQuest?.missionTitle);
  };

  const handleUpdateQuest = (updated: GeneratedQuest) => {
    setQuests((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleSelectExample = (example: QuickExample) => {
    const nextData: QuestFormData = {
      subject: example.subject,
      grade: example.grade,
      topic: example.topic,
      genre: example.genre,
      atmosphere: example.atmosphere,
    };
    setFormData(nextData);
    setValidationError(null);
    builderSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    void generateStory(nextData);
  };

  const handleNewQuest = () => {
    setFormData(INITIAL_FORM_DATA);
    setValidationError(null);
    setApiError(null);
    builderSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    window.setTimeout(() => {
      subjectInputRef.current?.focus();
    }, 250);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F4F8FD] text-[#0F294D]">
      <Header onNewQuest={handleNewQuest} />

      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-white via-[#F7FAFF] to-[#F4F8FD] border-b border-sky-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-14 sm:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl space-y-4"
            >
              <p className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
                Освітній інструмент для вчителів НУШ
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F294D] leading-[1.12] text-balance">
                КОЖЕН КВЕСТ ПОЧИНАЄТЬСЯ З ІСТОРІЇ!
              </h1>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Введи тему уроку — і перетвори її на пригоду, у яку захочеться вирушити
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Workspace */}
        <section
          id="builder"
          ref={builderSectionRef}
          className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <QuestForm
                formData={formData}
                onChange={(next) => {
                  setFormData(next);
                  if (validationError) setValidationError(null);
                }}
                onSubmit={handleFormSubmit}
                isGenerating={isGenerating}
                validationError={validationError}
                subjectInputRef={subjectInputRef}
              />
            </motion.div>

            <motion.div
              ref={storyStageRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 scroll-mt-24"
            >
              <StoryCard
                quests={quests}
                activeQuestId={activeQuest?.id ?? null}
                onSelectQuest={setActiveQuestId}
                isGenerating={isGenerating}
                errorMessage={apiError}
                onRetry={handleRegenerate}
                onRegenerate={handleRegenerate}
                onChangeGenreAndRegenerate={handleChangeGenreAndRegenerate}
                onUpdateQuest={handleUpdateQuest}
              />
            </motion.div>
          </div>

          <HowItWorks onSelectExample={handleSelectExample} />
        </section>
      </main>

      <footer className="bg-white border-t border-sky-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <p className="font-medium text-[#0F294D]">
            КвестМайстер — генератор сюжетних завʼязок для навчальних квестів
          </p>
          <p>Для уроків у 1–11 класах · Українська освіта та НУШ</p>
        </div>
      </footer>
    </div>
  );
}
