/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import Project from '../../../entities/Project';

interface ProjectParams {
  projectId: string;
}

const ViewProject: React.FC = () => {
  const { projectId } = useParams<keyof ProjectParams>() as ProjectParams;
  const authState = useAuth();
  const loggedin = authState.authState.loggedIn;
  const isAnonymous = authState.authState.isAnonymous;
  const canViewProject = loggedin || isAnonymous;
  const { state, dispatch } = useContext(StateContext);
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
  }, [projectId]);

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
        loading: false,
        data: initData,
      } as ProjectState;
      dispatch({
        type: 'pageLoadState',
        payload: { onLoadState: initialState },
      });
    }
  }, [initData]);

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

  useEffect(() => {
    if (project && !hasBeenModified && data && project !== data) {
      dispatch({ type: 'set_modified', payload: { bool: true } });
    }
  }, [
    project?.profit?.costs?.length,
    project?.profit?.revenues?.length,
    project?.daysWorked?.length,
    hasBeenModified,
  ]);

  const hasData = !loading && !!project;
  const isSameUser =
    project !== null &&
    (project.ownerid === authState.authState.userid ||
      (isAnonymous && project.ownerid === 'anonymous'));
  const pageSize = 10;

  const { handleConfirmDelete, handleSubmit, handleSetShowPopoutDelete } =
    Handlers();

  const [currentPageCosts, currentDataCosts, pageCountCosts, goToPageCosts] =
    usePagination(!!project ? project.profit.costs : [], pageSize);

  const [
    currentPageRevenues,
    currentDataRevenues,
    pageCountRevenues,
    goToPageRevenues,
  ] = usePagination(!!project ? project.profit.revenues : [], pageSize);

  const [
    currentPageDaysWorked,
    currentDataDaysWorked,
    pageCountDaysWorked,
    goToPageDaysWorked,
  ] = usePagination(!!project ? project.daysWorked : [], pageSize);

  return (
    <article className='project-page'>
      {hasData && (
        <div className='page-heading project-page-heading'>
          <div className='heading-copy'>
            <Link to='/projects' className='back-link'>
              Projects
            </Link>
            <h1 className='mb-0'>{project.name}</h1>
            <p className='project-owner'>Owned by {project.owner}</p>
            {project.description && (
              <p className='page-intro'>{project.description}</p>
            )}
          </div>
          <div className='project-actions'>
            {hasBeenModified && isSameUser && (
              <button onClick={handleSubmit} disabled={submitting}>
                Save changes
              </button>
            )}
            {isSameUser && (
              <button
                className='secondary-danger'
                onClick={() => handleSetShowPopoutDelete(true)}
              >
                Delete project
              </button>
            )}
          </div>
        </div>
      )}
      {loading && (
        <div className='loading-state'>
          <h4>Getting project data</h4>
          <Spinner />
        </div>
      )}
      {!loading && project === null && !isLoading && (
        <div className='empty-state'>
          {dataError
            ? 'Project data could not be loaded.'
            : 'Project data could not be found.'}
        </div>
      )}
      {canViewProject ? (
        <>
          {!isSameUser && hasData && (
            <div className='notice'>
              You are viewing a project that you do not own. Only its creator
              can make changes.
            </div>
          )}
          {hasData && (
            <div className='project-layout' id='project-article'>
              <section className='project-ledger'>
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
                <DayTable
                  currentData={currentDataDaysWorked}
                  currentPage={currentPageDaysWorked}
                  pageCount={pageCountDaysWorked}
                  goToPage={goToPageDaysWorked}
                  pageSize={pageSize}
                  showData={showDayWorked}
                  isSameUser={isSameUser}
                />
              </section>
              <InfoBox project={project} />
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
        </>
      ) : (
        <div className='notice'>To view or modify a project, please log in.</div>
      )}
    </article>
  );
};

export default ViewProject;
