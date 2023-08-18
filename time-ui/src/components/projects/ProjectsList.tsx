import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Project from '../../entities/Project';
import { AuthContext } from '../../contexts/AuthContext';

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const {
    authState: { userid },
  } = useContext(AuthContext);
  return (
    <article className='card'>
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
    </article>
  );
};

export default ProjectsList;
