import React from 'react'
import { UserType, BlogType } from '../types'
import { State } from '../index'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'

interface UserParams {
    id: string,
}

type OwnProps = {

} & RouteComponentProps<UserParams>

interface UserProps {
    user: UserType,
    blogs: BlogType[],
}

const User = ({user, blogs}: UserProps) => {
    if (!user.id) {
        return <div>
            LOADING .... XD
        </div>
    }
    return (
        <div>
            <h1>{user.name}</h1>
            <h3>Added blogs</h3>
            <ul>
                {blogs.map(b => <li key={b.id}>{b.title}</li>)}
            </ul>
        </div>
    )
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
    const { id } = ownProps.match.params
    const userBlog = (state.blogs.find(b => b.user && b.user.id === id))

    if (userBlog && userBlog.user) {
        const user = userBlog.user as UserType

        return {
            user,
            blogs: state.blogs.filter(b => b.user && b.user.id === id),
        }
    }

    return {
        user: {} as UserType,
        blogs: [] as BlogType[],
    }
}

export default withRouter<OwnProps, any>(connect(mapStateToProps)((User)))
