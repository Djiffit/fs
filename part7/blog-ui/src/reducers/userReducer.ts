import { UserType } from '../types'
import { Dispatch } from 'redux'
import { userLogin } from '../services/login'
import { createNotificationAction } from './notificationReducer'

export interface UserStore {
    loggedIn: boolean,
    user: UserType,
}

const initialState =  {
    loggedIn: false,
    user: {} as UserType,
} as UserStore


export interface ChangeUserData {
    type: 'CHANGE_USER',
    user: UserType,
}

export interface LogoutAction {
    type: 'LOGOUT',
}

export type userActionType = ChangeUserData | LogoutAction

export const getLocalUserAction = (): ChangeUserData => {
    let user = {} as UserType
    try {
        const userData = window.localStorage.getItem('blogsUser')
        if (userData) {
            user = JSON.parse(userData) as UserType
        }
    } catch (e) {
        console.log('failed to read user')
    }

    return {
        type: 'CHANGE_USER',
        user,
    }
}

export const loginAction = (username: string, password: string) => {
    return async (dispatch: Dispatch): Promise<ChangeUserData | boolean>  => {
        const user = await userLogin(username, password)
        if (user) {
            window.localStorage.setItem('blogsUser', JSON.stringify(user))
            return dispatch({
                type: 'CHANGE_USER',
                user,
            } as ChangeUserData)
        }
        createNotificationAction('Failed to log in', 'ERROR', dispatch)
        return false
    }
}

export const logOutAction = () => {
    window.localStorage.removeItem('blogsUser')
    return {
        type: 'LOGOUT',
    }
}

const userReducer = (state = initialState, action: userActionType) => {
    switch (action.type) {
        case 'LOGOUT':
            return {
                loggedIn: false,
                user: {} as UserType,
            }
        case 'CHANGE_USER':
            return {
                loggedIn: !!action.user.username,
                user: action.user,
            }
    }

    return state
}

export default userReducer
