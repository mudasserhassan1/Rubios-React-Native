import {addToDate, currentDateTime, formatDateTime} from './timeUtils';

export function getNext7Days(startDay) {
  const daysArray = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = addToDate(startDay, i, 'days');
    let dayName = formatDateTime(nextDate, 'dddd');
    if (nextDate.isSame(currentDateTime, 'day')) {
      dayName = 'Today';
    } else if (nextDate.isSame(addToDate(currentDateTime, 1, 'day'), 'day')) {
      dayName = 'Tomorrow';
    }
    const dateNumber = formatDateTime(nextDate, 'DD');
    const monthName = formatDateTime(nextDate, 'MMMM');
    const dayObject = {
      day: dayName,
      date: dateNumber,
      month: monthName,
      dateTime: nextDate,
    };

    daysArray.push(dayObject);
  }

  return daysArray;
}
