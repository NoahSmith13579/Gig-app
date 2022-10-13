import React from 'react';
import CurrencyBox from '../../../components/CurrencyBox';
import ValidatedCurrencyBox from '../../../components/ValidatedCurrencyBox';
import ValidatedDatePicker from '../../../components/ValidatedDatePicker';
import ValidatedTextbox from '../../../components/ValidatedTextbox';
import Cost from '../../../entities/Cost';
import { notEmpty, notNegative } from '../../../helpers/validationHelper';

interface AddCostBoxProps {
    cost: Cost;
    onChange(newCost: Cost): void;
    onSubmit(): void;
    onCancel(): void;
}

const AddCostBox: React.FC<AddCostBoxProps> = ({
    cost,
    onChange,
    onSubmit,
    onCancel,
}) => {
    const [curError, setCurError] = React.useState('');

    const handleUpdateName = (newVal: string) => {
        onChange({ ...cost, name: newVal });
    };
    const handleUpdateAmount = (newVal: number) => {
        onChange({ ...cost, amount: newVal });
    };

    const [validateName, isNameValid] = notEmpty(cost.name);
    const [validateAmount, isAmountValid] = notNegative(cost.amount);

    React.useEffect(() => {
        setCurError(validateAmount());
    }, [cost]);

    const shouldDisableSubmit = !isNameValid || !isAmountValid;

    const handleSubmit = () => {
        if (!isNameValid || !isAmountValid) {
            return;
        }

        onSubmit();
    };

    return (
        <div className='flex col'>
            <ValidatedTextbox
                label='Name'
                value={cost.name}
                onChange={handleUpdateName}
                validate={validateName}
            />
            <ValidatedCurrencyBox
                label='Amount'
                value={cost.amount}
                onChange={handleUpdateAmount}
                validate={validateAmount}
            />
            <ValidatedDatePicker
                label='Date'
                value={cost.date}
                onChange={(e) => onChange({ ...cost, date: e })}
                validate={() => ''}
            />
            <div className='flex'>
                <button disabled={shouldDisableSubmit} onClick={handleSubmit}>
                    Add
                </button>
                <button className='button-danger ml-auto' onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddCostBox;
