import { jsPDF } from 'jspdf';
import type { GeneratedQuest } from '../types/quest';

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const paragraphs = text.split(/\n+/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }

    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
    lines.push('');
  }

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function exportQuestToPdf(quest: GeneratedQuest): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  // A4 at ~150 DPI for crisp Cyrillic typography
  const width = 1240;
  const height = 1754;
  const marginX = 96;
  const contentWidth = width - marginX * 2;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Не вдалося ініціалізувати графічний контекст для PDF.');
  }

  // White paper background with subtle sky top bar
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#EBF3FE';
  ctx.fillRect(0, 0, width, 16);

  ctx.fillStyle = '#0F294D';
  ctx.fillRect(0, 0, width, 8);

  let y = 84;

  // Brand + Metadata line
  ctx.fillStyle = '#1D4ED8';
  ctx.font = '700 20px "Manrope", "IBM Plex Sans", sans-serif';
  ctx.fillText('КВЕСТМАЙСТЕР · КАРТКА НАВЧАЛЬНОГО КВЕСТУ', marginX, y);
  y += 38;

  ctx.fillStyle = '#475569';
  ctx.font = '500 22px "IBM Plex Sans", sans-serif';
  const metaLine = `${quest.subject}  ·  ${quest.grade} клас  ·  ${quest.genre}  ·  ${quest.atmosphere}`;
  const metaLines = wrapLines(ctx, metaLine, contentWidth);
  for (const line of metaLines) {
    ctx.fillText(line, marginX, y);
    y += 30;
  }

  ctx.fillStyle = '#64748B';
  ctx.font = '400 20px "IBM Plex Sans", sans-serif';
  const topicLines = wrapLines(ctx, `Тема уроку: ${quest.topic}`, contentWidth);
  for (const line of topicLines) {
    ctx.fillText(line, marginX, y);
    y += 28;
  }

  y += 12;
  ctx.strokeStyle = '#D6E4F7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(marginX, y);
  ctx.lineTo(width - marginX, y);
  ctx.stroke();
  y += 52;

  // Mission title
  ctx.fillStyle = '#1D4ED8';
  ctx.font = '700 18px "Manrope", sans-serif';
  ctx.fillText('НАЗВА МІСІЇ', marginX, y);
  y += 46;

  ctx.fillStyle = '#0F294D';
  ctx.font = '800 44px "Manrope", "IBM Plex Sans", sans-serif';
  const titleLines = wrapLines(ctx, quest.missionTitle, contentWidth);
  for (const line of titleLines) {
    ctx.fillText(line, marginX, y);
    y += 54;
  }

  y += 22;

  // Backstory section
  ctx.fillStyle = '#1D4ED8';
  ctx.font = '700 18px "Manrope", sans-serif';
  ctx.fillText('СЮЖЕТНА ПЕРЕДІСТОРІЯ', marginX, y);
  y += 38;

  ctx.fillStyle = '#1E293B';
  ctx.font = '400 25px "IBM Plex Sans", sans-serif';
  const storyLines = wrapLines(ctx, quest.backstory, contentWidth);
  for (const line of storyLines) {
    if (line === '') {
      y += 16;
    } else {
      ctx.fillText(line, marginX, y);
      y += 38;
    }
  }

  y += 26;

  // Team Role and Main Challenge side-by-side cards
  const colGap = 28;
  const colWidth = (contentWidth - colGap) / 2;
  const boxPad = 28;

  ctx.font = '400 22px "IBM Plex Sans", sans-serif';
  const roleLines = wrapLines(ctx, quest.teamRole, colWidth - boxPad * 2);
  const challengeLines = wrapLines(
    ctx,
    quest.mainChallenge,
    colWidth - boxPad * 2,
  );
  const maxLines = Math.max(roleLines.length, challengeLines.length);
  const boxHeight = Math.max(190, 88 + maxLines * 32 + boxPad);

  // Left card: ВАША РОЛЬ
  drawRoundedRect(ctx, marginX, y, colWidth, boxHeight, 16);
  ctx.fillStyle = '#F0F6FF';
  ctx.fill();
  ctx.strokeStyle = '#C9DCF7';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#1D4ED8';
  ctx.font = '700 17px "Manrope", sans-serif';
  ctx.fillText('ВАША РОЛЬ', marginX + boxPad, y + 40);

  ctx.fillStyle = '#0F294D';
  ctx.font = '400 22px "IBM Plex Sans", sans-serif';
  let roleY = y + 78;
  for (const line of roleLines) {
    ctx.fillText(line, marginX + boxPad, roleY);
    roleY += 32;
  }

  // Right card: ГОЛОВНИЙ ВИКЛИК
  const rightX = marginX + colWidth + colGap;
  drawRoundedRect(ctx, rightX, y, colWidth, boxHeight, 16);
  ctx.fillStyle = '#F0F6FF';
  ctx.fill();
  ctx.strokeStyle = '#C9DCF7';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#1D4ED8';
  ctx.font = '700 17px "Manrope", sans-serif';
  ctx.fillText('ГОЛОВНИЙ ВИКЛИК', rightX + boxPad, y + 40);

  ctx.fillStyle = '#0F294D';
  ctx.font = '400 22px "IBM Plex Sans", sans-serif';
  let chalY = y + 78;
  for (const line of challengeLines) {
    ctx.fillText(line, rightX + boxPad, chalY);
    chalY += 32;
  }

  y += boxHeight + 32;

  // Mission Start banner
  ctx.font = '600 25px "IBM Plex Sans", sans-serif';
  const startLines = wrapLines(
    ctx,
    quest.missionStart,
    contentWidth - boxPad * 2,
  );
  const startHeight = Math.max(136, 84 + startLines.length * 36 + boxPad);

  drawRoundedRect(ctx, marginX, y, contentWidth, startHeight, 18);
  ctx.fillStyle = '#0F294D';
  ctx.fill();

  ctx.fillStyle = '#93C5FD';
  ctx.font = '700 17px "Manrope", sans-serif';
  ctx.fillText('СТАРТ МІСІЇ', marginX + boxPad, y + 42);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 25px "IBM Plex Sans", sans-serif';
  let startY = y + 84;
  for (const line of startLines) {
    ctx.fillText(line, marginX + boxPad, startY);
    startY += 36;
  }

  // Footer
  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 18px "IBM Plex Sans", sans-serif';
  ctx.fillText(
    'Створено в КвестМайстер — цифровій платформі сюжетних освітніх квестів',
    marginX,
    height - 54,
  );

  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  const safeTitle = quest.missionTitle
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);

  pdf.save(`quest-${safeTitle || 'mission'}.pdf`);
}
