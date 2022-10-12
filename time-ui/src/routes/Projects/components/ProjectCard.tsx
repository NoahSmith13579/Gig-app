import React from 'react';
import Project from '../../../entities/Project';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div className='card'>
            <a href={`/projects/${project.id}`}>
                <span className='title'>{project.name}</span>
            </a>
            <span className='subtitle'>{project.id}</span>
            <span>{project.description}</span>
            <span>
                <b>
                    <u>Owner</u>
                </b>
                : {project.owner}
            </span>
        </div>
    );
};

export default ProjectCard;
