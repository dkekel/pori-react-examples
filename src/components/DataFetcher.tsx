import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
}

function DataFetcher() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await response.json()
        setPosts(data)
        setError('')
      } catch (error) {
        setError('Failed to fetch posts. Please try again later.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading posts...</p>
  if (error) return <p className="error">{error}</p>

  return (
      <div className="posts-container">
        <h3>Sample Posts</h3>
        <ul className="posts-list">
          {posts.map(post => (
              <li key={post.id}>
                <h4>{post.title}</h4>
              </li>
          ))}
        </ul>
      </div>
  )
}

export default DataFetcher