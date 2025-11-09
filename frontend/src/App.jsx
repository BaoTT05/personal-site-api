import './App.css'
import VisitorCounter from './components/VisitorCounter'

function App() {
  return (
    <>
      <header className="header">
        <h1>Personal Website</h1>
        <p>Welcome to my corner of the internet!</p>
      </header>
      
      <main className="main-content">
        <section className="hero">
          <h2>About Me</h2>
          <p>
            This is a modern personal website built with React and powered by AWS serverless architecture.
            The visitor counter below is stored in DynamoDB and updated via AWS Lambda.
          </p>
        </section>
        
        <section className="projects">
          <h2>Projects</h2>
          <p>Coming soon... This section will showcase my latest work.</p>
        </section>
        
        <section className="contact">
          <h2>Get In Touch</h2>
          <p>Feel free to reach out for collaboration or just to say hello!</p>
        </section>
      </main>
      
      <footer className="footer">
        <VisitorCounter />
        <p>&copy; 2024 Personal Website. Built with React + AWS.</p>
      </footer>
    </>
  )
}

export default App
