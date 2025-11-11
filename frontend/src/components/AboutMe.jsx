const AboutMe = () => {
  const skills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Spring Boot',
    'Docker',
    'Git',
    'SQL',
    'HTML/CSS'
  ];

  return (
    <section id="about" className="about-me">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-intro">
              I'm a passionate software developer with a strong foundation in full-stack 
              development. I enjoy creating efficient, scalable solutions and am always 
              eager to tackle new challenges.
            </p>
            
            <div className="about-details">
              <div className="about-item">
                <h3>Background</h3>
                <p>
                  With experience in both frontend and backend development, I specialize 
                  in building modern web applications using cutting-edge technologies. 
                  I'm particularly interested in cloud architecture and serverless solutions.
                </p>
              </div>
              
              <div className="about-item">
                <h3>Philosophy</h3>
                <p>
                  I believe in writing clean, maintainable code and following best practices. 
                  Continuous learning is at the core of my approach to software development, 
                  and I enjoy collaborating with teams to deliver exceptional products.
                </p>
              </div>
              
              <div className="about-item">
                <h3>Interests</h3>
                <p>
                  When I'm not coding, I enjoy exploring new technologies, contributing to 
                  open source projects, and staying up-to-date with industry trends. 
                  I'm also passionate about mentoring others and sharing knowledge.
                </p>
              </div>
            </div>
          </div>
          
          <div className="skills-section">
            <h3>Technical Skills</h3>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;