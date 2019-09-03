import React from 'react'
import { useField } from '../hooks/index'
import { loginAction, ChangeUserData } from '../reducers/userReducer'
import { connect } from 'react-redux'

interface LoginProps {
    loginAction: (username: string, password: string) =>  Promise<boolean | ChangeUserData>,
}

const Login = ({loginAction}: LoginProps) => {
    const username = useField('')
    const password = useField('')

    const login = async () => {
        const res = await loginAction(username.value, password.value)
        if (res) {
            username.reset()
            password.reset()
            console.log('logged in :::)')
        }
    }

    return (
        <div>
            <h1>Login to the blog application</h1>
            <form>
                <p>Username</p><input {...username.input()}/>
                <p>Password</p><input {...password.input()} type='password' />
                <br />
                <button onClick={(e) => {
                    e.preventDefault()
                    login()
                }}>Login</button>
            </form>
        </div>
    )
}

export default (connect(null, {loginAction})(Login))
