import { useState } from 'react'

interface CounterProps {
  initialCount: number
}

function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(initialCount)

  return (
      <div className="counter">
        <h3>Count: {count}</h3>
        <div className="counter-buttons">
          <button onClick={decrement}>-</button>
          <button onClick={reset}>Reset</button>
          <button onClick={increment}>+</button>
        </div>
      </div>
  )
}

export default Counter