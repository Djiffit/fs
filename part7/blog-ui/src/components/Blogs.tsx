import React, { useState } from 'react'
import { BlogType, UserType } from '../types'
import BlogForm from './BlogForm'
import Blog from './Blog'
import { State } from '../index'
import { CreateBlogAction, VoteForBlogAction, DeleteBlogAction, CreateBlogType, VoteBlogType, DeleteBlogType } from '../reducers/blogsReducer'
import { connect } from 'react-redux'
import { logOutAction } from '../reducers/userReducer'


interface BlogsProps {
    user: UserType,
    blogs: BlogType[],
    createBlog: (blog: BlogType, user: UserType) => Promise<void | CreateBlogType>,
    voteBlog: (blog: BlogType)  => Promise<void | VoteBlogType>,
    deleteBlog: (blog: BlogType, user: UserType) => Promise<void | DeleteBlogType>,
    logOut: () => any,
}

const Blogs = ({user, blogs, createBlog}: BlogsProps) => {
    const [showForm, setShowForm] = useState(false)

    return (
        <div>
            {showForm && <BlogForm createBlog={(blog: BlogType) => createBlog(blog, user)} />}
            <button onClick={() => setShowForm(!showForm)}>{showForm ? 'cancel' : 'New Blog'}</button>
            {blogs.map(b => <Blog key={b.id} blog={b} />)}
        </div>
    )
}

const mapStateToProps = (state: State) => {
    return {
        user: state.user.user,
        blogs: state.blogs.sort((b1, b2) => b1.likes > b2.likes ? -1 : 1),
    }
}

const mapDispatchToProps = {
    createBlog: CreateBlogAction,
    voteBlog: VoteForBlogAction,
    deleteBlog: DeleteBlogAction,
    logOut: logOutAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Blogs)
