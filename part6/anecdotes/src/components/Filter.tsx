import React from 'react'
import { changeFilterActionCreator, FilterActionType } from '../reducers/filterReducer'
import { connect } from 'react-redux'
import { State } from '../index'

interface FilterProps {
    changeFilterActionCreator: (value: string) => FilterActionType,
}

const Filter = ({changeFilterActionCreator}: FilterProps) => {
    const handleChange = (event: any) => {
        changeFilterActionCreator(event.target.value)
    }

    const style = {
        marginBottom: 10,
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

const mapStateToProps = (state: State) => {
    return {
        filter: state.filter,
    }
}

export default connect(mapStateToProps, {changeFilterActionCreator})(Filter)
