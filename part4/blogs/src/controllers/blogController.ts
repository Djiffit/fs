import { Router } from 'express'
import { Blog } from '../models/Blog'
import { User } from '../models/User'
import { UserType } from '../types'
import { getUserId } from '../utils/user_helpers'
const blogRouter = Router()

blogRouter.get('/', async (request, response) => {
    response.json(await Blog.find({}).populate('user', {username: 1, name: 1}))
})

blogRouter.post('/', async (request, response) => {
    request.body.likes = request.body.likes || 0

    const reqId = await getUserId(request)

    if (!reqId) {
        return response.status(401).json('No valid token supplied')
    }

    const user = (await User.findById(reqId)) as any as UserType

    request.body.user = user.id

    const blog = new Blog(request.body)

    try {
        if (!request.body.title || !request.body.url) {
            throw new Error('Missing required field')
        }
        response.status(201).json(await blog.save())
    } catch (e) {
        response.status(400).json(e)
    }
})

blogRouter.delete('/:id', async (request, response) => {
    try {

        const reqId = await getUserId(request)

        if (!reqId) {
            return response.status(401).json('No valid token supplied')
        }

        const {id} = request.params

        const blog = (await Blog.findById(id)) as any

        if (blog.user.toString() === reqId.toString()) {
            await Blog.findByIdAndRemove(id)
            response.status(204).send()
        } else {
            response.status(401).json('Delete not authorized')
        }
    } catch (e) {
        console.log(e)
        response.status(400).json(e)
    }
})

blogRouter.patch('/:id', async (request, response) => {
    try {
        const { id } = request.params
        const newData = request.body
        await Blog.findOneAndUpdate({_id: id}, newData, {upsert: true})

        response.status(200).send()
    } catch (e) {
        console.log(e)
        response.status(400).json(e)
    }
})

export default blogRouter
