import React from 'react';
import InputBase from './InputBase';

interface CurrencyBoxProps {
  currencySymbol?: string;
  label?: string;
  value: number;
  onChange(newVal: number): void;
  error?: string;
}

const CurrencyBox: React.FC<CurrencyBoxProps> = ({
  currencySymbol = '$',
  value,
  label,
  onChange,
  error,
}) => {
  const [stringValue, setStringValue] = React.useState('0');

  const prefix = `${currencySymbol} `;

  React.useEffect(() => {
    setStringValue(value.toString());
  }, [value]);

  //FIXME: Cannot add negative symbol
  const handleInputChange = (newVal: string) => {
    if (newVal.length < prefix.length) {
      return;
    }

    const realValue = newVal.substring(prefix.length);

    if (realValue.length === 0) {
      setStringValue(realValue);
      onChange(0);

      return;
    }

    if (isNaN(realValue as any)) return;

    const number = parseFloat(realValue);

    if (isNaN(number)) return;

    setStringValue(realValue);
    onChange(number);
  };

  const contentValue = prefix + stringValue;

  return (
    <InputBase
      type={'text'}
      label={label}
      value={contentValue}
      onChange={handleInputChange}
      error={error}
    />
  );
};

export default CurrencyBox;
