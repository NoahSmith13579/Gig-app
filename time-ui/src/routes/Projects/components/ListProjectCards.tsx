import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import Project from '../../../entities/Project';
import ProjectCard from './ProjectCard';

interface ListProjectCardsProps {
    projects: Project[];
}

const ListProjectCards: React.FC<ListProjectCardsProps> = ({ projects }) => {
    const {
        authState: { loggedIn },
    } = useContext(AuthContext);

    console.log('loggedin: ', loggedIn);
    return loggedIn ? (
        <div className='cards'>
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    ) : (
        <div>
            {' '}
            You are not logged in currently. Log in to see your current
            projects.
        </div>
    );
};

export default ListProjectCards;
