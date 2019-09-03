export interface BlogType {
    title: string,
    comments: string[],
    author: string,
    url: string,
    likes: number,
    user?: UserType,
    id: string
}

export interface UserType {
    name: string,
    username: string,
    token: string,
    id: string,
}

export type NotificationClass =  'ERROR' | 'SUCCESS'

export interface NotificationType {
    class: NotificationClass,
    message: string,
    id: string,
}
