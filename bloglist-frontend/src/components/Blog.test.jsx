import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes by deafult', () => {
  const blog = {
    title: 'Testing React apps',
        author: 'Author Name',
        url: 'https://example.com',
        likes: 10,
        user: {
            id: '123',
            username: 'sameeksha',
            name: 'Sameeksha'
        }
    }

    const { container } = render(
        <Blog
            blog={blog}
        />
    )

    const blogTitleAuthor = container.querySelector('.blog-title-author')
    const blogDetails = container.querySelector('.blog-details')

    expect(blogTitleAuthor).toBeVisible()
    expect(blogDetails).not.toBeVisible()

})