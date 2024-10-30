// src/lib/date.ts
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd MMMM yyyy', { locale: id });
};

export const formatDateTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd MMMM yyyy HH:mm', { locale: id });
};