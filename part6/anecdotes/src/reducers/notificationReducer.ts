import { getId } from './anecdoteReducer'
import { Dispatch } from 'redux'

export interface NotificationCreateType {
    type: 'CREATE_NOTIFICATION',
    notification: NotificationType,
}

export interface NotificationRemoveType {
    type: 'REMOVE_NOTIFICATION',
    id: string,
}

export type NotificationClass = 'ERROR' | 'SUCCESS'

export interface NotificationType {
    message: string,
    id: string,
    type: NotificationClass
}

const asObject = (message: string, type: NotificationClass): NotificationType => {
    return {
        id: getId(),
        message,
        type,
    }
}

const initialNotifications = [] as NotificationType[]

export type NotificationActionType = NotificationCreateType | NotificationRemoveType

export const createDisappearingNotification = (message: string,
                                               type: NotificationClass,
                                               seconds: number) => {

    return async (dispatch: Dispatch) => {
        const notifyAction = dispatch(createNotificationCreator(message, type))
        setTimeout(() => {
            dispatch(deleteNotificationCreator(notifyAction.notification.id))
        }, seconds * 1000)
    }
}

export const createNotificationCreator = (message: string, type: NotificationClass): NotificationCreateType => {
    return {
        type: 'CREATE_NOTIFICATION',
        notification: asObject(message, type),
    }
}

export const deleteNotificationCreator = (id: string): NotificationRemoveType => {
    return {
        type: 'REMOVE_NOTIFICATION',
        id,
    }
}

const notificationReducer = (state= initialNotifications, action: NotificationActionType) => {
    switch (action.type) {
        case 'CREATE_NOTIFICATION':
            return [...state, action.notification]
        case 'REMOVE_NOTIFICATION':
            return state.filter(n => n.id !== action.id)
    }

    return state
}

export default notificationReducer
