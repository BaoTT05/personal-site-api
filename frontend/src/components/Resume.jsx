const Resume = () => {
  const experiences = [
    {
      id: 1,
      title: "Senior Software Developer",
      company: "Tech Innovations Inc.",
      period: "2022 - Present",
      description: [
        "Lead development of full-stack web applications using React, Node.js, and AWS services",
        "Architected and implemented microservices infrastructure serving 100k+ daily users",
        "Mentored junior developers and established code review best practices",
        "Reduced deployment time by 60% through CI/CD pipeline optimization"
      ]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Solutions LLC",
      period: "2020 - 2022",
      description: [
        "Developed responsive web applications using React, Vue.js, and Spring Boot",
        "Integrated third-party APIs and payment processing systems",
        "Collaborated with cross-functional teams to deliver client projects on time",
        "Improved application performance by 40% through code optimization"
      ]
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "StartUp Ventures",
      period: "2019 - 2020",
      description: [
        "Built interactive user interfaces using modern JavaScript frameworks",
        "Participated in agile development processes and sprint planning",
        "Contributed to database design and API development",
        "Maintained and updated legacy codebases"
      ]
    }
  ];

  const education = [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      period: "2015 - 2019",
      description: "Graduated Magna Cum Laude with focus on software engineering and algorithms"
    }
  ];

  const certifications = [
    "AWS Certified Solutions Architect",
    "React Developer Certification",
    "Agile Development Practitioner",
    "Google Cloud Platform Professional"
  ];

  const handleDownloadCV = () => {
    // In a real application, this would trigger a download of the actual CV file
    alert("CV download functionality would be implemented here");
  };

  return (
    <section id="resume" className="resume">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Resume</h2>
          <p className="section-subtitle">
            My professional journey and qualifications
          </p>
          <div className="section-divider"></div>
        </div>

        <div className="resume-content">
          <div className="resume-section">
            <h3 className="resume-section-title">Experience</h3>
            <div className="timeline">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">{exp.title}</h4>
                      <span className="timeline-company">{exp.company}</span>
                      <span className="timeline-period">{exp.period}</span>
                    </div>
                    <ul className="timeline-description">
                      {exp.description.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-sidebar">
            <div className="resume-section">
              <h3 className="resume-section-title">Education</h3>
              {education.map((edu) => (
                <div key={edu.id} className="education-item">
                  <h4 className="education-degree">{edu.degree}</h4>
                  <p className="education-school">{edu.school}</p>
                  <span className="education-period">{edu.period}</span>
                  <p className="education-description">{edu.description}</p>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h3 className="resume-section-title">Certifications</h3>
              <ul className="certifications-list">
                {certifications.map((cert, index) => (
                  <li key={index} className="certification-item">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <div className="resume-section">
              <button 
                className="download-cv-btn"
                onClick={handleDownloadCV}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download CV
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;