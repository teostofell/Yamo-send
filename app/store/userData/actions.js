export function setUserData(userData) {
  return {
    type: 'USER_DATA',
    user: userData,
  }
}


// export const setUserData = (userData) => {
//   return (dispatch) => {
//     dispatch(userValue(userData))
//   }
// }

// const userValue = (userData) => ({
//   type: 'USER_DATA',
//   userData
// })