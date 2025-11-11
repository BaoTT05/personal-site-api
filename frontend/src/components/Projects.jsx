const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Personal Portfolio Website",
      description: "A modern, responsive portfolio website built with React and AWS serverless architecture. Features a visitor counter powered by Lambda and DynamoDB.",
      technologies: ["React", "AWS Lambda", "DynamoDB", "Vite"],
      githubUrl: "#",
      liveUrl: "#",
      imageUrl: null
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce application with user authentication, product management, shopping cart, and payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      githubUrl: "#",
      liveUrl: "#",
      imageUrl: null
    },
    {
      id: 3,
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, team collaboration features, and deadline tracking.",
      technologies: ["Vue.js", "Firebase", "Vuetify", "Cloud Functions"],
      githubUrl: "#",
      liveUrl: "#",
      imageUrl: null
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description: "Interactive weather dashboard with location-based forecasts, weather maps, and historical data visualization.",
      technologies: ["JavaScript", "Chart.js", "OpenWeather API", "CSS3"],
      githubUrl: "#",
      liveUrl: "#",
      imageUrl: null
    },
    {
      id: 5,
      title: "API Gateway Service",
      description: "Microservices API gateway with authentication, rate limiting, request routing, and monitoring capabilities.",
      technologies: ["Spring Boot", "Redis", "Docker", "AWS ECS"],
      githubUrl: "#",
      liveUrl: null,
      imageUrl: null
    },
    {
      id: 6,
      title: "Data Analytics Platform",
      description: "Real-time data processing and visualization platform for business intelligence and reporting.",
      technologies: ["Python", "Pandas", "Flask", "PostgreSQL"],
      githubUrl: "#",
      liveUrl: "#",
      imageUrl: null
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A collection of recent work showcasing my skills in web development
          </p>
          <div className="section-divider"></div>
        </div>
        
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} />
                ) : (
                  <div className="project-placeholder">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-technologies">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a 
                    href={project.githubUrl} 
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Code
                  </a>
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      className="project-link project-link-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;