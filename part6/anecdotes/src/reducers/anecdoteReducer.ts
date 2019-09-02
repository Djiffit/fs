import { getAllAnecdotes, createNewAnecdote, voteForThing } from '../api/anecdoteApi'
import { Dispatch } from 'redux'
export interface AnecdoteType {
    content: string,
    id: string,
    votes: number,
}

export interface VoteForAnecdoteActionType {
    type: 'VOTE',
    id: string,
}

export interface CreateAnecdoteActionType {
    type: 'CREATE',
    newAnecdote: AnecdoteType,
}

export interface CreateInitActionType {
    type: 'INIT',
    anecdotes: AnecdoteType[],
}

export type AnecdoteActionType = VoteForAnecdoteActionType | CreateAnecdoteActionType | CreateInitActionType

const initialState = [] as AnecdoteType[]

export const getId = () => (100000 * Math.random()).toFixed(0)

export const anecdoteAsObject = (anecdote: string): AnecdoteType => {
    return {
        id: getId(),
        votes: 0,
        content: anecdote,
    }
}

export const createActionCreator = (newAnecdote: string) => {
    return async (dispatch: Dispatch): Promise<CreateAnecdoteActionType> => {
        const anecdote = anecdoteAsObject(newAnecdote)
        await createNewAnecdote(anecdote)

        return dispatch({
            type: 'CREATE',
            newAnecdote: anecdote,
        } as CreateAnecdoteActionType)
    }
}

export const voteActionCreator = (anecdote: AnecdoteType) => {
    return async (dispatch: Dispatch): Promise<VoteForAnecdoteActionType> => {
        await voteForThing({...anecdote, votes: anecdote.votes + 1})

        return dispatch({
            type: 'VOTE',
            id: anecdote.id,
        } as VoteForAnecdoteActionType)
    }
}

export const createInitAction = () => {
    return async (dispatch: Dispatch): Promise<CreateInitActionType> => {
        const anecdotes = await getAllAnecdotes()

        return dispatch({
            type: 'INIT',
            anecdotes,
        } as CreateInitActionType)
    }
}

const sortAnecdotes = (anecdotes: AnecdoteType[]) => {
    return anecdotes.sort((a1, a2) => {
        if (a1.votes === a2.votes) { return a1.id < a2.id ? -1 : 1 }
        return a1.votes > a2.votes ? -1 : 1
    })
}


const anecdoteReducer = (state = initialState, action: AnecdoteActionType) => {

    switch (action.type) {
        case 'VOTE':
            return sortAnecdotes(state.map(a => a.id === action.id ? {...a, votes: a.votes + 1} : a))
        case 'CREATE':
            return [...state, action.newAnecdote]
        case 'INIT':
            return sortAnecdotes(action.anecdotes)
    }

    return state
}

export default anecdoteReducer
