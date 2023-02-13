import React from 'react';
import { Link } from 'react-router-dom';
import Project from '../../entities/Project';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const { authState } = useAuth();
  const { userid } = authState;
  return (
    <div className='card'>
      <table>
        <thead>
          <tr>
            <td>
              <b>ID</b>
            </td>
            <td>
              <b>Name</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) =>
            project.ownerid === userid ? (
              <tr key={project.id}>
                <td>{project.id.substr(0, 6)}...</td>
                <td>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </td>
              </tr>
            ) : (
              ''
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsList;
