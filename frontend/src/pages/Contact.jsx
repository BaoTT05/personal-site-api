const Contact = () => {
  return (
    <div className="contact-layout">
      <div className="page-header">
        <span className="page-icon">📘</span>
        <h1 className="page-title">Contact</h1>
      </div>

      <div className="contact-content">
        <h2>Let's Work Together</h2>
        <p>I'm always interested in new opportunities and collaborations. Feel free to reach out!</p>
        
        <div className="contact-info">
          <div className="contact-item">
            <strong>Email:</strong> BaoTrinh1995@gmail.com
          </div>
          <div className="contact-item">
            <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/BaoTrinh95" target="_blank" rel="noopener noreferrer">linkedin.com/in/BaoTrinh95</a>
          </div>
          <div className="contact-item">
            <strong>Location:</strong> Kent, WA
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;