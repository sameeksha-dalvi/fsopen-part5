import { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {

  const [newBlogTitle, setBlogTitle] = useState('')
  const [newBlogAuthor, setBlogAuthor] = useState('')
  const [newBlogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input type="text" value={newBlogTitle} onChange={event => setBlogTitle(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            author:
            <input type="text" value={newBlogAuthor} onChange={event => setBlogAuthor(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            url:
            <input type="text" value={newBlogUrl} onChange={event => setBlogUrl(event.target.value)} />
          </label>

        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm