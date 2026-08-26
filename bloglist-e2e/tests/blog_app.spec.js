const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {

        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Sam D',
                username: 'sameeksha',
                password: 'mypassword'
            }
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Mani T',
                username: 'mani',
                password: 'manimani'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText('Log in to Blogs App')
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'sameeksha', 'mypassword')
            await expect(page.getByText('Sam D logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'sameeksha', 'wrongpassword')

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('wrong credentials')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'sameeksha', 'mypassword')
        })

        test('a new blog can be created', async ({ page }) => {

            await createBlog(page, 'test title', 'test author', 'test url')

            await expect(page.locator('.blog-title-author')).toContainText('test title by test author')

        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'title like', 'author', 'url')

            const blog = page.locator('.blog', {
                hasText: 'title like by author'
            })

            await blog.getByRole('button', { name: 'view' }).click()
            await blog.getByRole('button', { name: 'like' }).click()

            //console.log("logging likes textcontent: ", await blog.locator('.likes').textContent())
            await expect(blog.locator('.likes')).toHaveText('1')

        })

        test('user can delete the blog', async ({ page }) => {
            await createBlog(page, 'title delete', 'author', 'url')

            const blog = page.locator('.blog', {
                hasText: 'title delete by author'
            })

            await blog.getByRole('button', { name: 'view' }).click()
            //await page.waitForTimeout(500)

            //console.log(await page.locator('.blog').last().textContent())
            //const removeButton = blog.getByRole('button', { name: 'remove' })
            // console.log('remove count:', await removeButton.count())
            // console.log('remove visible:', await removeButton.isVisible())

            page.on('dialog', dialog => dialog.accept());
            await blog.getByRole('button', { name: 'remove' }).click()

            await expect(blog).not.toBeVisible()

        })

    })

    test('only user who added the blog can see remove button', async ({ page }) => {

        await loginWith(page, 'sameeksha', 'mypassword')

        await createBlog(page, 'title remove visible', 'author', 'url')

        await page.getByRole('button', { name: 'logout' }).click()

        await loginWith(page, 'mani', 'manimani')

        const blog = page.locator('.blog', {
            hasText: 'title remove visible by author'
        })

        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()

    })
})