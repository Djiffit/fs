import { BlogType, UserType } from '../types'
import { Dispatch } from 'redux'
import { createNewBlog, deleteSingleBlog, updateBlog, addCommentToBlog, getAllBlogs } from '../services/blogs'
import { createNotificationAction } from './notificationReducer'
const initialState = [] as BlogType[]

export interface CreateBlogType {
    type: 'CREATE_BLOG',
    blog: BlogType,
}

export interface DeleteBlogType {
    type: 'DELETE_BLOG',
    id: string,
}

export interface VoteBlogType {
    type: 'VOTE_BLOG',
    id: string,
}

export interface AddCommentType {
    type: 'ADD_COMMENT',
    comment: string,
    id: string,
}

export interface GetAllBlogsType {
    type: 'GET_ALL_BLOGS',
    blogs: BlogType[],
}

export const CreateBlogAction = (blog: BlogType, user: UserType) => {
    return async (dispatch: Dispatch): Promise<CreateBlogType | void> => {
        const newBlog = await createNewBlog(blog, `Bearer ${user.token}`)
        createNotificationAction(`Blog ${blog.title} created :^)`, 'SUCCESS', dispatch)
        if (newBlog) {
            blog.user = user
            blog.id = newBlog.data.id as string
            return dispatch({
                type: 'CREATE_BLOG',
                blog,
            } as CreateBlogType)
        }
        createNotificationAction(`Blog creation for some reason`, 'ERROR', dispatch)
    }
}

export const VoteForBlogAction = (blog: BlogType) => {
    return async (dispatch: Dispatch): Promise<VoteBlogType | void> => {
        blog.likes += 1
        const vote = await updateBlog(blog.id as string, blog)
        if (vote) {
            createNotificationAction(`Voted for ${blog.title}`, 'SUCCESS', dispatch)
            return dispatch({
                type: 'VOTE_BLOG',
                id: blog.id,
            } as VoteBlogType)
        }
        createNotificationAction(`Vote failed for some reason`, 'ERROR', dispatch)
    }
}

export const DeleteBlogAction = (blog: BlogType, user: UserType) => {
    return async (dispatch: Dispatch): Promise<DeleteBlogType | void> => {
        const success = await deleteSingleBlog(blog, `Bearer ${user.token}`)
        if (success) {
            createNotificationAction(`Blog ${blog.title} deleted`, 'SUCCESS', dispatch)
            return dispatch({
                type: 'DELETE_BLOG',
                id: blog.id,
            } as DeleteBlogType)
        }
        createNotificationAction(`Delete failed for some reason`, 'ERROR', dispatch)
    }
}

export const AddCommentAction = (blog: BlogType, comment: string) => {
    return async (dispatch: Dispatch): Promise<AddCommentType | void> => {
        const success = await addCommentToBlog(blog, comment)
        if (success) {
            createNotificationAction(`Comment ${comment} added :^)`, 'SUCCESS', dispatch)
            return dispatch({
                type: 'ADD_COMMENT',
                comment,
                id: blog.id,
            } as AddCommentType)

        }
        createNotificationAction(`Comment addition failed for some reason`, 'ERROR', dispatch)
    }
}

export const GetAllBlogs = () => {
    return async (dispatch: Dispatch): Promise<GetAllBlogsType | void> => {
        const blogs = await getAllBlogs()
        if (blogs) {
             return dispatch({
                type: 'GET_ALL_BLOGS',
                blogs,
            } as GetAllBlogsType)
        }
        createNotificationAction(`Getting all blogs failed for some reason`, 'ERROR', dispatch)
    }
}


export type BlogActionType = CreateBlogType | DeleteBlogType | AddCommentType | VoteBlogType | GetAllBlogsType

const blogsReducer = (state = initialState, action: BlogActionType) => {
    switch (action.type) {
        case 'CREATE_BLOG':
            return [...state, action.blog]
        case 'DELETE_BLOG':
            return state.filter(b => b.id !== action.id)
        case 'VOTE_BLOG':
            return state.map(b => b.id !== action.id ? b : {...b, votes: b.likes + 1})
        case 'ADD_COMMENT':
            return state.map(blog => blog.id === action.id ? {...blog, comments: [...blog.comments, action.comment]} : blog)
        case 'GET_ALL_BLOGS':
            return action.blogs

    }

    return state
}

export default blogsReducer
