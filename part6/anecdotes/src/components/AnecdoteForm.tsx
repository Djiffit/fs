import { createActionCreator } from '../reducers/anecdoteReducer'
import { useState } from 'react'
import React from 'react'
import { createDisappearingNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

interface AnecdoteProps {
    createAnecdote: (s: string) => any,
    createDisappearingNotification: any,
}

const AnecdoteForm = ({createAnecdote, createDisappearingNotification}: AnecdoteProps) => {
    const [newAnecdote, setAnecdote] = useState('')

    const create = async (e: any) => {
        e.preventDefault()
        createAnecdote(newAnecdote)
        createDisappearingNotification(`Created new anecdote ${newAnecdote}`, 'SUCCESS', 3)
        setAnecdote('')
    }

    return(
        <div>
            <h2>create new</h2>
            <form>
                <div><input onChange={(e) => setAnecdote(e.target.value)} value={newAnecdote} /></div>
                <button onClick={create}>create</button>
            </form>
        </div>
    )
}

const mapDispatchToProps = {
    createAnecdote: createActionCreator,
    createDisappearingNotification,
}

export default connect(null, mapDispatchToProps)(AnecdoteForm)
