const { test, expect, beforeEach, describe } = require('@playwright/test')

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

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText('Log in to Blogs App')
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('sameeksha')
            await page.getByRole('textbox').last().fill('mypassword')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Sam D logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('sameeksha')
            await page.getByRole('textbox').last().fill('wrongpassword')
            await page.getByRole('button', { name: 'login' }).click()

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('wrong credentials')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('textbox').first().fill('sameeksha')
            await page.getByRole('textbox').last().fill('mypassword')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByLabel('title').fill('test title')
            await page.getByLabel('author').fill('test author')
            await page.getByLabel('url').fill('test url')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.locator('.blog-title-author')).toContainText('test title by test author')

        })
    })
})