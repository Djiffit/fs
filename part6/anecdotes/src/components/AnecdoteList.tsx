import React from 'react'
import { voteActionCreator, AnecdoteType, VoteForAnecdoteActionType } from '../reducers/anecdoteReducer'
import { createDisappearingNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { State } from '../index'

interface AnecdoteProps {
    anecdotes: AnecdoteType[],
    createDisappearingNotification: any,
    voteCreator: (anecdote: AnecdoteType) => Promise<VoteForAnecdoteActionType>,
}

const AnecdoteList = ({anecdotes, createDisappearingNotification, voteCreator}: AnecdoteProps) => {
    const vote = (anecdote: AnecdoteType) => {
        voteCreator(anecdote)
        createDisappearingNotification(`Vote recorded succesfully for ${anecdote.content}`, 'SUCCESS', 3)
    }

    return(
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>,
            )}
        </div>
    )
}

const mapStateToProps = (state: State) => {
    return {
        anecdotes: state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter)),
    }
}

const mapDispatchToProps = {
    createDisappearingNotification,
    voteCreator: voteActionCreator,
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)
