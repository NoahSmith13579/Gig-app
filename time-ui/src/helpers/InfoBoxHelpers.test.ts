import { conditionalFormattingIB } from './InfoBoxHelpers';

describe('conditionalFormattingIB', () => {
  it('formats positive values green and negative values red', () => {
    expect(conditionalFormattingIB(0.5)).toBe('green');
    expect(conditionalFormattingIB(-0.5)).toBe('red');
  });

  it('leaves zero values in the default text color', () => {
    expect(conditionalFormattingIB(0)).toBe('');
  });
});
