import React from 'react'
import { Part as PartType, Course as CourseType } from '.'

const Header = ({title}: {title: String}) => <h1>{title}</h1>

const Content = ({parts}: {parts: PartType[]}) => 
    <div>
        {parts.map((part) => <Part key={part.id} {...part} />)}
    </div>

const Part = ({name, exercises}: PartType) => <p>{name} {exercises}</p>

const Total = ({parts}: {parts: PartType[]}) => {
    const count = parts.reduce((prev, part) => prev + part.exercises, 0)

    return (
        <h3>Number of exercises: {count}</h3>
    )
}

const Course = ({name, parts}: CourseType) => (
    <div>
        <Header title={name} />
        <Content parts={parts} />
        <Total parts={parts} />
    </div>
)

export default Course