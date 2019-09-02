import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import { UserType } from './types'

const App: React.FC = () => {
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    try {
      const userData = window.localStorage.getItem('blogsUser')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (e) {
      console.log('failed to read user')
    }
  }, [])

  const changeUser = (user: UserType) => {
    window.localStorage.setItem('blogsUser', JSON.stringify(user))
    setUser(user)
  }

  const logOut = () => {
    window.localStorage.removeItem('blogsUser')
    setUser(undefined)
  }

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => {
        setError('')
    }, 3000)
  }

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => {
        setSuccess('')
    }, 3000)
  }

  return (
    <div>
      {success && <div style={{borderRadius: '2px', backgroundColor: 'lightgreen'}}>
              <p>{success}</p>
          </div>}
      {error && <div style={{borderRadius: '2px', backgroundColor: 'red', color: 'white'}}>
          <p>{error}</p>
      </div>}
      {!user && <Login setError={showError} changeUser={changeUser} />}
      {user && <Blogs setError={showError} setSuccess={showSuccess} logOut={logOut} user={user} />}
    </div>
  )
}

export default App
