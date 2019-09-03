import { UserType } from '../types'
import { User } from '../models/User'
import { Request } from 'express-serve-static-core'

export const validateUser = async (user: UserType) => {
    if (!user.name || !user.username || !user.password || user.username.length < 3 || user.password.length < 3) {
        return false
    }

    if ((await User.find({ username: user.username })).length > 0) {
        return 'duplicate'
    }

    return true
}

export const getUserId = async (request: Request) => {
    return request.body.userData && request.body.userData.id as string | undefined
}
