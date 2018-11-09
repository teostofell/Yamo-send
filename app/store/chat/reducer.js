import * as types from './actionTypes'

const initialState = {
  sending: false,
  sendingError: null,
  message: '',
  messages: {},
  loadMessagesError: null,
  friends: {},
  loadFriendsError: null,
}

const chat = (state = initialState, action) => {
  state = { ...initialState, pageName: action.pageName }
  switch(action.type) {
    case types.CHAT_MESSAGE_LOADING:
      return { ...state, sending: true, sendingError: null }
    case types.CHAT_MESSAGE_ERROR:
      return { ...state, sending: false, sendingError: action.error }
    case types.CHAT_MESSAGE_SUCCESS:
      return { ...state, sending: false, sendingError: null, message: '' }
    case types.CHAT_MESSAGE_UPDATE:
      return { ...state, sending: false, message: action.text, sendingError: null }
    case types.CHAT_LOAD_MESSAGES_SUCCESS:
      return { ...state, messages: action.messages, loadMessagesError: null }
    case types.CHAT_LOAD_MESSAGES_ERROR:
      return { ...state, messages: null, loadMessagesError: action.error }      
    case types.CHAT_LOAD_FRIENDS_SUCCESS:
      return { ...state, friends: action.friends, loadFriendsError: null }
    case types.CHAT_LOAD_FRIENDS_ERROR:
      return { ...state, friends: null, loadFriendsError: action.error }      
    default:
      return state
  }
}

export default chat
