
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Blog from './Blog'

let blog
let updateBlog
let removeBlog

beforeEach(() => {
  updateBlog = vi.fn()
  removeBlog = vi.fn()

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
})

const renderBlog = (loggedInUserName) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={[blog]}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              loggedInUserName={loggedInUserName}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}


test('unauthenticated users see blog information and likes but no buttons', () => {
  renderBlog(null)

  expect(screen.getByText('Testing React apps by Author Name')).toBeVisible()

  const details = document.querySelector('.blog-details')
  expect(details).toHaveTextContent('https://example.com')
  expect(details).toHaveTextContent('10')

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('authenticated non-creator sees only the like button', () => {
  renderBlog('mani')

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()

  expect(screen.queryByRole('button', { name: 'remove' }))
    .not.toBeInTheDocument()
})


test('creator sees the remove button', () => {
  renderBlog('sameeksha')

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
})

test('if like button is clicked twice updateBlog event handler is called twice', async () => {
  const user = userEvent.setup()
  renderBlog('mani')

  const likeButton = screen.getByRole('button', { name: 'like' })

  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
