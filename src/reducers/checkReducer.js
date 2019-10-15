const checkReducer = (state = null, action) => {
  if (action.type === 'CHECK_FETCH') {
    return action.payload
  }
  if (action.type === 'CHECK_REMOVE') {
    return null
  }
  return state
}

export default checkReducer
