import {
  notEmpty,
  notNegative,
  notReversedDateRange,
  withinCharLimit,
} from './validationHelper';

describe('validation helpers', () => {
  it('reports empty required text and accepts non-empty text', () => {
    const [validateEmpty, isEmptyValid] = notEmpty('');
    const [validateText, isTextValid] = notEmpty('Project');

    expect(isEmptyValid).toBe(false);
    expect(validateEmpty()).toBe('Field is required');
    expect(isTextValid).toBe(true);
    expect(validateText()).toBe('');
  });

  it('accepts zero and positive amounts but rejects negative amounts', () => {
    const [validateNegative, isNegativeValid] = notNegative(-0.01);
    const [validateZero, isZeroValid] = notNegative(0);
    const [validatePositive, isPositiveValid] = notNegative(12.5);

    expect(isNegativeValid).toBe(false);
    expect(validateNegative()).toBe('Value must be positive');
    expect(isZeroValid).toBe(true);
    expect(validateZero()).toBe('');
    expect(isPositiveValid).toBe(true);
    expect(validatePositive()).toBe('');
  });

  it('requires the end date to be later than the start date', () => {
    const start = new Date('2024-01-01T10:00:00.000Z');
    const [validateReversed, isReversedValid] = notReversedDateRange(
      start,
      new Date('2024-01-01T09:59:59.000Z')
    );
    const [validateEqual, isEqualValid] = notReversedDateRange(start, start);
    const [validateForward, isForwardValid] = notReversedDateRange(
      start,
      new Date('2024-01-01T10:00:01.000Z')
    );

    expect(isReversedValid).toBe(false);
    expect(validateReversed()).toBe(
      'End date and time must be after start date and time'
    );
    expect(isEqualValid).toBe(false);
    expect(validateEqual()).toBe(
      'End date and time must be after start date and time'
    );
    expect(isForwardValid).toBe(true);
    expect(validateForward()).toBe('');
  });

  it('allows notes up to 50 characters and rejects longer notes', () => {
    const [validateLimit, isLimitValid] = withinCharLimit('a'.repeat(50));
    const [validateTooLong, isTooLongValid] = withinCharLimit('a'.repeat(51));

    expect(isLimitValid).toBe(true);
    expect(validateLimit()).toBe('');
    expect(isTooLongValid).toBe(false);
    expect(validateTooLong()).toBe('Notes must be 50 characters or less');
  });
});
