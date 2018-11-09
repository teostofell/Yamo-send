import * as types from './actionTypes'

const initialState = {
  restoring: false,
  restoringDone: false,
  loading: false,
  firebaseAuth: null,
  error: null,
  deleted: false,
  pageName: ''
}

export default function session (state = initialState, action) {
  state = { ...initialState, pageName: action.pageName }
  switch(action.type) {
    case types.SESSION_RESTORING:
      return { ...state, restoring: true }
    case types.SESSION_LOADING:
      return { ...state, loading: true }
    case types.SESSION_SUCCESS:
      return { ...state, firebaseAuth: action.user }
    case types.SESSION_ERROR:
      return { ...state, error: action.error }
    case types.SESSION_LOGOUT:
      return { ...state, restoringDone: true }
    case types.SESSION_DELETE:
      return { ...state, deleted: true }
    default:
      return state
  }
}