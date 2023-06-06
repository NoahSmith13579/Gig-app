import React from 'react';
import { useParams } from 'react-router-dom';
import { useService } from '../../../helpers/useData';
import Spinner from '../../../components/Spinner';
import { getProject } from '../../../services/projectService';
import {
  dateFormatter,
  secondsToHours,
  addSeconds,
} from '../../../helpers/dateHelper';
import Trash from '../../../components/icons/Trash';
import AddDayWorkedBox from './AddDateWorkedBox';
import InfoBox from '../../../components/InfoBox';
import usePagination from '../../../components/usePagination';
import PopOut from '../../../components/PopoutBox';
import Pagination from '../../../components/PaginationNav';
import { useAuth } from '../../../contexts/AuthContext';
import DataTable from './DataTable';
import {
  getDefaultCost,
  getDefaultRevenue,
  getDefaultDay,
} from '../../../helpers/getDefault';
import { useStateContext } from '../../../contexts/StateContext';
import Handlers from '../../../handlers/ViewProjHandlers';

interface ProjectParams {
  projectId: string;
}

const ViewProject: React.FC = () => {
  const { projectId } = useParams<keyof ProjectParams>() as ProjectParams;
  //FIXME dataInit is returning null
  const [hasDataError, isloading, dataInit] = useService(() =>
    getProject(projectId)
  );
  const authState = useAuth();
  const loggedin = authState.authState.loggedIn;
  const initialState = {
    projectId: projectId,
    project: dataInit,
    cost: getDefaultCost(),
    revenue: getDefaultRevenue(),
    dayWorked: getDefaultDay(),
    showCost: false,
    showRevenue: false,
    showDayWorked: false,
    showPopout: false,
    showDeletePopout: false,
    hasBeenModified: false,
    submitting: false,
    dataError: hasDataError,
    loading: isloading,
    data: dataInit,
  };
  let { state, dispatch } = useStateContext();
  dispatch({ type: 'pageLoadState', payload: { onLoadState: initialState } });

  const {
    project,
    cost,
    revenue,
    dayWorked,
    showCost,
    showRevenue,
    showDayWorked,
    showPopout,
    showDeletePopout,
    hasBeenModified,
    submitting,
    dataError,
    loading,
    data,
  } = state;

  const pageSize = 10;
  React.useEffect(() => {
    dispatch({ type: 'set_project', payload: { data: data } });
  }, [data]);

  React.useEffect(() => {
    if (!loading && project !== data && hasBeenModified !== true) {
      dispatch({ type: 'set_modified', payload: { bool: true } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const hasData = !loading && !!project;

  const isSameUser =
    project !== null && project.ownerid === authState.authState.userid;

  const {
    handleAppendDaysWorked,
    handleRemoveDayWorked,
    handleCloseDayWorked,
    handleSetShowDay,
    handlePopoutClickOutside,
    handlePopoutClickOutsideDelete,
    handleConfirmDelete,
    handleSubmit,
    handleSetShowPopout,
    handleSetShowPopoutDelete,
  } = Handlers();

  const [currentPageCosts, currentDataCosts, pageCountCosts, goToPageCosts] =
    usePagination(!!project ? project.profit.costs : [], 10);

  const [
    currentPageRevenues,
    currentDataRevenues,
    pageCountRevenues,
    goToPageRevenues,
  ] = usePagination(!!project ? project.profit.revenues : [], 10);

  const [
    currentPageDaysWorked,
    currentDataDaysWorked,
    pageCountDaysWorked,
    goToPageDaysWorked,
  ] = usePagination(!!project ? project.daysWorked : [], 10);

  return (
    <div>
      {hasData && (
        <>
          <h2 className='mb-0'>{project.name}</h2>
          <p className='subtitle p-0'>Owned by {project.owner}</p>
        </>
      )}
      {loading ? (
        <>
          <h4>Getting Project Data</h4>
          <Spinner />
        </>
      ) : project === null ? (
        <h4>Data no here.</h4>
      ) : (
        <></>
      )}
      {loggedin ? (
        <>
          {isSameUser ? (
            <></>
          ) : (
            <>
              {' '}
              <div>
                {' '}
                You are currently viewing a project that you do not own. To edit
                this project, log in as the project creator.
              </div>
            </>
          )}{' '}
          {hasData && (
            <div className='flex row grow'>
              <div className='card col'>
                <DataTable
                  currentData={currentDataCosts}
                  currentPage={currentPageCosts}
                  pageCount={pageCountCosts}
                  goToPage={goToPageCosts}
                  pageSize={pageSize}
                  showData={showCost}
                  isSameUser={isSameUser}
                  tableType={'Cost'}
                />
                <DataTable
                  currentData={currentDataRevenues}
                  currentPage={currentPageRevenues}
                  pageCount={pageCountRevenues}
                  goToPage={goToPageRevenues}
                  pageSize={pageSize}
                  showData={showRevenue}
                  isSameUser={isSameUser}
                  tableType={'Revenue'}
                />

                {hasBeenModified && isSameUser && (
                  <button onClick={handleSubmit} disabled={submitting}>
                    Submit Changes
                  </button>
                )}
              </div>

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
                      {project.daysWorked.map((dayWorked) => (
                        <>
                          {showPopout && (
                            <PopOut
                              title={'Note'}
                              body={dayWorked.notes}
                              onClick={() => handleSetShowPopout(false)}
                              PopOutClickOutside={handlePopoutClickOutside}
                            />
                          )}
                          <tr key={dayWorked.id}>
                            <td>
                              <button onClick={() => handleSetShowPopout(true)}>
                                {dayWorked.notes.substring(0, 6)}
                                ...
                              </button>
                            </td>
                            <td>{dateFormatter(dayWorked.startDate)}</td>
                            <td>
                              {dateFormatter(
                                addSeconds(
                                  dayWorked.startDate,
                                  dayWorked.timeWorked
                                )
                              )}
                            </td>
                            <td>{secondsToHours(dayWorked.timeWorked)}</td>
                            <td>
                              <Trash
                                classNames={'button-danger'}
                                onClick={() =>
                                  handleRemoveDayWorked(dayWorked.id)
                                }
                              />
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>

                  <hr />
                  <Pagination
                    currentData={currentDataDaysWorked}
                    currentPage={currentPageDaysWorked}
                    pageCount={pageCountDaysWorked}
                    goToPage={(x) => goToPageDaysWorked(x)}
                    pageSize={10}
                  />
                  {showDayWorked && isSameUser ? (
                    <AddDayWorkedBox
                      dayWorked={dayWorked}
                      onSubmit={handleAppendDaysWorked}
                      onCancel={handleCloseDayWorked}
                      onChange={handleCloseDayWorked}
                    />
                  ) : (
                    <button
                      disabled={!isSameUser}
                      onClick={() => {
                        handleCloseDayWorked();
                        handleSetShowDay(true);
                      }}
                    >
                      Add New Day Worked
                    </button>
                  )}
                </div>
              </div>
              <div className='card ml-auto'>
                <InfoBox project={project} />
              </div>
            </div>
          )}
          {showDeletePopout && (
            <PopOut
              title={'Delete this project?'}
              body={
                'If you confirm to delete, this project will be gone forever.'
              }
              onClick={() => handleSetShowPopout(false)}
              PopOutClickOutside={handlePopoutClickOutsideDelete}
              onConfirmDelete={handleConfirmDelete}
            />
          )}
          {isSameUser && (
            <button
              onClick={() => handleSetShowPopoutDelete(true)}
              style={{ background: 'red' }}
            >
              Delete Project
            </button>
          )}
        </>
      ) : (
        <div>To view or modify a project, please log in.</div>
      )}

      <a href='/projects'>Back to Projects</a>
    </div>
  );
};

export default ViewProject;
