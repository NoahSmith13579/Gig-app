/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useService } from '../../../helpers/useData';
import Spinner from '../../../components/Spinner';
import { getProject } from '../../../services/projectService';
import InfoBox from '../../../components/InfoBox';
import usePagination from '../../../components/usePagination';
import PopOut from '../../../components/PopoutBox';
import { useAuth } from '../../../contexts/AuthContext';
import DataTable from './DataTable';
import {
  getDefaultCost,
  getDefaultRevenue,
  getDefaultDay,
} from '../../../helpers/getDefault';
import Handlers from '../../../handlers/ViewProjHandlers';
import { StateContext } from '../../../contexts/StateContext';
import ProjectState from '../../../entities/ProjectState';
import DayTable from './DayTable';
import { Link } from 'react-router-dom';

interface ProjectParams {
  projectId: string;
}

const ViewProject: React.FC = () => {
  const { projectId } = useParams<keyof ProjectParams>() as ProjectParams;
  const [hasDataError, isloading, dataInit] = useService(() =>
    getProject(projectId)
  );
  const authState = useAuth();
  const loggedin = authState.authState.loggedIn;
  let { state, dispatch } = useContext(StateContext);
  //TODO May cause rerender issue, no real detrimental effect, low priority
  useEffect(() => {
    if (dataInit !== null) {
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
      } as ProjectState;
      dispatch({
        type: 'pageLoadState',
        payload: { onLoadState: initialState },
      });
    }
  }, [dataInit, isloading]);

  useEffect(() => {
    console.log('State: ', state);
  }, [state]);

  const {
    project,
    showCost,
    showRevenue,
    showDayWorked,
    showDeletePopout,
    hasBeenModified,
    submitting,
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
  }, [project]);

  const hasData = !loading && !!project;

  const isSameUser =
    project !== null && project.ownerid === authState.authState.userid;

  const { handleConfirmDelete, handleSubmit, handleSetShowPopoutDelete } =
    Handlers();

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
                  tableType={'cost'}
                />
                <DataTable
                  currentData={currentDataRevenues}
                  currentPage={currentPageRevenues}
                  pageCount={pageCountRevenues}
                  goToPage={goToPageRevenues}
                  pageSize={pageSize}
                  showData={showRevenue}
                  isSameUser={isSameUser}
                  tableType={'revenue'}
                />
              </div>

              <DayTable
                currentData={currentDataDaysWorked}
                currentPage={currentPageDaysWorked}
                pageCount={pageCountDaysWorked}
                goToPage={goToPageDaysWorked}
                pageSize={pageSize}
                showData={showDayWorked}
                isSameUser={isSameUser}
              />
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
              onConfirmDelete={handleConfirmDelete}
            />
          )}
          {hasBeenModified && isSameUser && (
            <button onClick={handleSubmit} disabled={submitting}>
              Submit Changes
            </button>
          )}
          {isSameUser && (
            <button
              onClick={() => handleSetShowPopoutDelete(true)}
              style={{ background: 'red', margin: 10 }}
            >
              Delete Project
            </button>
          )}
        </>
      ) : (
        <div>To view or modify a project, please log in.</div>
      )}

      <Link to='/projects'>Back to Projects</Link>
    </div>
  );
};

export default ViewProject;
