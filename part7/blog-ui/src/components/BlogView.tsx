import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { State } from '../index'
import { BlogType } from '../types'
import { VoteForBlogAction, VoteBlogType, AddCommentAction, AddCommentType } from '../reducers/blogsReducer'
import { useState } from 'react'

interface BlogParams {
    id: string,
}

type BlogRouterProps =  RouteComponentProps<BlogParams>

type BlogViewProps = {
    blog: BlogType,
    voteBlog: (blog: BlogType)  => Promise<void | VoteBlogType>,
    addComment: (blog: BlogType, comment: string) => Promise<void | AddCommentType>,
} & BlogRouterProps

const BlogView = ({blog, addComment, voteBlog}: BlogViewProps) => {
    const [comment, setComment] = useState('')

    if (!blog) {
        return null
    }

    const newComment = () => {
        addComment(blog, comment)
        setComment('')
    }

    return <div>
        <h1>{blog.title}</h1>
        <a href={blog.url}>{blog.url}</a>
        <p>{blog.likes || 0} likes <button onClick={() => voteBlog(blog)}>like</button></p>
        {blog.user && <p>Added by {blog.user.name}</p>}
        <h4>comments</h4>
        <ul>
            {blog.comments && blog.comments.map(c => <li key={c}>{c}</li>)}
        </ul>
        <input value={comment}  onChange={(e) => setComment(e.target.value)} />
        <button onClick={newComment}>add comment</button>
    </div>
}

const mapStateToProps = (state: State, ownProps: BlogRouterProps) => {
    const { id } = ownProps.match.params
    return {
        blog: state.blogs.find(b => b.id === id) as BlogType,
    }
}

const mapDispatchToProps = {
    voteBlog: VoteForBlogAction,
    addComment: AddCommentAction,
}

export default withRouter<BlogRouterProps, any>(connect(mapStateToProps, mapDispatchToProps)(BlogView))
