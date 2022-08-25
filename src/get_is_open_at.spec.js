import getIsOpenAt from './get_is_open_at';

import {
  invalidString1,
  invalidString2,
  invalidString3,
  mondayEvening,
  mondayMidday,
  mondayMidnight,
  mondayMorning,
  mondayTwelveThirty,
  multipleOpeningIntervals,
  openFridayToTuesday,
  openNonStop,
  openNonStopOnWeekends,
  openOnMondaysAndWednesdays,
  openOnWeekdays,
  openOnWeekends,
  saturdayEightAm,
  saturdayMidday,
  saturdayMidnight,
  unspecifiedClosingTime,
} from '../test_data';

describe('getIsOpenAt()', () => {
  it.each`
    openingHoursString                   | date                  | expectedResult
    ${openOnWeekdays.string}             | ${saturdayMidnight}   | ${false}
    ${openOnWeekdays.string}             | ${saturdayEightAm}    | ${false}
    ${openOnWeekdays.string}             | ${saturdayMidday}     | ${false}
    ${openOnWeekdays.string}             | ${mondayMidnight}     | ${false}
    ${openOnWeekdays.string}             | ${mondayMorning}      | ${true}
    ${openOnWeekdays.string}             | ${mondayMidday}       | ${true}
    ${openOnWeekdays.string}             | ${mondayTwelveThirty} | ${true}
    ${openOnWeekdays.string}             | ${mondayEvening}      | ${false}
    ${openOnMondaysAndWednesdays.string} | ${saturdayMidnight}   | ${false}
    ${openOnMondaysAndWednesdays.string} | ${saturdayEightAm}    | ${false}
    ${openOnMondaysAndWednesdays.string} | ${saturdayMidday}     | ${false}
    ${openOnMondaysAndWednesdays.string} | ${mondayMidnight}     | ${false}
    ${openOnMondaysAndWednesdays.string} | ${mondayMorning}      | ${true}
    ${openOnMondaysAndWednesdays.string} | ${mondayMidday}       | ${true}
    ${openOnMondaysAndWednesdays.string} | ${mondayTwelveThirty} | ${true}
    ${openOnMondaysAndWednesdays.string} | ${mondayEvening}      | ${false}
    ${multipleOpeningIntervals.string}   | ${saturdayMidnight}   | ${false}
    ${multipleOpeningIntervals.string}   | ${saturdayEightAm}    | ${false}
    ${multipleOpeningIntervals.string}   | ${saturdayMidday}     | ${false}
    ${multipleOpeningIntervals.string}   | ${mondayMidnight}     | ${false}
    ${multipleOpeningIntervals.string}   | ${mondayMorning}      | ${true}
    ${multipleOpeningIntervals.string}   | ${mondayMidday}       | ${true}
    ${multipleOpeningIntervals.string}   | ${mondayTwelveThirty} | ${false}
    ${multipleOpeningIntervals.string}   | ${mondayEvening}      | ${false}
    ${openOnWeekends.string}             | ${saturdayMidnight}   | ${false}
    ${openOnWeekends.string}             | ${saturdayEightAm}    | ${true}
    ${openOnWeekends.string}             | ${saturdayMidday}     | ${true}
    ${openOnWeekends.string}             | ${mondayMidnight}     | ${false}
    ${openOnWeekends.string}             | ${mondayMorning}      | ${false}
    ${openOnWeekends.string}             | ${mondayMidday}       | ${false}
    ${openOnWeekends.string}             | ${mondayTwelveThirty} | ${false}
    ${openOnWeekends.string}             | ${mondayEvening}      | ${false}
    ${openFridayToTuesday.string}        | ${saturdayMidnight}   | ${false}
    ${openFridayToTuesday.string}        | ${saturdayEightAm}    | ${true}
    ${openFridayToTuesday.string}        | ${saturdayMidday}     | ${true}
    ${openFridayToTuesday.string}        | ${mondayMidnight}     | ${false}
    ${openFridayToTuesday.string}        | ${mondayMorning}      | ${true}
    ${openFridayToTuesday.string}        | ${mondayMidday}       | ${true}
    ${openFridayToTuesday.string}        | ${mondayTwelveThirty} | ${true}
    ${openFridayToTuesday.string}        | ${mondayEvening}      | ${false}
    ${openNonStop.string}                | ${saturdayMidnight}   | ${true}
    ${openNonStop.string}                | ${saturdayEightAm}    | ${true}
    ${openNonStop.string}                | ${saturdayMidday}     | ${true}
    ${openNonStop.string}                | ${mondayMidnight}     | ${true}
    ${openNonStop.string}                | ${mondayMorning}      | ${true}
    ${openNonStop.string}                | ${mondayMidday}       | ${true}
    ${openNonStop.string}                | ${mondayTwelveThirty} | ${true}
    ${openNonStop.string}                | ${mondayEvening}      | ${true}
    ${openNonStopOnWeekends.string}      | ${saturdayMidnight}   | ${true}
    ${openNonStopOnWeekends.string}      | ${saturdayEightAm}    | ${true}
    ${openNonStopOnWeekends.string}      | ${saturdayMidday}     | ${true}
    ${openNonStopOnWeekends.string}      | ${mondayMidnight}     | ${false}
    ${openNonStopOnWeekends.string}      | ${mondayMorning}      | ${false}
    ${openNonStopOnWeekends.string}      | ${mondayMidday}       | ${false}
    ${openNonStopOnWeekends.string}      | ${mondayTwelveThirty} | ${false}
    ${openNonStopOnWeekends.string}      | ${mondayEvening}      | ${false}
    ${unspecifiedClosingTime.string}     | ${saturdayMidnight}   | ${false}
    ${unspecifiedClosingTime.string}     | ${saturdayEightAm}    | ${false}
    ${unspecifiedClosingTime.string}     | ${saturdayMidday}     | ${null}
    ${unspecifiedClosingTime.string}     | ${mondayMidnight}     | ${false}
    ${unspecifiedClosingTime.string}     | ${mondayMorning}      | ${false}
    ${unspecifiedClosingTime.string}     | ${mondayMidday}       | ${false}
    ${unspecifiedClosingTime.string}     | ${mondayTwelveThirty} | ${false}
    ${unspecifiedClosingTime.string}     | ${mondayEvening}      | ${false}
  `(
    'returns $expectedResult given $openingHoursString and $date',
    ({ openingHoursString, date, expectedResult }) => {
      const result = getIsOpenAt(openingHoursString, date);

      expect(result).toBe(expectedResult);
    },
  );

  it('returns null given undefined', () => {
    expect(getIsOpenAt(undefined, mondayMorning)).toBe(null);
  });

  it('returns null given empty string', () => {
    expect(getIsOpenAt('', mondayMorning)).toBe(null);
  });

  it('throws given no date', () => {
    expect(() => getIsOpenAt(openOnWeekdays.string)).toThrow();
  });

  it.each`
    input
    ${invalidString1}
    ${invalidString2}
    ${invalidString3}
  `('throws an error given $input', ({ input }) => {
    expect(() => getIsOpenAt(input)).toThrow();
  });
});
