import axios from 'axios'
import { BlogType } from '../types'

export const blogsApi = 'http://localhost:3001/api/blogs'

export const createNewBlog = async (blog: BlogType, token: string) => {
    try {
        return await axios.post(blogsApi, blog, {headers: {Authorization: token}})
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

export const deleteSingleBlog = async (blog: BlogType, token: string) => {
    try {
        return await axios.delete(`${blogsApi}/${blog.id}`, {headers: {Authorization: token}})
    } catch (e) {
        console.log(e)
        return false
    }
}

interface UpdateType {
    likes: number,
}

export const updateBlog = async (id: string, blog: UpdateType) => {
    try {
        return await axios.patch(`${blogsApi}/${id}`, {likes: blog.likes})
    } catch (e) {
        return false
    }
}

export const addCommentToBlog = async (blog: BlogType, comment: string) => {
    try {
        return await axios.post(blogsApi + `/${blog.id}/comments`, {comment})
    } catch (e) {
        console.log(e)
        return false
    }
}
