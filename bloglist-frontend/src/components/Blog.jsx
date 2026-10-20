import { useParams } from 'react-router-dom'
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material'

const Blog = ({ blogs, updateBlog, removeBlog, loggedInUserName }) => {

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
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

    <Card className="blog" sx={{ marginTop: 5 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '18px' }}>
          by {blog.author}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '10px' }}>
          {blog.url}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '10px' }}>
          Added by {blog.user.username}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography variant="body1"  className="likes">
          Likes {blog.likes}
        </Typography>
        {loggedInUserName && (
          <Button size="small" variant="outlined" onClick={updateBlogLikes}>like</Button>
        )}

        <Button size="small" variant="outlined" color="error" style={showRemoveBtn} onClick={removeBlogConfirmation}>Remove</Button>
      </CardActions>
    </Card>
  )
}

export default Blog