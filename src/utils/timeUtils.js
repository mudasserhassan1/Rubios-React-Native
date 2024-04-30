import moment from 'moment';
import {constants} from '../constants';

export const unixTime = () => moment().unix();
export const formatTime = (time, format = constants.TIME_FORMAT.YMD_HYPHEN) => {
  return moment(time).format(format);
};

export const strToDate = (date, format) => {
  if (format) {
    return moment(date, format);
  }
  return moment(date);
};

export const currentDateTime = new Date();

export const getCurrentDate = format => {
  return format ? moment().format(format) : moment();
};
export const formatDateTime = (date, outFormat, inputFormat) => {
  if (inputFormat) {
    return moment(date ?? currentDateTime, inputFormat).format(outFormat);
  }
  return moment(date ?? currentDateTime).format(outFormat);
};

export const isBetweenTime = (dateTime, start, end, granularity, inclusivity) =>
  moment(dateTime).isBetween(start, end, granularity, inclusivity);

export const addDaysToDate = (noOfDays, date) =>
  moment(date || currentDateTime).add(noOfDays, 'days');

export const addToDate = (date, count, unit) => moment(date || currentDateTime).add(count, unit);

export const getDateDiff = (date1, date2, unit) => moment(date1).diff(date2, unit);

export const isValidDate = date => moment(date).isValid();

export const isAfterDate = (date1, date2) => moment(date1).isAfter(date2);

export const getUnixTimeStamp = (addition = 0) => moment().unix() + addition;

export const dateComponents = {
  year: 'year',
  month: 'month',
  day: 'day',
  week: 'week',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
};
export const getDateComponent = (date, format, component) => {
  return moment(date, format)?.[dateComponents[component]]?.();
};

export const getDateForComponent = date => {
  if (isValidDate(date)) {
    return new Date(date);
  }
  return moment(new Date());
};
