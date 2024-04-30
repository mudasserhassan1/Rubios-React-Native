import {formatDateTime} from './timeUtils';
import {constants} from '../constants';

export function formatBusinessHours(hours) {
  let formattedHours = [];
  let currentRange = {start: '', end: '', weekdays: []};

  for (let i = 0; i < hours.length; i++) {
    const {start, end, weekday} = hours[i];
    const splitStart = start.split(' ');
    const splitEnd = end.split(' ');
    const splitCurrRangeStart = currentRange.start?.split(' ');
    const splitCurrRangeEnd = currentRange?.end?.split(' ');
    if (
      splitStart[splitStart.length - 1] !== splitCurrRangeStart?.[splitCurrRangeStart.length - 1] ||
      splitEnd[splitEnd.length - 1] !== splitCurrRangeEnd?.[splitCurrRangeEnd.length - 1]
    ) {
      if (currentRange.weekdays.length > 0) {
        formattedHours.push(formatRange(currentRange));
        currentRange = {start, end, weekdays: [weekday]};
      } else {
        currentRange.start = start;
        currentRange.end = end;
        currentRange.weekdays.push(weekday);
      }
    } else {
      currentRange.weekdays.push(weekday);
    }
  }

  if (currentRange.weekdays.length > 0) {
    formattedHours.push(formatRange(currentRange));
  }

  return formattedHours;
}

export const formatCalendarTime = time => {
  return formatDateTime(time, 'h:mm A', constants.TIME_FORMAT.YYYYMMDD_HH_mm);
};

function formatRange(range) {
  const {start, end, weekdays} = range;
  const weekdayString = formatWeekdays(weekdays);
  const formattedStart = formatCalendarTime(start);
  const formattedEnd = formatCalendarTime(end);
  return `${weekdayString}: ${formattedStart} - ${formattedEnd}`;
}

function formatWeekdays(weekdays) {
  if (weekdays.length === 1) {
    return weekdays[0];
  } else {
    return `${weekdays[0]} - ${weekdays[weekdays.length - 1]}`;
  }
}
