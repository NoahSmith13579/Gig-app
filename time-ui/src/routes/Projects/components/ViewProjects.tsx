import React from 'react';
import ProjectsList from '../../../components/projects/ProjectsList';
import { useData, useService } from '../../../helpers/useData';
import Project from '../../../entities/Project';
import { useNavigate } from 'react-router-dom';
import ListProjectCards from './ListProjectCards';
import { getProjects } from '../../../services/projectService';

interface ProjectData {
    projects: Project[];
}

const ViewProject: React.FC = () => {
    const navigate = useNavigate();

    const [err, loading, projects] = useService(getProjects);

    return (
        <div>
            <h1>These are the projects.</h1>
            <h4>Project Data:</h4>
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
