const checkReducer = (state = null, action) => {
  if (action.type === 'CHECK_FETCH') {
    return {
      lunchboxes: action.payload
    }
  }
  if (action.type === 'CHECK_REMOVE') {
    return {
      lunchboxes: action.payload
    }
  }
  return state
}

export default checkReducer
