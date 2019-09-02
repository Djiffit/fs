const initialState = ''

type FilterType = string

export interface FilterActionType {
    type: 'CHANGE_FILTER',
    value: FilterType,
}

export const changeFilterActionCreator = (value: string): FilterActionType => {
    return {
        type: 'CHANGE_FILTER',
        value,
    }
}

const filterReducer = (state = initialState, action: FilterActionType) => {
    if (action.type === 'CHANGE_FILTER') {
        return action.value.toLowerCase()
    }

    return state
}

export default filterReducer
