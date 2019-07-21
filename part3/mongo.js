
const mongoose = require('mongoose')
const dotenv = require('dotenv')

console.log(process.argv)
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

let url = `mongodb+srv://konstaku:${password}@fullstack-y3yft.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', PersonSchema)
  
if (name && number) {
    const person = new Person({
        name,
        number
    })

    person.save().then(p => mongoose.connection.close())

    console.log(`Adding person ${name} with number ${number} to phone book`)
} else {
    Person.find({}).then(people => {
        console.log('Phone book: ')

        const sorted = people.sort((p1, p2) => {
            if (p1.name < p2.name) return -1
            if (p2.name < p1.name) return 1
            return 0
        })

        sorted.forEach(p => console.log(`${p.name.padEnd(25)} ${p.number}`))
        mongoose.connection.close()
    })
}