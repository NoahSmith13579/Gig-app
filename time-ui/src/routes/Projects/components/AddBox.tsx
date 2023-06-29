/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import ValidatedCurrencyBox from '../../../components/ValidatedCurrencyBox';
import ValidatedDatePicker from '../../../components/ValidatedDatePicker';
import ValidatedTextbox from '../../../components/ValidatedTextbox';
import Cost from '../../../entities/Cost';
import { notEmpty, notNegative } from '../../../helpers/validationHelper';
import Handlers from '../../../handlers/ViewProjHandlers';
import Revenue from '../../../entities/Revenue';
import { StateContext } from '../../../contexts/StateContext';

interface AddBoxProps {
  tableType: string;
}

const AddBox: React.FC<AddBoxProps> = ({ tableType }) => {
  const [, setCurError] = React.useState('');

  const {
    handleSetCost,
    handleSetRevenue,
    handleCloseCost,
    handleCloseRevenue,
    handleAppendCost,
    handleAppendRevenue,
  } = Handlers();

  let onChange: Function,
    boxValue!: Cost | Revenue,
    onCancel!: Function,
    onAppend!: Function;
  const { state } = useContext(StateContext);

  switch (tableType) {
    case 'cost': {
      onChange = handleSetCost;
      boxValue = state.cost;
      onCancel = handleCloseCost;
      onAppend = handleAppendCost;
      break;
    }
    case 'revenue': {
      onChange = handleSetRevenue;
      boxValue = state.revenue;
      onCancel = handleCloseRevenue;
      onAppend = handleAppendRevenue;
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
    onAppend();
  };

  // There could be some issue with how the functions are invoked
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

export default AddBox;
