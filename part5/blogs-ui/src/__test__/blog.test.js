import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent, waitForElement, act } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'
import { Blog } from '../components/Blogs';
import App from '../App';

afterEach(cleanup)

const blog = {
    title: 'tester',
    author: 'master',
    likes: 666,
    url: 'google.fi',
}

describe('simple blog', () => {

    it('contains data', () => {
        const component = render(
            <SimpleBlog blog={blog} />
          )
        
          expect(component.container).toHaveTextContent(
            'tester'
          )
          expect(component.container).toHaveTextContent(
            'master'
          )
          expect(component.container).toHaveTextContent(
            '666 likes'
          )
    })

    it('listener is called when button is clicked', () => {

        const mockfn = jest.fn()
        const component = render(
            <SimpleBlog blog={blog} onClick={mockfn} />
          )
        
        const likeButton = component.container.querySelector('button')
        likeButton.click()
        likeButton.click()

        expect(mockfn.mock.calls.length).toBe(2)
    })

})


describe('custom blog', () => {
    it ('shows only name and author by default', () => {
        const component = render(
            <Blog blog={blog} />
        )

        expect(component.container).toHaveTextContent(
            'tester'
        )
        expect(component.container).toHaveTextContent(
            'master'
        )
        expect(component.container).not.toHaveTextContent('google.fi')
        expect(component.container).not.toHaveTextContent('666')
    })
    it ('shows shows all info when clicked', () => {
        const component = render(
            <Blog blog={blog} />
        )

        const text = component.container.querySelector('p')

        text.click()

        expect(component.container).toHaveTextContent(
            'tester'
        )
        expect(component.container).toHaveTextContent(
            'master'
        )
        expect(component.container).toHaveTextContent('google.fi')
        expect(component.container).toHaveTextContent('666')
    })
})

describe('bloglist', () => {
    it('shows only login form when user is not logged in', async () => {
        const component = render(<App />)
        component.rerender(<App />)

        await waitForElement(
            () => component.getByText('Username')
        )

        expect(component.container).toHaveTextContent('Login to the blog')
    })

    it('shows blogs when there is a user logged in', async () => {
        const user = {
            username: 'testermaster666xxx',
            token: '123123213123',
            name: 'Master testser'
        }
        let savedItems = {}
        const localStorageMock = {
            setItem: (key, item) => {
                savedItems[key] = item
            },
            getItem: (key) => savedItems[key],
            clear: savedItems = {}
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })

        localStorageMock.setItem('blogsUser', user)

        const component = render(<App />)
        component.rerender(<App />)
        await waitForElement(
            () => component.getByText('Blogs listing')
        )
        expect(component.container).toHaveTextContent('testermaster666xxx')
        expect(component.container).toHaveTextContent('Blogs listing')
    })
})
