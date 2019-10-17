let initalState = {
  images: []
}

const imagesReducer = (state = initalState, action) => {
  if (action.type === 'CHECK_IMAGE_FETCH') {
    return {
      arr: [...state.images, action.payload]

    }
  }
  if (action.type === 'CHECK_IMAGE_REMOVE') {
    return null
  }
  return state
}

export default imagesReducer
