
import * as express from 'express'
import { URL } from './utils/config'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import { blogRouter } from './controllers/blogController'
import { userRouter } from './controllers/userController'
import { jwtMiddleware } from './middleware/token'

const initMongo = async () => {
    try {
        await mongoose.connect(URL, { useNewUrlParser: true, useFindAndModify: false })
        console.log('Connected to mongo')
    } catch (e) {
        console.log(e)
        console.log('Failed to connect to mongo')
    }
}

export const app = express()

initMongo()

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())
app.use(jwtMiddleware)

app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)
