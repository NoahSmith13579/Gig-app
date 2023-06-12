import React, { useMemo } from 'react';
import ValidatedDatePicker from '../../../components/ValidatedDatePicker';
import ValidatedTextbox from '../../../components/ValidatedTextbox';
import DayWorked from '../../../entities/DayWorked';
import { addSeconds, secondsToHours } from '../../../helpers/dateHelper';
import {
  notEmpty,
  notReversedDateRange,
  withinCharLimit,
} from '../../../helpers/validationHelper';
import Handlers from '../../../handlers/ViewProjHandlers';

interface AddDateWorkedBoxProps {
  dayWorked: DayWorked;
}

const AddDayWorkedBox: React.FC<AddDateWorkedBoxProps> = ({ dayWorked }) => {
  const [curError, setCurError] = React.useState('');
  let { handleSetDay, handleAppendDaysWorked, handleCloseDayWorked } =
    Handlers();

  const endDate = addSeconds(dayWorked.startDate, dayWorked.timeWorked);

  const [validateName, isNameValid] = notEmpty('string');
  const [validateDate, isDateValid] = notReversedDateRange(
    dayWorked.startDate,
    endDate ?? new Date()
  );
  const [validateNotes, isNotesValid] = withinCharLimit(dayWorked.notes);

  React.useEffect(() => {
    setCurError('');
  }, [dayWorked]);

  const shouldDisableSubmit = !isNameValid;

  const handleUpdateDate = (newVal: Date) => {
    handleSetDay({ ...dayWorked, startDate: newVal });
  };

  const handleSubmitDayBox = () => {
    if (!isNameValid) {
      return;
    }
    handleAppendDaysWorked();
  };

  const handleUpdateNotes = (newVal: string) => {
    handleSetDay({ ...dayWorked, notes: newVal });
  };

  const handleUpdateEnd = (newVal: Date) => {
    const newTime = newVal.getTime();
    const oldTime = dayWorked.startDate.getTime();

    if (newTime < oldTime) {
      alert('End date cannot come before the start date.');
      return;
    }

    const delta = (newTime - oldTime) / 1000; // milis into seconds

    handleSetDay({
      ...dayWorked,
      timeWorked: delta,
    });
  };

  const delta = secondsToHours(
    (endDate.getTime() - dayWorked.startDate.getTime()) / 1000
  );

  const startEndValidate = useMemo(() => {
    const start = dayWorked.startDate;

    return validateDate(start, endDate);
  }, [dayWorked.startDate, endDate]);

  return (
    <div className='flex col'>
      <ValidatedTextbox
        label='Notes'
        value={dayWorked.notes}
        onChange={handleUpdateNotes}
        validate={validateNotes}
        style={{ overflow: 'auto' }}
        maxlength={51}
      />
      <ValidatedDatePicker
        includeTime
        label='Start Time'
        value={dayWorked.startDate}
        onChange={handleUpdateDate}
        validate={() => startEndValidate}
      />
      <ValidatedDatePicker
        includeTime
        label='End Time'
        value={endDate}
        onChange={handleUpdateEnd}
        validate={() => startEndValidate}
      />

      <p>
        Time Worked: {delta} {delta === 1 ? 'hour' : 'hours'}
      </p>

      <div className='flex'>
        <button disabled={shouldDisableSubmit} onClick={handleSubmitDayBox}>
          Add
        </button>
        <button
          className='button-danger ml-auto'
          onClick={handleCloseDayWorked}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddDayWorkedBox;
