import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerBaseProps {
  label?: string;
  value: Date;
  default?: Date;
  onChange(newVal: Date): void;
  error?: string;
  includeTime?: boolean;
}

const DatePickerBase: React.FC<DatePickerBaseProps> = ({
  label,
  value,
  default: defaultValue,
  onChange,
  error,
  includeTime,
}) => {
  const handleOnChange = (newDate: Date) => onChange(newDate);

  const displayFormat = includeTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';

  return (
    <div className='input-group'>
      {!!label && <label>{label}:</label>}
      <DatePicker
        showTimeSelect={includeTime}
        dateFormat={displayFormat}
        selected={value}
        onChange={handleOnChange}
      />
      {!!error && <span className='error'>{error}</span>}
    </div>
  );
};

export default DatePickerBase;
