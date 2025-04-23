import { useTheme } from '../context/ThemeContext'

function ThemeToggler() {
  const { theme, toggleTheme } = useTheme()

  return (
      <div className="theme-toggler">
        <p>Current theme: {theme}</p>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
      </div>
  )
}

export default ThemeToggler