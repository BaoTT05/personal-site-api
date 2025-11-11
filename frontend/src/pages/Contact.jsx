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
            <strong>Email:</strong> info@mysite.com
          </div>
          <div className="contact-item">
            <strong>Phone:</strong> 123-456-7890
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;