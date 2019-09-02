import React from 'react'
import { NotificationType } from '../reducers/notificationReducer'
import { State } from '../index'
import { connect } from 'react-redux'

interface NotificationProps {
    notifs: NotificationType[],
}

const Notifications = ({notifs}: NotificationProps) => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
    }

    return (
        <div>
            {notifs.map((n) => {
                return <div key={n.id} style={{...style, backgroundColor: n.type === 'ERROR' ? 'red' : 'lightgreen'}}>
                    <div>{n.message}</div>
                </div>
            })}
        </div>
    )
}

const mapStateToProps = (state: State) => {
    return {
        notifs: state.notifications,
    }
}

export default connect(mapStateToProps)(Notifications)
