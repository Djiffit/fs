import axios from 'axios'
import { BlogType } from '../types'
import { getToken } from './login'

export const blogsApi = 'http://localhost:3001/api/blogs'

export const createNewBlog = async (blog: BlogType) => {
    try {
        return await axios.post(blogsApi, blog, {headers: {Authorization: getToken()}})
    } catch (e) {
        console.log(e)
        return false
    }
}

export const getAllBlogs = async () => {
    try {
        return (await axios.get(blogsApi)).data
    } catch (e) {
        console.log(e)
    }
}

export const deleteSingleBlog = async (blog: BlogType) => {
    try {
        await axios.delete(`${blogsApi}/${blog.id}`, {headers: {Authorization: getToken()}})
    } catch (e) {
        console.log(e)
    }
}

interface UpdateType {
    likes: number
}

export const updateBlog = async (id: string, blog: UpdateType) => {
    await axios.patch(`${blogsApi}/${id}`, blog)
}
