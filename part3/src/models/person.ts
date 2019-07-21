import * as mongoose from 'mongoose'
import { Person } from 'src/start'
import * as uniqueValidator from 'mongoose-unique-validator'

export const findPerson = async (id: number): Promise<Person | null> => {
    const person = (await Person.findById(id)) as any
    return person ? person.toJSON() : null
}

export const getAllPeople = async (): Promise<Person[]>  => {
    return (await Person.find({})).map(p => p.toJSON())
}

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
    },
})

PersonSchema.plugin(uniqueValidator)

const Person =  mongoose.model('Person', PersonSchema)

export default Person
