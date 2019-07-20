import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Course from './Course'
import { courseData } from './data'

export interface Course {
    name: string
    parts: Part[]
}

export interface Part {
    name: string
    exercises: number
    id: number
}

const App = () => {
    return <div>
        {courseData.map(course => <Course key={course.name} {...course} />)}
    </div>
}

ReactDOM.render(<App />, document.getElementById('root'))
