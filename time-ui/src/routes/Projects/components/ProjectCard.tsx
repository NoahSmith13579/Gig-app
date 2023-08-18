import React from 'react';
import Project from '../../../entities/Project';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <li className='card'>
      <Link to={`/projects/${project.id}`}>
        <span className='title'>{project.name}</span>
      </Link>
      <span className='subtitle'>{project.id}</span>
      <span>{project.description}</span>
      <span>
        <b>
          <u>Owner</u>
        </b>
        : {project.owner}
      </span>
    </li>
  );
};

export default ProjectCard;
