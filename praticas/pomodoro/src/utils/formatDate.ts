import { format } from 'date-fns';

export function formatDate(timestamp: number | string | Date) {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  return format(date, 'dd/MM/yyyy HH:mm');
}