import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import anecdotes from './anecdotes'

const randomNumber = (ceil: number): number => Math.floor(Math.random() * ceil)

interface AnecdoteView {
    text: string
    votes: number
    next?: () => void
    vote?: () => void
    disableButtons: boolean
}

const Button = ({text, onClick}: {text: String, onClick?: () => void}) => 
    <button onClick={onClick}>
        {text}
    </button>

const AnecdoteView = ({text, votes, next, vote, disableButtons}: AnecdoteView) => 
    <div>
        <p>{text}</p>
        <p>Has {votes} votes</p>
        {!disableButtons && <Button text='vote' onClick={vote} />}
        {!disableButtons && <Button text='next' onClick={next} />}
    </div>

const App = () =>  {
    const [votes, updateVotes] = useState(anecdotes.map(_ => 0))
    const [active, updateActive] = useState(randomNumber(anecdotes.length))

    const maxIndex = votes.indexOf(Math.max.apply(Math, votes))
    const voteFor = (index: number) => {
        const newVotes = votes.map((count, ind) => ind === index ? count + 1 : count)
        updateVotes(newVotes)
    }

    return (
        <div>
            <h1>Anecdote of the day</h1>
            <AnecdoteView 
                    votes={votes[active]}
                    text={anecdotes[active]}
                    next={() => updateActive(randomNumber(anecdotes.length))}
                    vote={() => voteFor(active)} 
                    disableButtons={false}/>
            
            <h1>Top anecdote</h1>
            <AnecdoteView 
                    votes={votes[maxIndex]}
                    text={anecdotes[maxIndex]}
                    disableButtons={true}/>
        </div>)
}
ReactDOM.render(<App />, document.getElementById('root'))