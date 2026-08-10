import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const showBlogDetail = { display: visible ? '' : 'none' }

  const toggleBlogVisibility = () => {
    setVisible(!visible)
  }

  const updateBlogLikes = async () => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const response = await blogService.update(blog.id, blogObject)

    console.log('updateBlogLikes resp', response)
    updateBlog(response)
    //console.log(blog.user.id)

  }
  console.log('blog:', blog)
  console.log('blog.user:', blog.user)
  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={toggleBlogVisibility}> {visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showBlogDetail}>
        {blog.url}
        <div>
          {blog.likes}
          <button onClick={updateBlogLikes}>like</button>
        </div>
        {blog.user.name}

      </div>

    </div>
  )
}

export default Blog