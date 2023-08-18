import Trash from '../../../components/icons/Trash';
import Pagination from '../../../components/PaginationNav';
import Cost from '../../../entities/Cost';
import Revenue from '../../../entities/Revenue';
import { dateFormatter } from '../../../helpers/dateHelper';
import Handlers from '../../../handlers/ViewProjHandlers';
import AddBox from './AddBox';

interface DataTableProps<T> {
  currentData: T[];
  currentPage: number;
  pageCount: number;
  goToPage: Function;
  pageSize: number;
  showData: Boolean;
  isSameUser: Boolean;
  tableType: string;
}
const DataTable = (
  props: React.PropsWithChildren<DataTableProps<Cost | Revenue>>
) => {
  const {
    currentData,
    currentPage,
    pageCount,
    goToPage,
    pageSize,
    showData,
    isSameUser,
    tableType,
  } = props;
  const {
    handleRemoveCost,
    handleRemoveRevenue,
    handleCloseCost,
    handleCloseRevenue,
    handleSetShowCost,
    handleSetShowRevenue,
  } = Handlers();

  let handleRemove: Function, handleClose: Function, setShow: Function;

  switch (tableType) {
    case 'cost': {
      handleRemove = handleRemoveCost;
      handleClose = handleCloseCost;
      setShow = handleSetShowCost;
      break;
    }
    case 'revenue': {
      handleRemove = handleRemoveRevenue;
      handleClose = handleCloseRevenue;
      setShow = handleSetShowRevenue;
      break;
    }
  }
  const capitalizedTableType =
    tableType.charAt(0).toUpperCase() + tableType.slice(1);

  return (
    <>
      <p className='m-1'>{capitalizedTableType}s:</p>
      <section className='card'>
        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td style={{ whiteSpace: 'nowrap' }}>Amount ($)</td>
              <td>Date</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {currentData.map((currItem) => (
              <tr key={currItem.id}>
                <td>{currItem.id.substring(0, 6)}</td>
                <td>{currItem.name}</td>
                <td>{currItem.amount}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {dateFormatter(currItem.date)}
                </td>
                <td>
                  <Trash
                    classNames={'button-danger'}
                    onClick={() => handleRemove(currItem.id)}
                  />
                </td>
              </tr>
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
          <AddBox tableType={tableType} />
        ) : (
          <button
            disabled={!isSameUser}
            onClick={() => {
              handleClose();
              setShow(true);
            }}
          >
            Add New {capitalizedTableType}
          </button>
        )}
      </section>
    </>
  );
};

export default DataTable;
