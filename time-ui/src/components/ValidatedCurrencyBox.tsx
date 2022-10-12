import React from 'react';
import CurrencyBox from './CurrencyBox';

interface ValidatedAmountProps {
    label?: string;
    currencySymbol?: string;
    value: number;
    onChange(newVal: number): void;
    validate(): string;
    placeholder?: string;
}

const ValidatedCurrencyBox: React.FC<ValidatedAmountProps> = ({
    currencySymbol = '$',
    label,
    value,
    onChange,
    validate,
}) => {
    const [error, setError] = React.useState('');
    const [edited, setEdited] = React.useState(false);

    React.useEffect(() => {
        if (!edited) return;

        setError(validate() ?? '');
    }, [value, edited]);

    const handleInputChange = (newVal: number) => {
        onChange(newVal);
        setEdited(true);
    };

    return (
        <CurrencyBox
            currencySymbol={currencySymbol}
            label={label}
            value={value}
            onChange={handleInputChange}
            error={error}
        />
    );
};

export default ValidatedCurrencyBox;
