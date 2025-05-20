import { format, fromUnixTime } from 'date-fns';
import { LANGUAGE_CODES, DATE_FORMAT_1 } from '@/constants';

/**
 * Convert Unix timestamp to formatted date
 * @param timestamp
 * @returns
 */
export const formatQueueTicketDate = (timestamp: number): string => {
  const date = fromUnixTime(timestamp);
  const formatted = format(date, DATE_FORMAT_1);

  return formatted;
};

export const parseLanguageRestrictions = (restrictions: string[]) => {
  return restrictions
    .map((lang) => LANGUAGE_CODES[lang])
    .filter(Boolean)
    .join(',');
};

export const parseDateString = (date: string) => new Date(date).toUTCString();

export const snakeToTitleCase = (str: string): string => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const Noop = () => {};
