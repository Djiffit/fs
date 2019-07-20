import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

interface Course {
    name: string
    parts: Part[]
}
  
interface Part {
    part: string
    exercises: number
}

const Header = ({title}: {title: String}) => <h1>{title}</h1>

const Content = ({parts}: {parts: Part[]}) => 
    <div>
        {parts.map((part: Part) => <Part key={part.part} {...part} />)}
    </div>

const Part = ({part, exercises}: Part) => <p>{part} {exercises}</p>

const Total = ({parts}: {parts: Part[]}) => {
    const count = parts.reduce((prev, part) => prev + part.exercises, 0)

    return (
        <p>Number of exercises: {count}</p>
    )
}

const Course = ({name, parts}: Course) => (
    <div>
        <Header title={name} />
        <Content parts={parts} />
        <Total parts={parts} />
    </div>
)

const App = () => {
    const courseData: Course = {
        name: 'Half Stack application development',
        parts: [
            {
                part: 'Fundamentals of React',
                exercises: 10
            },
            {
                part: 'Using props to pass data',
                exercises: 7
            },
            {
                part: 'State of a component',
                exercises: 14
            },
        ]   
    }

    return <Course {...courseData} />
}

ReactDOM.render(<App />, document.getElementById('root'))
