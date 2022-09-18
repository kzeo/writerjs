import { RootState } from '../reducers/index'
import { Action } from '../actions/index'

interface MiddlewareAPI<S, A> {
  getState(): S
  dispatch(action: A): void
}

interface _Middleware<S, A> {
  (api: MiddlewareAPI<S, A>): (next: (action: A) => void) => void
}

export type Middleware = _Middleware<RootState, Action>
