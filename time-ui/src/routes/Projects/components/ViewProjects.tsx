import React from 'react';
import { useService } from '../../../helpers/useData';
import { useNavigate } from 'react-router-dom';
import ListProjectCards from './ListProjectCards';
import { getProjects } from '../../../services/projectService';

const ViewProject: React.FC = () => {
  const navigate = useNavigate();

  const [, loading, projects] = useService(getProjects);

  return (
    <div>
      <h1>Projects</h1>
      {loading ? (
        <span>Loading...</span>
      ) : projects === null ? (
        <p>No projects</p>
      ) : (
        <ListProjectCards projects={projects} />
      )}

      <button
        style={{
          padding: '0.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          marginTop: '1rem',
        }}
        onClick={() => navigate('/projects/create')}
      >
        Create a new project.
      </button>
    </div>
  );
};

export default ViewProject;
