import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import axios from 'axios'

const API_URL = 'http://localhost:3001/persons'

interface Person {
    name: string
    number: string
    id: number
}

interface InputProps {
    title: string
    value: string
    change: (value: string) => void
}

interface Notification {
    type: 'Error' | 'Success' | ''
    message: string
}

const Input = ({title, value, change}: InputProps) => 
    <p>{title} <input value={value} onChange={(event) => change(event.target.value)} /></p>

const InputForm = ({fields, submit}: {fields: InputProps[], submit: () => void}) => 
    <div>
        <form onSubmit={event => {
            event.preventDefault()
            submit()
        }}>
            <h3>add a new</h3>
            {fields.map(field => <Input key={field.title} {...field} />)}
            <button>
                Create
            </button>
        </form>
    </div>

const PeopleListing = ({people, remove}: {people: Person[], remove: (id: number) => void}) => 
    <div>
        <h3>Numbers</h3>
        {people.map(({name, number, id}) => <p key={id}>{name} {number} <button onClick={() => remove(id)}>delete</button></p>)}
    </div>

const Error = ({type, message}: Notification) => {
    return <p className={type.toLowerCase()}>{message}</p>
}

const App = () => {
    const [filter, changeFilter] = useState('')
    const [people, setPeople] = useState<Array<Person>>([])
    const [newName, changeNewName] = useState('')
    const [newPhone, changeNewPhone] = useState('')
    const [notification, changeNotification] = useState({message: '', type: ''} as Notification)

    const fetchPeople = async () => {
        const res = await axios.get(API_URL)
        setPeople(res.data as Person[])
    }

    useEffect(() => {
        fetchPeople()
    }, [])

    const createInputs = (): InputProps[] => {
        return [
            {
                title: 'name :',
                value: newName,
                change: changeNewName
            },
            {
                title: 'phone :',
                value: newPhone,
                change: changeNewPhone
            },
        ]
    }

    const notify = (type: 'Error' | 'Success', message: string) => {
        changeNotification({type, message})
        setTimeout(() => changeNotification({type: '', message: ''}), 5000)
    }

    const create = async () => {
        if (!people.some(({name}) => name === newName)) {
            const newUser = (await axios.post(API_URL, {name: newName, number: newPhone})).data as Person
            setPeople([...people, newUser])
            changeNewName('')
            changeNewPhone('')
            notify('Success', `Created user ${newUser.name}`)
        } else {
            if (window.confirm(`${newName} already in the phonebook, do you want to update the number?`)) {
                const user = {...people.find(p => p.name === newName), number: newPhone} as Person
                try {
                    await axios.put(`${API_URL}/${user && user.id}`, user)
                    setPeople(people.map(p => p.id !== user.id ? p : user))
                    changeNewName('')
                    changeNewPhone('')
                    notify('Success', `Updated user ${user.name}`)
                } catch (e) {
                    console.log(e)
                    changeNotification({type: 'Error', message: `Failed to update ${user.name}, maybe they have been removed?`})
                    setTimeout(() => changeNotification({type: '', message: ''}), 5000)
                }
            }
        }
    }

    const remove = async (id: number) => {
        const user = people.find((p) => p.id === id)
        if (window.confirm(`Do you want to remove ${user && user.name} for sure?`)) {
            try {
                await axios.delete(`${API_URL}/${id}`)
                setPeople(people.filter(p => p.id !== id))
                notify('Success', `Deleted user ${user && user.name}`)
            } catch (e) {
                console.log(e)
                notify('Error', `Failed to delete user ${user && user.name}`)
            }
        }
    }

    const show = filter ?  
                    people.filter(({name, number}) => name.toLowerCase().includes(filter.toLowerCase()) || number.toLowerCase().includes(filter.toLowerCase()))
                    : people

    return <div>
        {notification.message && <Error {...notification} />}
        <h1>Phonebook</h1>
        <Input title={'filter shown with'} value={filter} change={(value) => changeFilter(value)} />
        <InputForm 
            fields={createInputs()}
            submit={create}
        />
        <PeopleListing people={show} remove={remove} />
    </div>

}

ReactDOM.render(<App />, document.getElementById('root'));
