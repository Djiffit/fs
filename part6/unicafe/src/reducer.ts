
export enum Vote {
    Good = 'GOOD',
    Ok = 'OK',
    Bad = 'BAD',
    Zero = 'ZERO',
}

export interface IncrementAction {
    type: Vote
}

export interface VoteStateType {
    good: number,
    bad: number,
    ok: number,
}

export default (state = initialState, action: IncrementAction) => {
    console.log(action)

    switch (action.type) {
        case Vote.Good:
            return {...state, good: state.good + 1}
        case Vote.Ok:
            return {...state, ok: state.ok + 1}
        case Vote.Bad:
            return {...state, bad: state.bad + 1}
        case Vote.Zero:
            state = initialState
            return state
        default:
            return state
    }
}

const initialState: VoteStateType = {
    good: 0,
    ok: 0,
    bad: 0,
}
