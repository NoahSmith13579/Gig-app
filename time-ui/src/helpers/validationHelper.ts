type ValidationRule<T> = (newVal: T) => [() => string, boolean];
type ValidationRuleMulti<T> = (
  newVal1: T,
  newVal2: T
) => [(newVal1: T, newVal2: T) => string, boolean];

const notEmpty: ValidationRule<string> = (value: string) => {
  const func = () => {
    if (value.length < 1) {
      return 'Field is required';
    }

    return '';
  };
  return [func, func() === ''];
};

const notNegative: ValidationRule<number> = (value: number) => {
  const func = () => {
    if (value < 0) {
      return 'Value must be positive';
    }

    return '';
  };
  return [func, func() === ''];
};

const notReversedDateRange: ValidationRuleMulti<Date> = (
  startDate: Date,
  endDate: Date
) => {
  const func = () => {
    const iDate = startDate.getTime();
    const fDate = endDate.getTime();
    const delta = fDate - iDate / 1000;

    if (fDate <= iDate) {
      return 'End date and time must be after start date and time';
    }
    return '';
  };
  return [func, func() === ''];
};

const withinCharLimit: ValidationRule<string> = (value: string) => {
  const func = () => {
    const charLim = 250;
    const valueCharlength = value.length;

    if (valueCharlength > charLim) {
      return 'Notes must be 250 characters or less';
    }

    return '';
  };
  return [func, func() === ''];
};

export type { ValidationRule, ValidationRuleMulti };
export { notEmpty, notNegative, notReversedDateRange, withinCharLimit };
