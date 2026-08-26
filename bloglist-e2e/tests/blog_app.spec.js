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
        test('blogs are ordered according to likes', async ({ page }) => {
            await createBlog(page, 'blog 1', 'author 1', 'url 1')
            await createBlog(page, 'blog 2', 'author 2', 'url 2')
            await createBlog(page, 'blog 3', 'author 3', 'url 3')

            const blog1 = page.locator('.blog', { hasText: 'blog 1 by author 1' })
            await blog1.getByRole('button', { name: 'view' }).click()
            await blog1.getByRole('button', { name: 'like' }).click()
            await expect(blog1.locator('.likes')).toHaveText('1')

            const blog2 = page.locator('.blog', { hasText: 'blog 2 by author 2' })
            await blog2.getByRole('button', { name: 'view' }).click()
            await blog2.getByRole('button', { name: 'like' }).click()
            await expect(blog2.locator('.likes')).toHaveText('1')
            await blog2.getByRole('button', { name: 'like' }).click()
            await expect(blog2.locator('.likes')).toHaveText('2')

            const blog3 = page.locator('.blog', { hasText: 'blog 3 by author 3' })
            await blog3.getByRole('button', { name: 'view' }).click()
            await blog3.getByRole('button', { name: 'like' }).click()
            await expect(blog3.locator('.likes')).toHaveText('1')
            await blog3.getByRole('button', { name: 'like' }).click()
            await expect(blog3.locator('.likes')).toHaveText('2')
            await blog3.getByRole('button', { name: 'like' }).click()
            await expect(blog3.locator('.likes')).toHaveText('3')


            const blogs = page.locator('.blog-title-author')

            const blogTexts = await blogs.allTextContents()

            //console.log("blogTexts :", blogTexts)
            expect(blogTexts[0]).toContain('blog 3 by author 3')
            expect(blogTexts[1]).toContain('blog 2 by author 2')
            expect(blogTexts[2]).toContain('blog 1 by author 1')
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