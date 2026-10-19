import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const CreateBlogForm = ({ createBlog }) => {

  const [newBlogTitle, setBlogTitle] = useState('')
  const [newBlogAuthor, setBlogAuthor] = useState('')
  const [newBlogUrl, setBlogUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })

    navigate('/')
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="title" variant="outlined" type="text" value={newBlogTitle} onChange={event => setBlogTitle(event.target.value)}  />
        </div>
        <div>
          <TextField label="author" variant="outlined" type="text"  style={{ marginTop: 10 }} value={newBlogAuthor} onChange={event => setBlogAuthor(event.target.value)}  />
        </div>
        <div>
          <TextField label="url" variant="outlined" type="text" style={{ marginTop: 10 }} value={newBlogUrl} onChange={event => setBlogUrl(event.target.value)}  />
        </div>
        <Button variant="contained" type='submit' style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}

export default CreateBlogForm