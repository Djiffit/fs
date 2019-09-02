import React, { useState, useEffect } from 'react'
import { BlogType, UserType } from '../types';
import { getAllBlogs, createNewBlog, updateBlog, deleteSingleBlog } from '../services/blogs';
import { useField } from '../hooks/index';

interface BlogProps {
    blog: BlogType,
    updateBlog: (blog: BlogType) => void,
    deleteBlog: (blog: BlogType) => void,
    user: UserType,
}

interface BlogsProps {
    user: UserType,
    logOut: () => void,
    setError: (message: string) => void,
    setSuccess: (message: string) => void,
}

const Blogs = ({user, logOut, setSuccess, setError}: BlogsProps) => {
    const [blogs, setBlogs] = useState([] as BlogType[])
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        (async () => {
            const allBlogs = ((await getAllBlogs()) || []) as BlogType[]
            setBlogs(allBlogs.map((b)=> ({...b, likes: b.likes || 0})))
        })()
    }, [])

    const likeBlog = async (blog: BlogType) => {
        updateBlog(blog.id || '', {likes: blog.likes + 1})
        setBlogs(blogs.map(b => b.id === blog.id ? {...b, likes: b.likes + 1} : b))
    }

    const deleteBlog = async (blog: BlogType) => {
        if (window.confirm('Do you really want to delete this blog?')) {
            await deleteSingleBlog(blog)
            setBlogs(blogs.filter(b => b.id !== blog.id))
        }
    }

    const createBlog = async (blog: BlogType) => {
        const success: any = await createNewBlog(blog)
        if (success) {
            blog.user = user
            blog.id = success.data.id
            setBlogs([...blogs, blog])
            setSuccess(`Succesfully added blog ${blog.title} by ${blog.author}`)
        } else {
            setError('Failed to add a new Blog')
        }
    }

    return (
        <div>
            <h1>Blogs listing</h1>
            <p>{user.username} logged in <button onClick={logOut}>Log out</button></p>
            {showForm && <BlogForm createBlog={createBlog} />}
            <button onClick={() => setShowForm(!showForm)}>{showForm ? 'cancel' : 'New Blog'}</button>
            {blogs.sort((b1, b2) => b1.likes > b2.likes ? -1 : 1).map(b => <Blog user={user} deleteBlog={deleteBlog} updateBlog={likeBlog} key={b.title + b.author} blog={b} />)}
        </div>
    )
}

export const Blog = ({blog, updateBlog, deleteBlog, user}: BlogProps) => {
    const [open, setOpen] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    return (
        <div style={blogStyle}>
            <p onClick={() => setOpen(!open)}>{blog.title} by {blog.author}</p>
            {open && <div>
                <a href={blog.url}>{blog.url}</a>
                <p>{blog.likes || 0} likes <button onClick={() => updateBlog(blog)}>like</button></p>
                {blog.user && <p>Added by {blog.user.username}</p>}
                {blog.user && blog.user.username === user.username && <button onClick={() => deleteBlog(blog)}>Delete</button>}
            </div>}
        </div>
    )
}

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
                    createBlog({title: title.value, author: author.value, url: url.value, likes: 0})
                    title.reset()
                    author.reset()
                    url.reset()
                }}>Create</button>
            </form>
        </div>
    )
}

export default Blogs
