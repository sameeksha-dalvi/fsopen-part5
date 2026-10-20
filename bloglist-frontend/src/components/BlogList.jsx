
import { Link } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Container,
} from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom  sx={{ mt: 3 }}>
        Blogs
      </Typography>

      <List>
        {blogs.map(blog => (
          <ListItem key={blog.id} disablePadding>
            <ListItemButton
              component={Link}
              to={`/blogs/${blog.id}`}
            >
              <ListItemText primary={blog.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default BlogList
