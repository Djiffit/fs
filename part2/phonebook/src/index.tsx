import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import axios from 'axios'

const API_URL = '/api/persons'
const API = axios.create({
    baseURL: API_URL
})

interface Person {
    name: string
    number: string
    _id: string
}

interface InputProps {
    title: string
    value: string
    change: (value: string) => void
}

interface Notification {
    type: 'Error' | 'Success'
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

const PeopleListing = ({people, remove}: {people: Person[], remove: (_id: string) => void}) => 
    <div>
        <h3>Numbers</h3>
        {people.map(({name, number, _id}) => <p key={_id}>{name} {number} <button onClick={() => remove(_id)}>delete</button></p>)}
    </div>

const Error = ({type, message}: Notification) => {
    return <p className={type.toLowerCase()}>{message}</p>
}

const App = () => {
    const [filter, changeFilter] = useState('')
    const [people, setPeople] = useState<Array<Person>>([])
    const [newName, changeNewName] = useState('')
    const [newPhone, changeNewPhone] = useState('')
    const [notification, changeNotification] = useState({message: '', type: 'Success'} as Notification)

    const fetchPeople = async () => {
        const res = await API.get('/')
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
        setTimeout(() => changeNotification({type: 'Success', message: ''}), 5000)
    }

    const create = async () => {

        try {
            if (!people.some(({name}) => name === newName)) {
                const newUser = (await API.post('/', {name: newName, number: newPhone})).data as Person
                console.log(newUser)
                setPeople([...people, newUser])
                changeNewName('')
                changeNewPhone('')
                notify('Success', `Created user ${newUser.name}`)
            } else {
                if (window.confirm(`${newName} already in the phonebook, do you want to update the number?`)) {
                    const user = {...people.find(p => p.name === newName), number: newPhone} as Person
                        await API.put(`${user && user._id}`, user)
                        setPeople(people.map(p => p._id !== user._id ? p : user))
                        changeNewName('')
                        changeNewPhone('')
                        notify('Success', `Updated user ${user.name}`)
                }
            }
        } catch (e) {
            console.log(e.response.data.error)
            notify('Error', (e.response.data.error) || `Failed to update phonebook`)
        }
    }

    const remove = async (id: string) => {
        const user = people.find((p) => p._id === id)
        if (window.confirm(`Do you want to remove ${user && user.name} for sure?`)) {
            try {
                await API.delete(`/${id}`)
                setPeople(people.filter(p => p._id !== id))
                notify('Success', `Deleted user ${user && user.name}`)
            } catch (e) {
                console.log(e)
                notify('Error', e.response.data.error || `Failed to delete user ${user && user.name}`)
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
