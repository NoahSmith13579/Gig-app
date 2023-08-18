/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import Project from '../../../entities/Project';

interface ProjectParams {
  projectId: string;
}

const ViewProject: React.FC = () => {
  const { projectId } = useParams<keyof ProjectParams>() as ProjectParams;
  const authState = useAuth();
  const loggedin = authState.authState.loggedIn;
  let { state, dispatch } = useContext(StateContext);
  const [dataError, setDataError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initData, setInitData] = useState<Project | null>(null);

  useEffect(() => {
    async function getInitialData() {
      await getProject(projectId)
        .then((resp) => {
          setInitData(resp);
        })
        .catch((err) => {
          setDataError(err);
        })
        .finally(() => setIsLoading(false));
    }
    getInitialData();
    return () => {};
  }, []);

  useEffect(() => {
    if (initData !== null) {
      const initialState = {
        projectId: projectId,
        project: initData,
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
        dataError: dataError,
        loading: isLoading,
        data: initData,
      } as ProjectState;
      dispatch({
        type: 'pageLoadState',
        payload: { onLoadState: initialState },
      });
    }
    return () => {};
  }, [initData, isLoading]);

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
    return () => {};
  }, [state.data]);

  React.useEffect(() => {
    if (!loading && project !== data && hasBeenModified !== true) {
      dispatch({ type: 'set_modified', payload: { bool: true } });
    }
    return () => {};
  }, [state.project]);

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
    <article>
      {hasData && (
        <>
          <h1 className='mb-0'>{project.name}</h1>
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
            <article className='flex row grow'>
              <section className='card col'>
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
              </section>

              <DayTable
                currentData={currentDataDaysWorked}
                currentPage={currentPageDaysWorked}
                pageCount={pageCountDaysWorked}
                goToPage={goToPageDaysWorked}
                pageSize={pageSize}
                showData={showDayWorked}
                isSameUser={isSameUser}
              />
              <InfoBox project={project} />
            </article>
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
    </article>
  );
};

export default ViewProject;
