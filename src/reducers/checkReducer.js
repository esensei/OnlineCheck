const initialState = {
  uploaded: false,
  fetched: null,
  startListenBLE: false
}

const checkReducer = (state = initialState, action) => {

  if (action.type === 'RUN_FIND_BLE') {
    return {
      uploaded: false,
      fetched: action.payload,
      startListenBLE: true
    }
  }
  if (action.type === 'CHECK_FETCH') {
    return {
      uploaded: false,
      fetched: action.payload,
      startListenBLE: false
    }
  }
  if (action.type === 'CHECK_UPLOAD') {
    return {
      uploaded: true,
      fetched: null,
      startListenBLE: false
    }
  }
  if (action.type === 'CHECK_DOWNLOADED') {
    return {
      uploaded: false,
      fetched: null,
      startListenBLE: false
    }
  }

  return state
}

export default checkReducer
