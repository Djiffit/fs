import * as supertest from 'supertest'
import { app } from '../src/app'
import * as mongoose from 'mongoose'
import { User } from '../src/models/User'
import { UserType } from '../src/types'

const api = supertest(app)

const users: UserType[] = [
    {name: 'Pekka', username: 'mayri', password: '324324', id: '43434343'},
    {name: 'asdfsdafsaf', username: 'gfdgfdgfd', password: 'rewrewre', id: 'fdsafdsfdsa'},
    {name: 'fdfdfdfd', username: 'asassa', password: '4343434', id: 'dsafsadfdsafdsa'},
]

describe('user api', () => {

    beforeEach(async () => {
        await User.remove({})
        const createUsers = users.map(u => (new User(u)).save())

        await Promise.all(createUsers)
    })

    test('users can be created', async () => {
        await api.post('/api/users')
            .send({name: 'Pekka', username: 'Mauriizio', password: 'Sipuli'})
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const user = (await User.findOne({username: 'Mauriizio'})) as any as UserType

        expect(user.name).toEqual('Pekka')
    })

    test('users can be fetced', async () => {
        const res = (await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)).body as UserType[]

        expect(res.length).toEqual(users.length)
    })

    test('user requires valid username and password', async () => {

        const requests = [
            {name: 'Pekka123', username: 'ma', password: 'Sipuli'},
            {name: 'Pekka455', username: 'mfdsfdsfdsa', password: 're'},
            {name: 'Pekk33a', password: 'Sipuli'},
            {name: 'Pekk11a', password: 'Sipuli'},
        ]

        const res = await Promise.all(requests.map(u => api.post('/api/users').send(u).expect(400)))

        expect(res[0].body).toContain('Invalid user information supplied')
    })

    test ('username needs to be unique', async () => {
        const res = await api.post('/api/users').send({name: 'sipuli', username: 'mayri', password: '43434334'}).expect(400)
        expect(res.body).toContain('Username exists already')
    })
})


afterAll(() => {
    mongoose.connection.close()
})
