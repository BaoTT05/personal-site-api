const Resume = () => {
  const downloadResume = () => {
    // This will trigger download of the resume file when you provide it
    const link = document.createElement('a');
    link.href = '/assets/bao-trinh-resume.pdf'; // You can update this path when you upload the file
    link.download = 'Bao-Trinh-Resume.pdf';
    link.click();
  };

  return (
    <div className="resume-layout">
      <div className="page-header">
        <span className="page-icon">📘</span>
        <h1 className="page-title">Resume</h1>
      </div>

      <div className="resume-content">
        <div className="section-header">
          <h2>Experience</h2>
          <button className="download-btn" onClick={downloadResume}>DOWNLOAD CV</button>
        </div>

        <div className="resume-placeholder">
          <div className="resume-image-container">
            <img 
              src="/assets/resume-preview.png" 
              alt="Resume Preview" 
              className="resume-image" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="resume-placeholder-content" style={{ display: 'none' }}>
              <div className="resume-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>Resume Preview</h3>
              <p>Click the download button above to view my complete resume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;