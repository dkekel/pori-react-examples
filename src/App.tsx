import { useState } from 'react'
import './App.css'
import Counter from './components/Counter'
import UserProfile from './components/UserProfile'
import ThemeProvider from './context/ThemeContext'
import ThemeToggler from './components/ThemeToggler'
import DataFetcher from './components/DataFetcher'

function App() {
  const [user, setUser] = useState({
    name: 'Mickey Mouse',
    role: 'Student',
    avatar: 'https://robohash.org/Mickey?size=100x100'
  })

  const changeUser = () => {
    const newUser = {
      name: user.name === 'Mickey Mouse' ? 'Ruben Strong' : 'Mickey Mouse',
      avatar: user.name === 'Mickey Mouse' ?
          'https://robohash.org/Ruben?size=100x100'
          : 'https://robohash.org/Mickey?size=100x100',
      role: user.role === 'Student' ? 'Teacher' : 'Student'
    };
    setUser(newUser);
  }

  return (
      <ThemeProvider>
        <div className="app-container">
          <h1>React Features Demo</h1>

          <section className="demo-section">
            <h2>1. useState Hook Demo</h2>
            <Counter initialCount={0} />
          </section>

          <section className="demo-section">
            <h2>2. Props & Component Composition</h2>
            <UserProfile user={user} />
            <button onClick={changeUser}>Switch User</button>
          </section>

          <section className="demo-section">
            <h2>3. Context API & Theme Toggling</h2>
            <ThemeToggler />
          </section>

          <section className="demo-section">
            <h2>4. useEffect & Data Fetching</h2>
            <DataFetcher />
          </section>
        </div>
      </ThemeProvider>
  )
}

export default App