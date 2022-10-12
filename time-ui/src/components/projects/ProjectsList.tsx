import React from 'react';
import { Link } from 'react-router-dom';
import Project from '../../entities/Project';

interface ProjectsListProps {
    projects: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
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
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.id.substr(0, 6)}...</td>
                            <td>
                                <Link to={`/projects/${project.id}`}>
                                    {project.name} ({project.owner})
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsList;
