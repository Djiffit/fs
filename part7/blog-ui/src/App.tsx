import React, { useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import { getLocalUserAction, logOutAction } from './reducers/userReducer'
import Notifications from './components/Notifications'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { State } from './index'
import { connect } from 'react-redux'
import { GetAllBlogs } from './reducers/blogsReducer'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import { UserType } from './types'

interface AppProps {
  initializeLogin: () => void,
  loggedIn: boolean,
  getAll: () => any,
  user: UserType,
  logOut: () => any,
}


const App = ({initializeLogin, user, logOut, getAll, loggedIn}: AppProps) => {
  useEffect(() => {
    initializeLogin()
    getAll()
  }, [initializeLogin, getAll])

  const linkStyle = {
    padding: '10px',
  }
  return (
    <div>
      <Notifications />
      <Router>
        <div>
          {!loggedIn ? <Route path='/' render ={() => <Login />} />
           :
           <div>
              <p style={{backgroundColor: 'lightGrey', padding: '3px'}}>
                <Link style={linkStyle} to='/blogs'>blogs</Link>
                <Link style={linkStyle} to='/users'>users</Link>
                {user.username} logged in <button onClick={logOut}>Log out</button>
              </p>
             <h1>Blogs blogs blogs</h1>
             <Route path='/blogs/:id' render={() => <BlogView />} />
             <Route exact path='/blogs' render={() => <Blogs />} />
             <Route exact path='/users' render={() => <Users />} />
             <Route path='/users/:id' render={() => <User />} />
           </div>
           }
        </div>
      </Router>
    </div>
  )
}

const mapStateToProps = ({user}: State) => {
  return {
    loggedIn:  user.loggedIn,
    user: user.user,
  }
}

export default connect(mapStateToProps, {initializeLogin:  getLocalUserAction, getAll: GetAllBlogs, logOut: logOutAction})(App)
