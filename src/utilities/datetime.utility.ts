import { format, isBefore, parseISO } from 'date-fns';

export function isOverdue(date?: string | Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  return isBefore(date, today);
}

export function isDueSoon(date?: string | Date): boolean {
  if (!date) return false;
  const today = new Date();
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const daysDifference = Math.abs(parsedDate.getDate() - today.getDate());
  return daysDifference <= 7;
}

export function isStarted(date?: string | Date): boolean {
  if (!date) return false;
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return isBefore(date, today) || parsedDate.getDate() === today.getDate();
}

export function formatDate(date?: string | Date): string {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const isSameYear = today.getFullYear() === parsedDate.getFullYear();

  return isSameYear
    ? format(parsedDate, 'dd MMM')
    : format(parsedDate, 'dd, MMM yyyy');
}
