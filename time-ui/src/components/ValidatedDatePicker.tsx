import React from 'react';
import DatePickerBase from './DatePickerBase';

interface ValidatedDatePickerProps {
    label?: string;
    value: Date;
    default?: Date;
    onChange(newVal: Date): void;
    validate(): string;
    includeTime?: boolean;
}

const ValidatedDatePicker: React.FC<ValidatedDatePickerProps> = ({
    label,
    value,
    default: defaultValue,
    onChange,
    validate,
    includeTime,
}) => {
    const [error, setError] = React.useState('');

    const handleOnChange = (newVal: Date) => {
        onChange(newVal);
    };

    React.useEffect(() => {
        setError(validate());
    }, [value]);

    return (
        <DatePickerBase
            includeTime={includeTime}
            label={label}
            value={value}
            default={defaultValue}
            onChange={handleOnChange}
            error={error}
        />
    );
};

export default ValidatedDatePicker;
