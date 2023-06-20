import getDailyOpeningHours from './get_daily_opening_hours';
import getIsOpenAt from './get_is_open_at';

import {
  addMinutes,
  getDayDiff,
  getHourGroups,
  getMinutesFromMidnightFromDate,
  getMinutesFromMidnightFromString,
  getWeekday,
  getWeekdayName,
} from './utils';

import type { DayGroup, DayGroups, HourGroup, Weekday, ZeroToSix } from './types';

function getDaysToOpening(dayGroup: DayGroup, weekday: Weekday): ZeroToSix {
  const from = getWeekday(dayGroup.day);

  return ((7 + (from - weekday)) % 7) as ZeroToSix;
}

function getMinutesToOpening(hourGroup: HourGroup, minutesFromMidnight: number) {
  const fromMinutes = getMinutesFromMidnightFromString(hourGroup.from);

  return fromMinutes - minutesFromMidnight;
}

function groupDaysByDaysToOpening(dayGroups: DayGroups, day: Weekday) {
  const groupedDays = new Map<ZeroToSix, DayGroups>(
    Array.from({ length: 7 }, (_, index) => [index as ZeroToSix, []]),
  );

  dayGroups.forEach((dayGroup) => {
    const daysToOpening = getDaysToOpening(dayGroup, day);

    const dayArray = groupedDays.get(daysToOpening) as DayGroups;

    dayArray.push(dayGroup);
  });

  return groupedDays;
}

export function getNextOpenAt(openingHoursString: string, date: Date, returnDate: true): Date;
export function getNextOpenAt(
  openingHoursString: string,
  date: Date,
  returnDate: false,
): string | null;
export default function getNextOpenAt(
  openingHoursString: string,
  date: Date,
  returnDate = false,
): Date | string | null {
  const newDate = new Date(date.getTime()); // deep copy of Date needed to pass recursion
  if (typeof openingHoursString === 'undefined' || openingHoursString === null) {
    throw new Error('openingHoursString is required');
  }

  if (!newDate) {
    throw new Error('date is required');
  }

  if (!openingHoursString) {
    return null;
  }

  const isOpenAt = getIsOpenAt(openingHoursString, newDate);

  // If open or unspecified closing time, return null.
  if (isOpenAt !== false) {
    return null;
  }

  const dailyOpeningHoursArray = getDailyOpeningHours(openingHoursString, true);

  const day = newDate.getDay() as Weekday;
  const minutesFromMidnight = getMinutesFromMidnightFromDate(newDate);

  const daysSortedByDaysToOpening = groupDaysByDaysToOpening(dailyOpeningHoursArray, day);

  function checkDayGroups(dayGroups: DayGroups, letFirstGroup?: boolean) {
    const firstDayGroup = dayGroups[0];

    if (!firstDayGroup) {
      return null;
    }

    const dayGroupDay = getWeekday(firstDayGroup.day);
    const hourGroups = getHourGroups(dayGroups);

    const sortedHourGroups = [...hourGroups].sort(
      (hourGroupA, hourGroupB) =>
        getMinutesToOpening(hourGroupA, minutesFromMidnight) -
        getMinutesToOpening(hourGroupB, minutesFromMidnight),
    );

    const isToday = day === dayGroupDay;

    for (const hourGroup of sortedHourGroups) {
      const minutesToOpen = getMinutesToOpening(hourGroup, minutesFromMidnight);
      if (!isToday || minutesToOpen > 0 || letFirstGroup) {
        if (returnDate) {
          const dayDiff = getDayDiff(day, dayGroupDay);
          newDate.setDate(newDate.getDate() + dayDiff);
          return addMinutes(newDate, minutesToOpen);
        }
        return `${getWeekdayName(dayGroupDay)} ${hourGroup.from}`;
      }
    }
  }

  for (const dayGroups of daysSortedByDaysToOpening.values()) {
    const nextOpenAt = checkDayGroups(dayGroups);
    if (nextOpenAt) {
      return nextOpenAt;
    }
  }

  // If we got to this point, opening hour must be some time the same day next week
  const firstDayGroups = daysSortedByDaysToOpening.get(0) as DayGroups;

  const nextOpenAt = checkDayGroups(firstDayGroups, true);

  if (nextOpenAt) {
    return nextOpenAt;
  }

  throw new Error('Could not find opening time');
}
