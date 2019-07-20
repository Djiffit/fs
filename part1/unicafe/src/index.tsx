import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { feedbackValues } from './data'

export interface Feedback {
  name: string
  value: number
}

interface Button {
    title: string
    action: () => void
}

const Button = ({title, action}: Button) => 
    <button onClick={action}>
        {title}
    </button>

const Statistic = ({name, value}: {name: string, value: string | number}) => (
    <tr>
        <td>{name}</td>
        <td>{value}</td>
    </tr>
)

const Statistics = ({votes}: {votes: number[]}) => {
    const stats = feedbackValues
                    .map(({name, value}) => ({name, count: votes.filter(vote => vote === value).length}))
                    .filter(({name, count}) => count > 0)

    const positive = votes.filter(vote => vote > 0).length / votes.length
    const average = votes.reduce((total, vote) => vote + total, 0) / votes.length
    
    if (stats.length === 0) {
        return <p>No feedback given</p>
    }

    return (
        <div>
            <h1>Statistics</h1>
            <table>
                <tbody>
                    {stats.map(({name, count}) => <Statistic key={name} name={name} value={count} />)}
                    <Statistic key={'all'} name={'all'} value={votes.length} />
                    <Statistic key={'pos'} name={'positive'} value={Math.round(positive * 1000) / 10 + ' %'} />
                    <Statistic key={'avg'} name={'average'} value={Math.round(average * 100) / 100} />
                </tbody>
            </table>
        </div>
    )
}

const App = () => {
    const [votes, updateVotes] = useState<Array<number>>([])
    
    return <div>
        <h1>Give feedback</h1>
        {feedbackValues.map(({name, value}) => 
            <Button key={value} title={name} action={() => updateVotes([...votes, value])} />)}

        <Statistics votes={votes} />
    </div>
}

ReactDOM.render(<App />, document.getElementById('root'));
