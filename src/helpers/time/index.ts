import moment from "moment";
import { SECONDS_PER_DAY } from '@/constants/global'

export const formatTimestampToUnix = (
  timestamp: number,
  formatter = "ddd, DD MMM YYYY HH:mm:ss"
) => {
  return moment.unix(timestamp).utc().format(formatter);
};

export const getDifferenceDates = (timestamp: number) => {
  const start = moment(new Date());
  const end = moment.unix(timestamp);
  const difference = end.diff(start);

  return {
    days: moment.utc(difference).format(`DD`),
    hours: moment.utc(difference).format(`HH`),
    minutes: moment.utc(difference).format(`mm`),
    seconds: moment.utc(difference).format(`ss`),
  };
};

export const timestampAlreadyPassed = (timestamp: number) => {
  const formatTimestamp = moment.unix(timestamp).format("YYYY-MM-HH:mm:ss");
  return !moment(formatTimestamp).isBefore(new Date());
};

export const createEpochTimeline = (start: number) => {
  const currentTime = new Date().getTime() / 1000;

  return Array(7).fill('').map((_, index) => {
    const startOfIterationDay = SECONDS_PER_DAY * index + start

    if (currentTime >= startOfIterationDay && currentTime < startOfIterationDay + SECONDS_PER_DAY) return 'present'
    if (currentTime < startOfIterationDay) return 'future'
    return 'past'
  })
}