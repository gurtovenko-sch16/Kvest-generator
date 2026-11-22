export const SUBJECT_OPTIONS = [
  'Українська мова',
  'Українська література',
  'Зарубіжна література',
  'Математика',
  'Алгебра',
  'Геометрія',
  'Історія України',
  'Всесвітня історія',
  'Біологія',
  'Хімія',
  'Фізика',
  'Географія',
  'Інформатика',
  'Англійська мова',
  'Я досліджую світ',
  'Природознавство',
  'Громадянська освіта',
  'Основи здоровʼя',
  'Мистецтво',
] as const;

export const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const GENRE_OPTIONS = [
  'Детектив',
  'Наукова експедиція',
  'Фантастика',
  'Пригоди',
  'Таємнича лабораторія',
  'Рятувальна місія',
  'Подорож у часі',
  'Космічна місія',
  'Фентезі',
  'Секретна агенція',
  'Випадковий жанр',
] as const;

export const ATMOSPHERE_OPTIONS = [
  'Таємнича',
  'Пригодницька',
  'Футуристична',
  'Гумористична',
  'Напружена',
  'Натхненна',
] as const;

export interface QuestFormData {
  subject: string;
  grade: number;
  topic: string;
  genre: string;
  atmosphere: string;
}

export interface GeneratedQuest {
  id: string;
  missionTitle: string;
  backstory: string;
  teamRole: string;
  mainChallenge: string;
  missionStart: string;
  subject: string;
  grade: number;
  topic: string;
  genre: string;
  atmosphere: string;
  createdAt: number;
}

export interface QuickExample {
  label: string;
  subject: string;
  grade: number;
  topic: string;
  genre: string;
  atmosphere: string;
}

export const QUICK_EXAMPLES: QuickExample[] = [
  {
    label: 'Біологія · 6 клас · Фотосинтез',
    subject: 'Біологія',
    grade: 6,
    topic: 'Фотосинтез та живлення рослин',
    genre: 'Таємнича лабораторія',
    atmosphere: 'Таємнича',
  },
  {
    label: 'Математика · 5 клас · Звичайні дроби',
    subject: 'Математика',
    grade: 5,
    topic: 'Звичайні дроби та дії з ними',
    genre: 'Космічна місія',
    atmosphere: 'Пригодницька',
  },
  {
    label: 'Історія України · 8 клас · Козацька доба',
    subject: 'Історія України',
    grade: 8,
    topic: 'Виникнення українського козацтва та Запорозька Січ',
    genre: 'Подорож у часі',
    atmosphere: 'Напружена',
  },
  {
    label: 'Українська мова · 4 клас · Частини мови',
    subject: 'Українська мова',
    grade: 4,
    topic: 'Прикметник та його роль у мовленні',
    genre: 'Детектив',
    atmosphere: 'Гумористична',
  },
];

export function getGradeStageLabel(grade: number): string {
  if (grade <= 4) return 'Початкова школа · 1–4 класи';
  if (grade <= 9) return 'Базова школа · 5–9 класи';
  return 'Старша школа · 10–11 класи';
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function formatQuestAsText(quest: GeneratedQuest): string {
  return [
    `НАЗВА МІСІЇ: ${quest.missionTitle}`,
    `Предмет: ${quest.subject} | Клас: ${quest.grade} | Тема: ${quest.topic}`,
    `Жанр: ${quest.genre} | Атмосфера: ${quest.atmosphere}`,
    '',
    'СЮЖЕТНА ПЕРЕДІСТОРІЯ',
    quest.backstory,
    '',
    'ВАША РОЛЬ',
    quest.teamRole,
    '',
    'ГОЛОВНИЙ ВИКЛИК',
    quest.mainChallenge,
    '',
    'СТАРТ МІСІЇ',
    quest.missionStart,
  ].join('\n');
}
