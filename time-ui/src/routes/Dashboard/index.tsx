import React from 'react';
import { useService } from '../../helpers/useData';
import ProjectsList from '../../components/projects/ProjectsList';
import { getProjects } from '../../services/projectService';

const Dashboard: React.FC = () => {
  const [projErr, projLoad, projData] = useService(getProjects);

  const isNotReady = projLoad || !!projErr || projData === null;
  return (
    <article className='flex grow block'>
      <h1>Dashboard</h1>
      <h4>Projects:</h4>
      {isNotReady ? (
        <span>Loading...</span>
      ) : (
        <ProjectsList projects={projData} />
      )}
    </article>
  );
};

export default Dashboard;
