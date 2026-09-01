import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import Project from '../../../entities/Project';
import ProjectCard from './ProjectCard';

interface ListProjectCardsProps {
  projects: Project[];
}

const ListProjectCards: React.FC<ListProjectCardsProps> = ({ projects }) => {
  const {
    authState: { loggedIn, userid, isAnonymous },
  } = useContext(AuthContext);

  const canViewProjects = loggedIn || isAnonymous;

  return canViewProjects ? (
    <ul className='cards no-list-style'>
      {projects.map((project) =>
        project.ownerid === userid ? (
          <ProjectCard key={project.id} project={project} />
        ) : (
          ''
        )
      )}
    </ul>
  ) : (
    <div>
      {' '}
      You are not logged in currently. Log in to see your current projects.
    </div>
  );
};

export default ListProjectCards;
