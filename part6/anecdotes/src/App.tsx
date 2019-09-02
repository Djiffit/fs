import React, { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notifications from './components/Notifications'
import Filter from './components/Filter'
import { createInitAction } from './reducers/anecdoteReducer'
import { connect } from 'react-redux'

export interface AppProps {
    createInitAction: () => any,
}

const App = ({createInitAction}: AppProps) => {

    useEffect(() => {
        createInitAction()
    }, [createInitAction])

    return (
        <div>
            <h2>Anecdotes</h2>
            <Filter />
            <AnecdoteList />
            <AnecdoteForm />
            <Notifications />
        </div>
    )
}

export default connect(null, {createInitAction})(App)
