import { addSeconds, dateFormatter, secondsToHours } from './dateHelper';

describe('date helpers', () => {
  it('formats dates as zero-padded year-month-day values', () => {
    expect(dateFormatter(new Date(2024, 0, 5))).toBe('2024-01-05');
    expect(dateFormatter(new Date(2024, 10, 15))).toBe('2024-11-15');
  });

  it('adds seconds without mutating the starting date', () => {
    const start = new Date('2024-01-01T12:00:00.000Z');

    const result = addSeconds(start, 90);

    expect(result.toISOString()).toBe('2024-01-01T12:01:30.000Z');
    expect(start.toISOString()).toBe('2024-01-01T12:00:00.000Z');
  });

  it('converts seconds to hours rounded to one decimal place', () => {
    expect(secondsToHours(0)).toBe(0);
    expect(secondsToHours(28800)).toBe(8);
    expect(secondsToHours(5400)).toBe(1.5);
    expect(secondsToHours(5460)).toBe(1.5);
  });
});
