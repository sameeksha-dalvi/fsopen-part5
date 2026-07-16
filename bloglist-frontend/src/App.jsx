import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const loginForm = () => (
    <>
      <h2>Log in to Blogs App</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </>

  )

  const userBlogsInfo = () => (
    <>
      <h2>blogs</h2>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )

  const handleLogin = async event => {
    event.preventDefault()
    //console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      console.log('wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <>
          <div>
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
           
          </div>
          <div>
            <h2>Create New Blog</h2>
          </div>
          <form >
            <div>
              <label>
                title:
                <input type="text" />
              </label>
            </div>
            <div>
              <label>
                author:
                <input type="text" />
              </label>
            </div>
            <div>
              <label>
                url:
                <input type="text" />
              </label>
              
            </div>
            <button type='submit'>create</button>
          </form>
          <div>
             {userBlogsInfo()}
          </div>
        </>
      )}
    </div>
  )
}

export default App