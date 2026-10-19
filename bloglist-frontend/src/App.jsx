import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
//import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import BlogList from './components/BlogList'
import {
  Container, TextField, Button, AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material'

import {
  Routes, Route, Link
} from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [displayMessage, setDisplayMessage] = useState({
    message: null,
    type: null
  })

  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
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
      {/* <Notification message={displayMessage.message}
        type={displayMessage.type} /> */}
      <form onSubmit={handleLogin}>
        <div>
          <TextField label="username" type="text" variant="standard" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <TextField label="password" type="password" variant="standard" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <Button variant="contained" type='submit' style={{ marginTop: 10 }}>login</Button>
      </form>
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
      navigate('/')
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
    navigate('/')
  }


  const addNewBlog = async blogObject => {
    // event.preventDefault();
    // console.log("title", newBlogTitle)

    // const blogObject = {
    //   title: newBlogTitle,
    //   author: newBlogAuthor,
    //   url: newBlogUrl
    // }

    //blogFormRef.current.toggleVisibility()

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
    navigate('/')
  }

  const padding = {
    padding: 5
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <>

        <AppBar position="static">
          <Toolbar sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                mr: 'auto',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Blog App
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!user && (
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
              )}

              {user && (
                <>
                  <Button component={Link} to="/createBlog" color="inherit">
                    New Blog
                  </Button>

                  <Typography variant="body2">
                    {user.name} logged in
                  </Typography>

                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Notification
          message={displayMessage.message}
          type={displayMessage.type}
        />
        <Routes>
          <Route path="/blogs/:id" element={
            <Blog blogs={blogs} removeBlog={removeBlog} updateBlog={updateBlog} loggedInUserName={user?.username} />
          } />
          <Route path="/login" element={loginForm()} />
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="/createBlog" element={<CreateBlogForm createBlog={addNewBlog} />} />
        </Routes>
      </>
    </Container>

  )
}

export default App