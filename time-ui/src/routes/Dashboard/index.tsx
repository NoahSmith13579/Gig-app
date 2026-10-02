import React from 'react';
import { useService } from '../../helpers/useData';
import ProjectsList from '../../components/projects/ProjectsList';
import { getProjects } from '../../services/projectService';

const Dashboard: React.FC = () => {
  const [projErr, projLoad, projData] = useService(getProjects);

  const isNotReady = projLoad || !!projErr || projData === null;
  return (
    <article className='dashboard-page'>
      <div className='page-heading'>
        <div className='heading-copy'>
          <h1>Dashboard</h1>
          <p className='page-intro'>
            A quick look at the projects you are tracking.
          </p>
        </div>
      </div>
      {isNotReady ? (
        <span>Loading...</span>
      ) : (
        <section className='dashboard-projects'>
          <h2 className='section-heading'>Your projects</h2>
          <ProjectsList projects={projData} />
        </section>
      )}
    </article>
  );
};

export default Dashboard;
