import React from 'react';
import Revenue from '../../../entities/Revenue';
import { notEmpty, notNegative } from '../../../helpers/validationHelper';
import ValidatedCurrencyBox from '../../../components/ValidatedCurrencyBox';
import ValidatedDatePicker from '../../../components/ValidatedDatePicker';
import ValidatedTextbox from '../../../components/ValidatedTextbox';

interface AddRevenueBoxProps {
  revenue: Revenue;
  onChange(newRevenue: Revenue): void;
  onSubmit(): void;
  onCancel(): void;
}

const AddRevenueBox: React.FC<AddRevenueBoxProps> = ({
  revenue,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [curError, setCurError] = React.useState('');

  const handleUpdateName = (newVal: string) => {
    onChange({ ...revenue, name: newVal });
  };
  const handleUpdateAmount = (newVal: number) => {
    onChange({ ...revenue, amount: newVal });
  };

  React.useEffect(() => {
    setCurError(validateAmount());
  }, [revenue]);

  const [validateName, isNameValid] = notEmpty(revenue.name);
  const [validateAmount, isAmountValid] = notNegative(revenue.amount);

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
        value={revenue.name}
        onChange={handleUpdateName}
        validate={validateName}
      />
      <ValidatedCurrencyBox
        label='Amount'
        value={revenue.amount}
        onChange={handleUpdateAmount}
        validate={validateAmount}
      />
      <ValidatedDatePicker
        label='Date'
        value={revenue.date}
        onChange={(e) => onChange({ ...revenue, date: e })}
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

export default AddRevenueBox;
