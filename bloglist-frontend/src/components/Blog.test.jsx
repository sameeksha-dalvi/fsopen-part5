import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog
let container

beforeEach(() => {
  blog = {
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

  const rendered = render(
    <Blog
      blog={blog}
    />
  )

  container = rendered.container
})

test('renders title and author but not url or likes by deafult', () => {

    const blogTitleAuthor = container.querySelector('.blog-title-author')
    const blogDetails = container.querySelector('.blog-details')

    expect(blogTitleAuthor).toBeVisible()
    expect(blogDetails).not.toBeVisible()

})

test('after clicking button, children are displayed', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const blogDetails = container.querySelector('.blog-details')

    expect(blogDetails).toBeVisible()
    expect(blogDetails).toHaveTextContent('https://example.com')
    expect(blogDetails).toHaveTextContent('10')

})