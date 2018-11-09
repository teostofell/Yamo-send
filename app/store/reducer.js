import { combineReducers } from 'redux'

import app from './app'
import session from './session'
import userData from './userData'
import firebaseData from './firebaseData'
import chat from './chat'
// import userRegister from './userRegister'

export default combineReducers({
  app,
  session,
  userData,
  firebaseData,
  chat,
  // userRegister,
})