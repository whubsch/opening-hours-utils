import getOpeningHours from './get_opening_hours';

import {
  invalidString1,
  invalidString2,
  invalidString3,
  multipleOpeningIntervals,
  openFridayToTuesday,
  openNonStop,
  openNonStopOnWeekends,
  openOnMondaysAndWednesdays,
  openOnWeekdays,
  openOnWeekends,
  unspecifiedClosingTime,
} from '../test_data';

describe('getOpeningHours()', () => {
  it.each`
    input                                | expectedResult
    ${openOnWeekdays.string}             | ${openOnWeekdays.array}
    ${openOnMondaysAndWednesdays.string} | ${openOnMondaysAndWednesdays.array}
    ${multipleOpeningIntervals.string}   | ${multipleOpeningIntervals.array}
    ${openOnWeekends.string}             | ${openOnWeekends.array}
    ${openFridayToTuesday.string}        | ${openFridayToTuesday.array}
    ${openNonStop.string}                | ${openNonStop.array}
    ${openNonStopOnWeekends.string}      | ${openNonStopOnWeekends.array}
    ${unspecifiedClosingTime.string}     | ${unspecifiedClosingTime.array}
  `('returns proper object given $input', ({ input, expectedResult }) => {
    const result = getOpeningHours(input);

    expect(result).toEqual(expectedResult);
  });

  it('returns null given undefined', () => {
    expect(getOpeningHours(undefined)).toBe(null);
  });

  it('returns null given empty string', () => {
    expect(getOpeningHours('')).toBe(null);
  });

  it.each`
    input
    ${invalidString1}
    ${invalidString2}
    ${invalidString3}
  `('throws an error given $input', ({ input }) => {
    expect(() => getOpeningHours(input)).toThrow();
  });
});
