import Blog from './Blog'

const BlogList = ({ blogs, updateBlog, removeBlog, user }) => {
  return (
    <div>
      <h2>blogs</h2>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          loggedInUserName={user?.username}
        />
      )}
    </div>
  )
}

export default BlogList