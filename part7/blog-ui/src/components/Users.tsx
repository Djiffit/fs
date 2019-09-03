import { connect } from 'react-redux'
import { State } from '../index'
import React from 'react'
import { UserType } from 'types'
import { Link } from 'react-router-dom'

export type UserData = {
    blogs: number,
} & UserType

interface UsersProps {
    users: UserData[],
}

const Users = ({users}: UsersProps) => {
    return (<div>
        <h3>Authors</h3>
        <table>
            <thead>
                <tr>
                    <td><b>User</b></td>
                    <td><b>Blogs created</b></td>
                </tr>
            </thead>

            <tbody>
                {users.map(u => <tr key={u.id}>
                    <td><Link to={`/users/${u.id}`}> {u.name} </Link></td>
                    <td>{u.blogs}</td>
                </tr>)}
            </tbody>

        </table>
    </div>)
}

const mapStateToProps = ({blogs}: State) => {
    const userById = new Map<string, UserData>()
    blogs.forEach(b => {
        if (b.user && b.user.id) {
            const curr = userById.get(b.user.id) || {blogs: 0} as UserData
            userById.set(b.user.id, {...b.user, blogs: curr.blogs + 1})
        }
    })

    return {
        users: Array.from(userById.values()),
    }
}

export default connect(mapStateToProps)(Users)
