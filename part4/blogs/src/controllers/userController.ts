import { Router, response } from 'express'
import { User } from '../models/User'
import { validateUser } from '../utils/user_helpers'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { UserType } from '../types'
import { SECRET } from '../utils/config'

export const userRouter = Router()

userRouter.get('/', async (req, res) => {
    res.status(200).json((await User.find({}) as any as UserType[]).map(u => ({
        name: u.name,
        username: u.username,
        id: u.id,
    })))
})

userRouter.post('/', async (request, response) => {
    const user = request.body

    try {
        const valResult = await validateUser(user)
        if (!(valResult)) {
            return response.status(400).json('Invalid user information supplied')
        }
        if (valResult === 'duplicate') {
            return response.status(400).json('Username exists already')
        }
        const saltRounds = 10
        user.password = await bcrypt.hash(user.password, saltRounds)

        const newUser = new User(user)
        response.status(201).json(await newUser.save())
    } catch (e) {
        response.status(400).json(e)
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const user = req.body as UserType

        const dbUser = (await User.findOne({ username: user.username })) as any

        const validUser = dbUser && await bcrypt.compare(user.password, dbUser.password)

        if (validUser) {
            const token = jwt.sign({
                username: dbUser.username,
                id: dbUser._id,
            }, SECRET)

            response.status(200).json({token, username: dbUser.username, name: dbUser.name})
        } else {
            throw new Error('Invalid username or password')
        }
    } catch (e) {
        res.status(401).json('Invalid username or passwodr')
    }
})
