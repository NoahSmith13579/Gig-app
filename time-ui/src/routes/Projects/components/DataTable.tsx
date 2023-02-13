import Trash from '../../../components/icons/Trash';
import Pagination from '../../../components/PaginationNav';
import { dateFormatter } from '../../../helpers/dateHelper';
import AddCostBox from './AddCostBox';

interface DataTableProps<T> {
  currentData: T[];
  handleRemove: Function;
  currentPage: number;
  pageCount: number;
  goToPage: Function;
  pageSize: number;
  showData: Boolean;
  isSameUser: Boolean;
  onSubmit(): void;
  onCancel(): void;
  onChange(any: any): void;
  handleClose: Function;
  setShow: Function;
  tableType: string;
  tableTypeValue: any;
}
const DataTable = (props: React.PropsWithChildren<DataTableProps<any>>) => {
  const {
    currentData,
    handleRemove,
    currentPage,
    pageCount,
    goToPage,
    pageSize,
    showData,
    isSameUser,
    onSubmit,
    onCancel,
    onChange,
    handleClose,
    setShow,
    tableType,
    tableTypeValue,
  } = props;

  return (
    <div>
      <p className='m-1'>{tableType}s:</p>
      <div className='card'>
        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Amount ($)</td>
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
                <td>{dateFormatter(currItem.date)}</td>
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
          <AddCostBox
            cost={tableTypeValue}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onChange={onChange}
          />
        ) : (
          <button
            disabled={!isSameUser}
            onClick={() => {
              handleClose();
              setShow(true);
            }}
          >
            Add New {tableType}
          </button>
        )}
      </div>
    </div>
  );
};

export default DataTable;
