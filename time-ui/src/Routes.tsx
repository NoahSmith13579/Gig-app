import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './routes/Dashboard/';
import ProjectRoutes from './routes/Projects';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import About from './routes/About';
import ErrorPage404 from './routes/404';

const AppRoutes: React.FC = () => {
  const user = useAuth().authState.userid;
  return (
    <BrowserRouter basename='/Gig-app'>
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path='/projects/*' element={<ProjectRoutes />} />
          <Route path='/dash' element={<Layout child={<Dashboard />} />} />
        </Route>

        <Route path='/about' element={<Layout child={<About />} />} />
        <Route path='/' element={<Layout child={<About />} />} />
        <Route path='*' element={<Layout child={<ErrorPage404 />} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
