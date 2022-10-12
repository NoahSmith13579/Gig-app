import React from 'react';
import { v4 as uuid } from 'uuid';

interface InputBaseProps {
    type: React.HTMLInputTypeAttribute;
    label?: string;
    value: string;
    default?: string;
    onChange(newVal: string): void;
    error?: string;
    style?: object;
}

const InputBase: React.FC<InputBaseProps> = ({
    type,
    label,
    value,
    default: defaultValue,
    onChange,
    error,
    style,
}) => {
    const [id] = React.useState(uuid());

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className='input-group'>
            {!!label && <label htmlFor={id}>{label}:</label>}
            <input
                className={!!error ? 'error' : ''}
                id={id}
                type={type}
                onChange={handleChange}
                value={value}
                defaultValue={defaultValue}
                style={style}
            />
            {!!error && <span className='error'>{error}</span>}
        </div>
    );
};

export default InputBase;
