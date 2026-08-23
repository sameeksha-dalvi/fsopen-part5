import { render, screen } from "@testing-library/react";
import CreateBlogForm from './CreateBlogForm';
import userEvent from "@testing-library/user-event";

test('<CreateBlogForm /> creates new blog', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(
        <CreateBlogForm createBlog={createBlog} />
    )

    const inputs = screen.getAllByRole('textbox')
    const createButton = screen.getByText('create')

    await user.type(inputs[0], 'testing a form blog title...')
    await user.type(inputs[1], 'testing a form blog author...')
    await user.type(inputs[2], 'testing a form blog url...')

    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form blog title...')
    expect(createBlog.mock.calls[0][0].author).toBe('testing a form blog author...')
    expect(createBlog.mock.calls[0][0].url).toBe('testing a form blog url...')
})