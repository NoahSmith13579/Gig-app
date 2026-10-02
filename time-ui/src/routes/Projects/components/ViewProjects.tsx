import React from 'react';
import { useService } from '../../../helpers/useData';
import { useNavigate } from 'react-router-dom';
import ListProjectCards from './ListProjectCards';
import { getProjects } from '../../../services/projectService';

const ViewProject: React.FC = () => {
  const navigate = useNavigate();

  const [, loading, projects] = useService(getProjects);

  return (
    <article className='projects-page'>
      <div className='page-heading'>
        <div className='heading-copy'>
          <h1>Projects</h1>
          <p className='page-intro'>
            Keep the work, costs, and progress of every side project in one
            place.
          </p>
        </div>
        <button
          className='primary-action'
          onClick={() => navigate('/projects/create')}
        >
          Create project
        </button>
      </div>
      {loading ? (
        <span>Loading...</span>
      ) : projects === null ? (
        <div className='empty-state'>No projects to show yet.</div>
      ) : (
        <ListProjectCards projects={projects} />
      )}
    </article>
  );
};

export default ViewProject;
