import React from 'react'
import App from './App';
import ReactDOM from 'react-dom'
// import { createStore } from 'redux'
// import reducer from './reducer'

// const store = createStore(reducer)
const createApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'))
}


createApp()

// store.subscribe(createApp)

