import { BlogType } from '../types'
import { useField } from '../hooks/index'
import React from 'react'

interface BlogFormProps {
    createBlog: (b: BlogType) => void,
}

const BlogForm = ({createBlog}: BlogFormProps) => {
    const title = useField('')
    const author = useField('')
    const url = useField('')

    return (
        <div>
            <h3>Create new blog</h3>
            <form>
                <p>Title <input {...title.input()} /></p>
                <p>Author <input {...author.input()} /></p>
                <p>Url <input {...url.input()} /></p>
                <button onClick={(e) => {
                    e.preventDefault()
                    createBlog({id: '0', title: title.value, author: author.value, url: url.value, likes: 0, comments: [] as string[]})
                    title.reset()
                    author.reset()
                    url.reset()
                }}>Create</button>
            </form>
        </div>
    )
}

export default BlogForm
