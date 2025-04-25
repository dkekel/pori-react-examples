import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DynamicForm from './components/DynamicForm'

function App() {
  const [count, setCount] = useState(0)
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React Form Examples</h1>

      <div className="card">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form Example' : 'Show Dynamic Form Example'}
        </button>

        <button onClick={() => setCount((count) => count + 1)} style={{ marginLeft: '10px' }}>
          count is {count}
        </button>

        <p>
          This project demonstrates how to create dynamic forms in React using react-hook-form and yup validation.
        </p>
      </div>

      {showForm && (
        <div className="form-example-container">
          <DynamicForm />
        </div>
      )}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
