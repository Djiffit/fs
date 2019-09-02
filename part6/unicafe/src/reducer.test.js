import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })


  test('zero resets the thing', () => {
    const action = {
      type: 'ZERO'
    }
    const state = {
        good: 55,
        bad: 33,
        ok: 21
    }

    deepFreeze(state)

    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })

  test('multiple actions get counted', () => {
    const actions = [
        'GOOD',
        'GOOD',
        'GOOD',
        'BAD',
        'BAD',
        'OK',
    ].map(s => ({
        type: s
    }))
    const action = {
      type: 'GOOD'
    }
    let state = {
        good: 0,
        bad: 0,
        ok: 0,
    }

    deepFreeze(state)

    state = actions.reduce((prev, curr) => counterReducer(prev, curr), state)

    expect(state).toEqual({
      good: 3,
      ok: 1,
      bad: 2
    })
  })
})