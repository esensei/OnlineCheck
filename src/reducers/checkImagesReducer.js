import { PURGE, REHYDRATE } from 'redux-persist'
import namesOfCompany from '../configs/namesOfCompany'

const RNFS = require('react-native-fs')

const checkImagesReducer = (state = [], action) => {
  if (action.type === 'UPLOAD_IMAGE_CHECK') {

    let newID = 0
    if (state.length > 0) {
      newID = state[state.length - 1].id + 1
    }
    const title = namesOfCompany[Math.floor(Math.random() * 17) + 1]
    let date = JSON.stringify(new Date(Date.now()))
    const obj = {
      id: newID,
      path: action.payload,
      date: new Date(),
      title
    }
    return [...state, obj]
  }
  if (action.type === 'REMOVE_IMAGES') {
    for (const file in state) {
      RNFS.unlink(state[file].path)
        .then(() => {
          console.log('FILE DELETED')
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    return []
  }
  return state
}

export default checkImagesReducer
