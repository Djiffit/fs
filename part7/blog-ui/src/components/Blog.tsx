import { BlogType } from '../types'
import React from 'react'
import { Link } from 'react-router-dom'

interface BlogProps {
    blog: BlogType,
}

const Blog = ({blog}: BlogProps) => {

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    return (
        <div style={blogStyle}>
            <Link to={'/blogs/' + blog.id}>{blog.title} by {blog.author}</Link>
        </div>
    )
}

export default Blog
