import { useParams } from 'react-router-dom'

const Blog = ({ blogs, updateBlog, removeBlog, loggedInUserName }) => {

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showRemoveBtn = {
    display: loggedInUserName === blog.user.username ? '' : 'none'
  }

  const updateBlogLikes = () => {
    updateBlog({
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    })
  }


  const removeBlogConfirmation = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} by {blog.author}
      </div>
      <div className="blog-details">
        {blog.url}
        <div>
          <span className='likes'>{blog.likes}</span>
          {loggedInUserName && (
            <button onClick={updateBlogLikes}>like</button>
          )}

        </div>
        {blog.user.name}
        <br />
        <button style={showRemoveBtn} onClick={removeBlogConfirmation}>remove</button>
      </div>

    </div>
  )
}

export default Blog