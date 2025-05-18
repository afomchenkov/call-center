import {
  format,
  parseISO,
} from 'date-fns';


export const formatEventDate = (start: string, end: string) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  const formattedDate = format(startDate, "EEE do MMM, HH:mm");
  const formattedTimeRange = `${format(startDate, "HH:mm")} - ${format(
    endDate,
    "HH:mm"
  )}`;

  return `${formattedDate} - ${format(endDate, "HH:mm")}`;
};

export const parseDateString = (date: string) => new Date(date).toUTCString();

export const Noop = () => { };
