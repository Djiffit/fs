import { BlogType } from '../types'

export interface TopBlogType {
    author: string,
    blogs: number,
}

export interface FavoriteBlogType {
    title: string,
    author: string,
    likes: number,
}

export interface TotalLikesType {
    author: string,
    likes: number,
}


export const dummy = (blogs: BlogType[]) => {
    return 1
}

export const totalLikes = (blogs: BlogType[]) => {
    return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

export const favoriteBlog = (blogs: BlogType[]): FavoriteBlogType | undefined => {
    if (blogs.length === 0) {
        return undefined
    }

    const top: BlogType = blogs.sort((a, b) => a.likes < b.likes ? 1 : -1)[0]

    return {
        title: top.title,
        author: top.author,
        likes: top.likes,
    }
}


export const mostLikes = (blogs: BlogType[]): TotalLikesType | undefined => {
    if (blogs.length === 0) {
        return undefined
    }

    const topEntry = Array.from(blogs.reduce((cache, curr) => {
        cache.set(curr.author, (cache.get(curr.author) || 0) + curr.likes)
        return cache
    }, new Map<string, number>()).entries()).reduce((prev, curr) => {
        if (prev[1] <= curr[1]) {
            prev = curr
        }
        return prev
    }, ['', 0])

    return {
        author: topEntry[0],
        likes: topEntry[1],
    }
}


export const topBlogger = (blogs: BlogType[]): TopBlogType | undefined => {
    if (blogs.length === 0) {
        return undefined
    }

    const topEntry = Array.from(blogs.map(b => b.author).reduce((cache, curr) => {
        cache.set(curr, (cache.get(curr) || 0) + 1)
        return cache
    }, new Map<string, number>()).entries()).reduce((prev, curr) => {
        if (prev[1] <= curr[1]) {
            prev = curr
        }
        return prev
    }, ['', 0])

    return {
        author: topEntry[0],
        blogs: topEntry[1],
    }
}
