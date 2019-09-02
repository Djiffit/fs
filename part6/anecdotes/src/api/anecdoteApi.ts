import axios from 'axios'
import { AnecdoteType } from '../reducers/anecdoteReducer'
const apiUrl = 'http://localhost:3001/anecdotes'

export const getAllAnecdotes = async () => {
    return (await axios.get(apiUrl)).data
}

export const createNewAnecdote = async (anecdote: AnecdoteType) => {
    await axios.post(apiUrl, anecdote)
}

export const voteForThing = async (anecdote: AnecdoteType) => {
    await axios.patch(apiUrl + `/${anecdote.id}`, anecdote)
}
