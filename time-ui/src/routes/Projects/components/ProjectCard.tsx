import React from 'react';
import Project from '../../../entities/Project';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <li className='card project-card'>
      <div className='project-card-title'>
        <Link to={`/projects/${project.id}`}>
          <span className='title'>{project.name}</span>
        </Link>
        <span className='project-monogram' aria-hidden='true'>
          {project.name.trim().charAt(0).toUpperCase()}
        </span>
      </div>
      <span className='subtitle'>Project · {project.id.substring(0, 8)}</span>
      <span className='project-card-description'>
        {project.description || 'No description has been added yet.'}
      </span>
      <div className='project-card-footer'>
        <span>Owned by {project.owner}</span>
        <Link to={`/projects/${project.id}`} aria-label={`Open ${project.name}`}>
          Open project →
        </Link>
      </div>
    </li>
  );
};

export default ProjectCard;
