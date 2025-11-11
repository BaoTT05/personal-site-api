import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">📘</span>
          <div className="logo-text">
            <span className="name">Bao Trinh</span>
            <span className="title">/ SOFTWARE DEVELOPER</span>
          </div>
        </div>
        <nav className="nav">
          <Link to="/" className={getNavLinkClass('/')}>ABOUT ME</Link>
          <Link to="/resume" className={getNavLinkClass('/resume')}>RESUME</Link>
          <Link to="/projects" className={getNavLinkClass('/projects')}>PROJECTS</Link>
          <Link to="/contact" className={getNavLinkClass('/contact')}>CONTACT</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;