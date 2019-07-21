import * as dotenv from 'dotenv'
dotenv.config()
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import Person, { getAllPeople, findPerson } from './models/person'
import { runInNewContext } from 'vm';


const PORT = process.env.PORT || 3001

export interface Person {
    name: string
    number: string
    _id: string
}

const app = express()

const URL = process.env.MONGO_URL as string

const initMongo = async () => {
    try {
        await mongoose.connect(URL, { useNewUrlParser: true, useFindAndModify: false })
        console.log('Connected to mongo')
    } catch (e) {
        console.log(e)
        console.log('Failed to connect to mongo')
    }
}

const errorHandler = (error: any,
                      request: express.Request,
                      response: express.Response,
                      next: express.NextFunction) => {

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'Invalid id' })
    }

    if (error.error === 'user-not-found') {
        return response.status(400).send({ error: 'User not found with id'})
    }

    if (error.name === 'required-fields') {
        return response.status(400).send({ error: 'Missing required fields'})
    }

    if (error.errors) {
        const ename = error.errors.name
        const enumber = error.errors.number

        if (ename) {
            return response.status(400).send({ error: ename.message })
        }

        if (enumber) {
            return response.status(400).send({ error: enumber.message })
        }
    }

    next(error)
}

initMongo()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())

app.use(morgan((tokens, req, res) => {
    return  [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
      ].join(' ')
}))

app.get('/api/persons', async (req, res, next) => {
    const all = await getAllPeople()
    res.json(all)
})

app.get('/info', async (req, res) => {
    res.send(`<div>
                <p>Phonebook has info for ${(await getAllPeople()).length} people
                <p>${(new Date()).toUTCString()}</p>
            </div>`)
})

app.get('/api/persons/:byId', ({params: { byId }}, res, next) => {
    findPerson(byId).then(p => res.json(p)).catch((e) => next(e))
})

app.delete('/api/persons/:byId', ({params: { byId }}, res, next) => {
    Person.findByIdAndRemove(byId).then((resp) => res.json(resp)).catch(e => next(e))
})

app.post('/api/persons', ({body: {name, number}}, res, next) => {
    if (!name || !number) {
        return next({name: 'required-fields'})
    } else {
        const person = new Person({
            name,
            number,
        } as mongoose.DeepPartial<Person>)

        person.save().then(resp => res.status(201).json(resp.toJSON()))
                                    .catch(e => next(e))
    }
})

app.put('/api/persons/:id', ({params: {id}, body: {name, number}}, res, next) => {
    if (!name || !number) {
        return next({name: 'required-fields'})
    }

    Person.findByIdAndUpdate(id, {name, number}).then((update) => {
        if (!update) {
            return next({error: 'user-not-found'})
        }
        res.json(update)
    }).catch((e) => next(e))
})

app.listen(PORT)
app.use(errorHandler)
