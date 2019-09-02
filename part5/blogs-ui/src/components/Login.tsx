import React from 'react'
import { UserType } from '../types'
import { userLogin } from '../services/login'
import { useField } from '../hooks/index'

interface LoginProps {
    changeUser: (user: UserType) => void,
    setError: (message: string) => void,
}

const Login = ({changeUser, setError}: LoginProps) => {
    const username = useField('')
    const password = useField('')

    const login = async () => {
        const res = await userLogin(username.value, password.value)
        if (res) {
            changeUser(res)
        } else {
            setError('Failed to login :::)) were the credentials wrong ????')
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

export default Login
