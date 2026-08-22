import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

vi.mock('../services/blogs')

let blog
let container
let updateBlog

beforeEach(() => {
    updateBlog = vi.fn()

    blog = {
        id: '123',
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
            updateBlog={updateBlog}
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

test('if like button is clicked twice updateBlog event handler is called twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)


    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
})