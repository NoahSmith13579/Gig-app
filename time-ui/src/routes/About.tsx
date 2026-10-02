const About: React.FC = () => {
  return (
    <article className='about-page'>
      <div className='page-heading'>
        <div className='heading-copy'>
          <h1>Make every side project count.</h1>
          <p className='page-intro'>
            A clear view of the time, costs, and income behind your work.
          </p>
        </div>
      </div>
      <section className='card about-card'>
        <span className='eyebrow'>About Gig app</span>
      <p id='about-body'>
        This is a small application for tracking expenses and revenues for
        personal projects. Whether from building and selling wooden crafts to
        delivering food on the side, this application can be used to help track
        and calculate various financial aspects of your project or hobby.{' '}
      </p>
      </section>
    </article>
  );
};

export default About;
