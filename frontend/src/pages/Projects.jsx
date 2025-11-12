import { useState, useEffect } from 'react';

const Projects = () => {
  const [showVisitorCount, setShowVisitorCount] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);

  // Get visitor count from the main VisitorCounter in App.jsx
  useEffect(() => {
    const interval = setInterval(() => {
      const mainCounter = document.querySelector('.visitor-counter span');
      if (mainCounter && mainCounter.textContent) {
        const text = mainCounter.textContent;
        const match = text.match(/#(\d+)/);
        if (match) {
          setVisitorCount(match[1]);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="projects-layout">
      <div className="page-header">
        <span className="page-icon">📘</span>
        <h1 className="page-title">Projects</h1>
      </div>

      <div className="projects-intro">
        <p>Here are some of my featured projects showcasing cloud architecture, algorithmic trading, and full-stack development. Each project demonstrates different aspects of modern software engineering and AWS cloud services.</p>
      </div>

      <div className="projects-list">
        <div className="project-item">
          <div className="project-content">
            <h3 className="project-title">AWS Cloud Challenge</h3>
            <p className="project-subtitle">Full-Stack Serverless Portfolio</p>
            <p className="project-description">Architected a complete serverless portfolio using React frontend and Java Lambda backend. Features atomic visitor tracking with DynamoDB, automated CI/CD via GitHub Actions, and global performance optimization with CloudFront CDN.</p>
          </div>
          <div className="project-image">
            <img 
              src="/assets/aws-cloud-project.png" 
              alt="AWS Cloud Challenge" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="project-placeholder interactive-visitor-box" style={{ display: 'block' }} onClick={() => setShowVisitorCount(!showVisitorCount)}>
              <div className="gradient-bg project1-gradient">
                <div className="visitor-box-content">
                  {showVisitorCount ? (
                    <div className="visitor-count-display">
                      <span>You're the #{visitorCount} visitor for this tab!</span>
                    </div>
                  ) : (
                    <div className="click-prompt">
                      <span>Test out my project! Click me!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="project-item">
          <div className="project-content">
            <h3 className="project-title">Algorithmic Trading System</h3>
            <p className="project-subtitle">Co-Founder & Lead Developer</p>
            <p className="project-description">Built Python-based trading automation system with statistical modeling and machine learning. Achieved 87.2% accuracy rate with AWS EC2 deployment, processing real-time market data and executing algorithmic strategies for 1,000+ members.</p>
          </div>
          <div className="project-image">
            <img 
              src="/assets/trading-system.png" 
              alt="Trading System" 
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

        <div className="project-item">
          <div className="project-content">
            <h3 className="project-title">Intelligent Discord Support Bot</h3>
            <p className="project-subtitle">AI-Powered Customer Service</p>
            <p className="project-description">Developed retrieval-augmented chatbot using LangChain and OpenAI API with 90% response accuracy. Implemented FAISS vector search across 10K+ knowledge chunks, handling 1,000+ user interactions with automated onboarding and RBAC.</p>
          </div>
          <div className="project-image">
            <img 
              src="/assets/discord-bot.png" 
              alt="Discord Bot" 
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
      </div>
    </div>
  );
};

export default Projects;