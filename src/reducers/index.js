import { combineReducers } from 'redux'
import checkReducer from './checkReducer'
import imagesReducer from './imagesReducer'

export default rootReducer = combineReducers({
  check: checkReducer,
  images: imagesReducer

})
