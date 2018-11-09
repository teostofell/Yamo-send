import * as types from './actionTypes'
import firebaseService from '../../services/firebase'

export function restoreSession (pageName) {
  return async function(dispatch, getState) {
    dispatch(sessionRestoring())

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user, pageName))
          unsubscribe()
        } else {
          dispatch(sessionLogout())
          unsubscribe()
        }
      })
  }
}

export function loginUser (email, password, pageName) {
  return async function(dispatch, getState) {
    dispatch(sessionLoading())

    firebaseService.auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        dispatch(sessionError(error.message))
      })

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user, pageName))
          unsubscribe()
        }
      })
  }
}

export function signupUser (email, password, pageName) {
  return async function(dispatch, getState) {
    dispatch(sessionLoading())

    firebaseService.auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        dispatch(sessionError(error.message));
      })

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user, pageName))
          unsubscribe()
        }
      })
  }
}

export function logoutUser () {
  return async function(dispatch, getState) {
    dispatch(sessionLoading())

    firebaseService.auth()
      .signOut()
      .then(() => {
        dispatch(sessionLogout())
      })
      .catch(error => {
        dispatch(sessionError(error.message))
      })
  }
}

export function deleteUser () {
  return async function(dispatch, getState) {
    dispatch(sessionLoading())

    // var user = firebase.auth().currentUser;
    if (firebaseService.auth().currentUser) {
      firebaseService.auth().currentUser.delete().then(function() {
        dispatch(sessionDelete())
      }).catch(function(error) {
        dispatch(sessionError(error.message))
      });
    } else {
      dispatch(sessionError('User doesn`t exists'))
    }
  }
}

const sessionRestoring = () => ({
  type: types.SESSION_RESTORING
})

const sessionLoading = () => ({
  type: types.SESSION_LOADING
})

const sessionSuccess = (user, pageName) => ({
  type: types.SESSION_SUCCESS,
  user,
  pageName
})

const sessionError = error => ({
  type: types.SESSION_ERROR,
  error
})

const sessionLogout = () => ({
  type: types.SESSION_LOGOUT
})

const sessionDelete = () => ({
  type: types.SESSION_DELETE
})
