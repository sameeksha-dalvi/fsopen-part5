import { useState } from "react"

const Blog = ({ blog }) => {
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
          <button>like</button>
        </div>

        {blog.author}
      </div>

    </div>
  )
}

export default Blog