import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers'
import { ActionType } from './action-types/index'

export const store = configureStore({
  reducer: reducers,
})

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'code',
  },
})

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'text',
  },
})

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'code',
  },
})

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'text',
  },
})
