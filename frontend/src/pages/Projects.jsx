const Projects = () => {
  return (
    <div className="projects-layout">
      <div className="page-header">
        <span className="page-icon">📘</span>
        <h1 className="page-title">Projects</h1>
      </div>

      <div className="projects-intro">
        <p>I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text" or double click me to add your own content and make changes to the font. I'm a great place for you to tell a story and let your users know a little more about you.</p>
      </div>

      <div className="projects-list">
        <div className="project-item">
          <div className="project-content">
            <h3 className="project-title">Project name 01</h3>
            <p className="project-subtitle">Role Title</p>
            <p className="project-description">I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text" or double click me to add your own content and make changes to the font. I'm a great place for you to tell a story and let your users know a little more about you.</p>
          </div>
          <div className="project-image">
            <img 
              src="/assets/project1-placeholder.png" 
              alt="Project 1" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="project-placeholder" style={{ display: 'none' }}>
              <div className="gradient-bg project1-gradient"></div>
            </div>
          </div>
        </div>

        <div className="project-item">
          <div className="project-content">
            <h3 className="project-title">Project name 02</h3>
            <p className="project-subtitle">Role Title</p>
            <p className="project-description">I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text" or double click me to add your own content and make changes to the font. I'm a great place for you to tell a story and let your users know a little more about you.</p>
          </div>
          <div className="project-image">
            <img 
              src="/assets/project2-placeholder.png" 
              alt="Project 2" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="project-placeholder" style={{ display: 'none' }}>
              <div className="gradient-bg project2-gradient"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;