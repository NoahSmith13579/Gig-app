import { useContext } from 'react';
import Pagination from '../../../components/PaginationNav';
import Trash from '../../../components/icons/Trash';
import DayWorked from '../../../entities/DayWorked';
import Handlers from '../../../handlers/ViewProjHandlers';
import {
  addSeconds,
  dateFormatter,
  secondsToHours,
} from '../../../helpers/dateHelper';
import AddDayWorkedBox from './AddDateWorkedBox';
import { StateContext } from '../../../contexts/StateContext';
import PopoutBox from '../../../components/PopoutBox';

interface DayTableProps {
  currentData: DayWorked[];
  currentPage: number;
  pageCount: number;
  goToPage: Function;
  pageSize: number;
  showData: Boolean;
  isSameUser: Boolean;
}

const DayTable: React.FC<DayTableProps> = (
  props: React.PropsWithChildren<DayTableProps>
) => {
  const {
    currentData,
    currentPage,
    pageCount,
    goToPage,
    pageSize,
    showData,
    isSameUser,
  } = props;

  const { handleRemoveDayWorked, handleSetShowDay, handleSetShowPopout } =
    Handlers();

  const { state } = useContext(StateContext);

  const { showPopout, dayWorked } = state;

  return (
    <div className='card'>
      <p className='m-1'>Days Worked:</p>
      <div className='card'>
        <table>
          <thead>
            <tr>
              <td>Notes</td>
              <td>StartTime</td>
              <td>EndTime</td>
              <td>Time Worked</td>
            </tr>
          </thead>
          <tbody>
            {currentData.map((dayWorked) => (
              <>
                {showPopout && (
                  <PopoutBox title={'Note'} body={dayWorked.notes} />
                )}
                <tr key={dayWorked.id}>
                  <td>
                    <button onClick={() => handleSetShowPopout(true)}>
                      {dayWorked.notes.substring(0, 6)}
                      ...
                    </button>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {dateFormatter(dayWorked.startDate)}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {dateFormatter(
                      addSeconds(dayWorked.startDate, dayWorked.timeWorked)
                    )}
                  </td>
                  <td>{secondsToHours(dayWorked.timeWorked)}</td>
                  <td>
                    <Trash
                      classNames={'button-danger'}
                      onClick={() => handleRemoveDayWorked(dayWorked.id)}
                    />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        <hr />
        <Pagination
          currentData={currentData}
          currentPage={currentPage}
          pageCount={pageCount}
          goToPage={(x) => goToPage(x)}
          pageSize={pageSize}
        />
        {showData && isSameUser ? (
          <AddDayWorkedBox dayWorked={dayWorked} />
        ) : (
          <button
            disabled={!isSameUser}
            onClick={() => {
              handleSetShowDay(true);
            }}
          >
            Add New Day Worked
          </button>
        )}
      </div>
    </div>
  );
};
export default DayTable;