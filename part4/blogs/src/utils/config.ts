import * as dotenv from 'dotenv'

dotenv.config()


export const URL = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST as string : process.env.MONGO_URL as string
export const PORT = process.env.PORT || 3001
export const SECRET = process.env.SECRET || 'Sikrit'

