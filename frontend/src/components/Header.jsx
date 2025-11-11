import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1 className="header-title">Bao Trinh</h1>
          <p className="header-subtitle">Software Developer</p>
        </div>
        
        <nav className="header-nav">
          <button
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('about')}
              >
                About Me
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('resume')}
              >
                Resume
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('projects')}
              >
                Projects
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;