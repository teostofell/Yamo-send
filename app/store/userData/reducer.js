const initialState = {
  user: null
};

const userData = (state = initialState, action) => {
  state = initialState;
  switch (action.type) {
    case 'USER_DATA':
      return { ...state, user: action.user }
    default: 
      return state
  }
}

export default userData;