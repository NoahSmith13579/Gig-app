import React from 'react';
import ValidatedCurrencyBox from '../../../components/ValidatedCurrencyBox';
import ValidatedDatePicker from '../../../components/ValidatedDatePicker';
import ValidatedTextbox from '../../../components/ValidatedTextbox';
import Cost from '../../../entities/Cost';
import { notEmpty, notNegative } from '../../../helpers/validationHelper';
import Handlers from '../../../handlers/ViewProjHandlers';
import Revenue from '../../../entities/Revenue';
import { useStateContext } from '../../../contexts/StateContext';

interface AddBoxProps {
  tableType: string;
}

const AddCostBox: React.FC<AddBoxProps> = ({ tableType }) => {
  const [curError, setCurError] = React.useState('');

  const {
    handleSetCost,
    handleSetRevenue,
    handleSubmit,
    handleCloseCost,
    handleCloseRevenue,
  } = Handlers();

  let onSubmit: Function,
    onChange: Function,
    boxValue!: Cost | Revenue,
    onCancel!: Function;
  const { state } = useStateContext();

  switch (tableType) {
    case 'Cost': {
      onSubmit = handleSubmit;
      onChange = handleSetCost;
      boxValue = state.cost;
      onCancel = handleCloseCost;
      break;
    }
    case 'Revenue': {
      onSubmit = handleSubmit;
      onChange = handleSetRevenue;
      boxValue = state.revenue;
      onCancel = handleCloseRevenue;
      break;
    }
  }

  const handleUpdateName = (newVal: string) => {
    onChange({ ...boxValue, name: newVal });
  };
  const handleUpdateAmount = (newVal: number) => {
    onChange({ ...boxValue, amount: newVal });
  };

  const [validateName, isNameValid] = notEmpty(boxValue.name);
  const [validateAmount, isAmountValid] = notNegative(boxValue.amount);

  React.useEffect(() => {
    setCurError(validateAmount());
  }, [boxValue]);

  const shouldDisableSubmit = !isNameValid || !isAmountValid;

  const handleSubmitbox = () => {
    if (!isNameValid || !isAmountValid) {
      return;
    }

    onSubmit();
  };

  // Could be some issue with how the functions are invoked
  return (
    <div className='flex col'>
      <ValidatedTextbox
        label='Name'
        value={boxValue.name}
        onChange={handleUpdateName}
        validate={validateName}
      />
      <ValidatedCurrencyBox
        label='Amount'
        value={boxValue.amount}
        onChange={handleUpdateAmount}
        validate={validateAmount}
      />
      <ValidatedDatePicker
        label='Date'
        value={boxValue.date}
        onChange={(e) => onChange({ ...boxValue, date: e })}
        validate={() => ''}
      />
      <div className='flex'>
        <button disabled={shouldDisableSubmit} onClick={handleSubmitbox}>
          Add
        </button>
        <button
          className='button-danger ml-auto'
          onClick={() => onCancel(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCostBox;
