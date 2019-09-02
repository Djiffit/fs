import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import App from './App'
import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterReducer from './reducers/filterReducer'
import { Provider } from 'react-redux'
import { NotificationType } from './reducers/notificationReducer'
import { AnecdoteType } from './reducers/anecdoteReducer'
import thunk from 'redux-thunk'

export interface State {
    notifications: NotificationType[],
    anecdotes: AnecdoteType[],
    filter: string,
}

const reducer = combineReducers({
    notifications: notificationReducer,
    anecdotes: anecdoteReducer,
    filter: filterReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

const createApp = () => {
    ReactDOM.render(<Provider store={store}>
            <App />
        </Provider>, document.getElementById('root'))
}

createApp()
store.subscribe(createApp)

