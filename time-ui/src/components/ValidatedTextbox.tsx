import React from 'react';
import InputBase from './InputBase';

interface ValidatedTextboxProps {
  label?: string;
  value: string;
  onChange(newVal: string): void;
  validate(): string;
  placeholder?: string;
  style?: object;
  disabled?: boolean;
}
const ValidatedTextbox: React.FC<ValidatedTextboxProps> = ({
  label,
  value,
  onChange,
  validate,
  style,
  disabled,
}) => {
  const [error, setError] = React.useState('');
  const [edited, setEdited] = React.useState(false);

  React.useEffect(() => {
    if (!edited) return;

    setError(validate() ?? '');
  }, [value, edited]);

  const handleInputChange = (newVal: string) => {
    onChange(newVal);
    setEdited(true);
  };

  return (
    <InputBase
      type={'text'}
      label={label}
      value={value}
      onChange={handleInputChange}
      error={error}
      style={style}
      disabled={disabled}
    />
  );
};

export default ValidatedTextbox;
