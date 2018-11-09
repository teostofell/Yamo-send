import * as types from './actionTypes'

const initialState = {
  loading: false,
  firebaseUser: null,
  error: null,
  pageName: '',
  photoList: null,
  userList: null,
  filterData: null,
  likedList: null,
  likedMe: null,
  visitedList: null,
  visitedMe: false,
}

const firebaseData = (state = initialState, action) => {
  state = { ...initialState, pageName: action.pageName }
  switch(action.type) {
    case types.FIREBASE_API_LOADING:
      return { ...state, loading: true }
    case types.FIREBASE_API_SUCCESS:
      return { ...state, firebaseUser: action.user }
    case types.FIREBASE_PHOTO_SUCCESS:
      return { ...state, photoList: action.photoList }
    case types.FIREBASE_API_SUCCESS_ERROR:
      return { ...state, error: action.error }
    case types.FIREBASE_FIND_USER_SUCCESS:
      return { ...state, userList: action.userList }
    case types.FIREBASE_FILTER_DATA_SUCCESSS:
      return { ...state, filterData: action.filterData }
    case types.FIREBASE_LIKE_SUCCESS:
      return { ...state, likedList: action.likedList }
    case types.FIREBASE_LIKE_ME_SUCCESS:
      return { ...state, likedMe: action.status }
    case types.FIREBASE_NORMAL_SUCCESS:
      return state
    default:
      return state
  }
}

export default firebaseData
