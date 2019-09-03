import { NotificationType, NotificationClass } from '../types'
import { Dispatch } from 'redux'

const initialState = [] as NotificationType[]

export interface CreateNotificationType {
    type: 'CREATE_NOTIFICATON',
    notification: NotificationType,
}

export interface DeleteNotificationType {
    type: 'DELETE_NOTIFICATION',
    id: string,
}

export type NotificationActionType = CreateNotificationType | DeleteNotificationType

export const getId = () => `${Math.random() * 100000000}`

export const createNotificationAction = (message: string, type: NotificationClass, dispatch: Dispatch, delay = 3): void => {
    const id = getId()
    dispatch({
        type: 'CREATE_NOTIFICATON',
        notification: {
            message,
            id,
            class: type,
        },
    })
    setTimeout(() => {
        dispatch(deleteNotificationAction(id))
    }, delay * 1000)
}

export const deleteNotificationAction = (id: string): DeleteNotificationType => {
    return {
        type: 'DELETE_NOTIFICATION',
        id,
    }
}

const notificationReducer = (state = initialState, action: NotificationActionType) => {
    switch (action.type) {
        case 'CREATE_NOTIFICATON':
            return [...state, action.notification]
        case 'DELETE_NOTIFICATION':
            return state.filter(({id}) => id !== action.id)
    }

    return state
}

export default notificationReducer
