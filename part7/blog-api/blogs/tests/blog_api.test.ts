import * as mongoose from 'mongoose'
import * as supertest from 'supertest'
import { app } from '../src/app'
import { Blog } from '../src/models/Blog'
import { manyBlogs } from './list_helper.test'
import { BlogType, UserType } from '../src/types'
import { User } from '../src/models/User'
import * as jwt from 'jsonwebtoken'
import { SECRET } from '../src/utils/config'

const api = supertest(app)
const user: UserType = {
    name: 'tester',
    username: 'testermaster',
    password: '12345',
    id: 'supercool',
}

const getToken = async () => {
    await User.remove({})
    const res = await (new User(user)).save()
    const token = jwt.sign({
        username: 'testermaster',
        id: res.id,
    }, SECRET)

    return `Bearer ${token}`
}

describe('blogs api', () => {

    beforeEach(async () => {
        await Blog.remove({})
        const createBlogs = manyBlogs.map(b => (new Blog(b)).save())
        await Promise.all(createBlogs)
    })

    test('root path returns blogs', async () => {
        const blogs = ((await api.get('/api/blogs')).body) as BlogType[]

        expect(blogs.length).toEqual(manyBlogs.length)
        expect(new Set(blogs.map(b => b.title))).toEqual(new Set(manyBlogs.map(b => b.title)))
        expect(new Set(blogs.map(b => b.url))).toEqual(new Set(manyBlogs.map(b => b.url)))
    })

    test('blogs have a id field and no _id field', async () => {
        const blog = ((await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)).body)[0]

        expect(blog.id).toBeDefined()
        expect(blog._id).toEqual(undefined)

    })

    test('can add a blog', async () => {
        const newBlog = {
            author: 'Pekka',
            title: 'Sipulit kasaan',
            url: 'www.google.fi',
            likes: 666,
        } as BlogType

        const auth = await getToken()

        await api.post('/api/blogs')
                .send(newBlog)
                .set('Authorization', auth)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        const newBlogs = (await Blog.find({})) as any as BlogType[]

        expect(newBlogs.length).toEqual(manyBlogs.length + 1)
        expect(newBlogs.some((b) => b.title === newBlog.title))

    })

    test('likes is 0 if no value is given', async () => {
        const newBlog = {
            author: 'Pekka',
            title: 'Sipulit kasaan',
            url: 'www.google.fi',
        } as BlogType

        const auth = await getToken()
        const res = await api.post('/api/blogs')
                .send(newBlog)
                .set('Authorization', auth)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        const blog = (await Blog.findById(res.body.id)) as any as BlogType

        expect(blog.likes).toEqual(0)
    })

    test('title and url are required fields', async () => {
        const auth = await getToken()
        await api.post('/api/blogs')
            .set('Authorization', auth)
            .send({})
            .expect(400)


        await api.post('/api/blogs')
            .set('Authorization', auth)
            .send({title: 'pekka'})
            .expect(400)

        await api.post('/api/blogs')
            .set('Authorization', auth)
            .send({url: 'google.fi'})
            .expect(400)
    })

    test('can delete a thingading and only with correct user', async () => {
        const auth = await getToken()

        const newBlog = {
            author: 'Pekka',
            title: 'Sipulit kasaan',
            url: 'www.google.fi',
            likes: 33,
        } as BlogType

        const blog = (await api.post('/api/blogs')
                .send(newBlog)
                .set('Authorization', auth)
                .expect(201)
                .expect('Content-Type', /application\/json/)).body

        await api.delete(`/api/blogs/${blog.id}`)
            .expect(401)

        await api.delete(`/api/blogs/${blog.id}`)
            .set('Authorization', auth)
            .expect(204)
        const getBlog = await Blog.findById(blog.id)
        console.log(getBlog)
        expect(!getBlog).toBe(true)
    })

    test('can update a blog', async () => {
        const newBlog = {
            author: 'Pekka',
            title: 'Sipulit kasaan',
            url: 'www.google.fi',
            likes: 33,
        } as BlogType

        const blog = (await (new Blog(newBlog)).save()).toJSON() as BlogType

        await api.patch(`/api/blogs/${blog.id}`)
                    .send({likes: 666, title: 'kukkuluuruu', url: '123', author: 'matti'})

        console.log(`/api/blogs/${blog.id}`)
        const getBlog = (await Blog.findById(blog.id)) as any as BlogType

        expect(getBlog.likes).toEqual(666)
        expect(getBlog.title).toEqual('kukkuluuruu')
        expect(getBlog.url).toEqual('123')
        expect(getBlog.author).toEqual('matti')
    })
})


afterAll(() => {
  mongoose.connection.close()
})
