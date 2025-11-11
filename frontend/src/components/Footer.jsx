const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2024 by Bao Trinh.<br/>Powered and secured by AWS</p>
        </div>
        <div className="footer-right">
          <div className="footer-section">
            <span className="footer-label">Call</span>
            <span className="footer-value">123-456-7890</span>
          </div>
          <div className="footer-section">
            <span className="footer-label">Write</span>
            <span className="footer-value">BaoTrinh1995@gmail.com</span>
          </div>
          <div className="footer-section">
            <span className="footer-label">Follow</span>
            <div className="footer-social">
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">t</a>
              <a href="#" className="social-icon">in</a>
              <a href="#" className="social-icon">ig</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;