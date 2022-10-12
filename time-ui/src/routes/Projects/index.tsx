import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import CreateProject from './components/CreateProject';
import ViewProject from './components/ViewProject';
import ViewProjects from './components/ViewProjects';

const ProjectRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<Layout child={<ViewProjects />} />} />
            <Route
                path='/create'
                element={<Layout child={<CreateProject />} />}
            />
            <Route
                path=':projectId'
                element={<Layout child={<ViewProject />} />}
            />
        </Routes>
    );
};

export default ProjectRoutes;
