import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Resume from './components/Resume'
import Projects from './components/Projects'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Hero />
        <AboutMe />
        <Resume />
        <Projects />
      </main>
      <Footer />
    </>
  )
}

export default App
