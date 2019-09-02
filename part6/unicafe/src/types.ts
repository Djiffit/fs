export interface BlogType {
    title: string,
    author: string,
    url: string,
    likes: number,
    user?: UserType,
    id?: string
}

export interface UserType {
    name: string,
    username: string,
    token: string,
    id: string,
}
