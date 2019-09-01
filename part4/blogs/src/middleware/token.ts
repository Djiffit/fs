import { Response, Request, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { SECRET } from '../utils/config'

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.get('Authorization')

    if (auth && auth.startsWith('Bearer ')) {
        req.body.userData = jwt.verify(auth.substring(7), SECRET)
    }

    next()
}
