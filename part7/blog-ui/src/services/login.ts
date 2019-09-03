import axios from 'axios'

export const userApi = 'http://localhost:3001/api/users'

export const getToken = () => {
    return `Bearer ${JSON.parse(window.localStorage.getItem('blogsUser') || '').token as string}`
}

export const userLogin = async (username: string, password: string) => {
    try {
        const response = (await axios.post(userApi + '/login', {username, password})).data
        return response
    } catch (e) {
        console.log(e)
        return false
    }
}
