import { NotificationType } from '../types'
import { connect } from 'react-redux'
import { State } from '../index'
import React from 'react'

export interface NotificationProps {
    notifications: NotificationType[],
}

const Notifications = ({notifications}: NotificationProps) => {
    return (
        <div>
            {notifications.map(n => <div key={n.id} style={{border: `3px ${n.class === 'ERROR' ? 'red' : 'green'} solid`}}>
                <p>{n.message}</p>
            </div>)}
        </div>
    )
}

const mapStateToProps = ({notifications}: State) => {
    return {
        notifications,
    }
}

export default connect(mapStateToProps)(Notifications)
