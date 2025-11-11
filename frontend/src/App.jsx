import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import VisitorCounter from './components/VisitorCounter';
import AboutMe from './pages/AboutMe';
import Resume from './pages/Resume';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<AboutMe />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <VisitorCounter />
      </div>
    </Router>
  );
}

export default App;
