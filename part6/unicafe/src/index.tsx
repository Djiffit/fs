import React from 'react'
import { Vote } from './reducer';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)
const createApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'))
}




const App: React.FC = () => {
    const good = () => {
        store.dispatch({
            type: Vote.Good,
        })
    }

    const bad = () => {
        store.dispatch({
            type: Vote.Bad,
        })
    }

    const ok = () => {
        store.dispatch({
            type: Vote.Ok,
        })
    }

    const zero = () => {
        store.dispatch({
            type: Vote.Zero,
        })
    }

    return (
        <div>
            <button onClick={good}>good</button>
            <button onClick={ok}>ok</button>
            <button onClick={bad}>bad</button>
            <button onClick={zero}>zero stats</button>
            <p>good {store.getState().good}</p>
            <p>bad {store.getState().bad}</p>
            <p>ok {store.getState().ok}</p>
        </div>
    )
}

export default App


createApp()

store.subscribe(createApp)

