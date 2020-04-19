import { combineReducers } from 'redux'
import checkReducer from './checkReducer'
import checkImagesReducer from './checkImagesReducer'
export default rootReducer = combineReducers({
  check: checkReducer,
  checkImages: checkImagesReducer
})
