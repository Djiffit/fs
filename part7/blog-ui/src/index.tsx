import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import notificationReducer from './reducers/notificationReducer'
import blogsReducer from './reducers/blogsReducer'
import userReducer from './reducers/userReducer'
import { NotificationType, BlogType } from './types'
import { UserStore } from './reducers/userReducer'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

export interface State {
    notifications: NotificationType[],
    blogs: BlogType[],
    user: UserStore,
}

const reducer = combineReducers({
    notifications: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

const createApp = () => {
    ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
}

createApp()
store.subscribe(createApp)
