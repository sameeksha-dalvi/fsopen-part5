import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [newBlogTitle, setBlogTitle] = useState('')
  // const [newBlogAuthor, setBlogAuthor] = useState('')
  // const [newBlogUrl, setBlogUrl] = useState('')
  const [displayMessage, setDisplayMessage] = useState({
    message: null,
    type: null
  })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      //setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <>
      <h2>Log in to Blogs App</h2>
      <Notification message={displayMessage.message}
        type={displayMessage.type} />
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

  const userBlogsInfo = (username) => (
    <>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} loggedInUserName={username} />
      )}
    </>
  )

  const handleLogin = async event => {
    event.preventDefault()
    //console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {

      setDisplayMessage({
        message: 'wrong credentials',
        type: 'error',
      })
      setTimeout(() => {
        setDisplayMessage({
          message: null,
          type: null,
        })
      }, 5000)
      console.log('wrong credentials')
    }
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  // const handleBlogTitle = (event) => {
  //   setBlogTitle(event.target.value)
  // }

  // const handleBlogAuthor = (event) => {
  //   setBlogAuthor(event.target.value)
  // }

  // const handleBlogUrl = (event) => {
  //   setBlogUrl(event.target.value)
  // }

  const addNewBlog = async blogObject => {
    // event.preventDefault();
    // console.log("title", newBlogTitle)

    // const blogObject = {
    //   title: newBlogTitle,
    //   author: newBlogAuthor,
    //   url: newBlogUrl
    // }

    blogFormRef.current.toggleVisibility()

    const response = await blogService.create(blogObject)

    setBlogs(blogs =>
      blogs.concat(response).sort((a, b) => b.likes - a.likes)
    )

    setDisplayMessage({
      message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      type: 'success',
    })
    setTimeout(() => {
      setDisplayMessage({
        message: null,
        type: null,
      })
    }, 5000)

    console.log('addNewBlog resp:', response)
  }

  const updateBlog = async (updatedBlog) => {

    const response = await blogService.update(
      updatedBlog.id,
      updatedBlog
    )

    setBlogs(blogs =>
      blogs.map(blog =>
        blog.id === response.id ? response : blog
      ).sort((a, b) => b.likes - a.likes)
    )
  }

  const removeBlog = async (id) => {
    await blogService.deleteBlog(id)
    setBlogs(blogs => blogs.filter(blog => blog.id !== id))
  }

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <>
          <div>
            <h2>blogs</h2>
            <Notification message={displayMessage.message}
              type={displayMessage.type} />
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

          </div>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <CreateBlogForm
              createBlog={addNewBlog}
            />
          </Togglable>

          {/* <div>
            <h2>Create New Blog</h2>
          </div>
          <form onSubmit={addNewBlog}>
            <div>
              <label>
                title:
                <input type="text" value={newBlogTitle} onChange={handleBlogTitle} />
              </label>
            </div>
            <div>
              <label>
                author:
                <input type="text" value={newBlogAuthor} onChange={handleBlogAuthor} />
              </label>
            </div>
            <div>
              <label>
                url:
                <input type="text" value={newBlogUrl} onChange={handleBlogUrl} />
              </label>

            </div>
            <button type='submit'>create</button>
          </form> */}
          <div>
            {userBlogsInfo(user.username)}
          </div>
        </>
      )}
    </div>
  )
}

export default App