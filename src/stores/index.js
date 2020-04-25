import {
  applyMiddleware,
  createStore
} from 'redux'
import ReduxThunk from 'redux-thunk'
import AsyncStorage from '@react-native-community/async-storage'

import { persistStore, persistReducer, createTransform } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['checkImages'],
  transforms: [
    createTransform(JSON.stringify, toRehydrate =>
      JSON.parse(toRehydrate, (key, value) =>
        (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
          ? new Date(value)
          : value)))
  ]

}
const pReducer = persistReducer(persistConfig, rootReducer)

const composedEnhancers = composeWithDevTools(applyMiddleware(ReduxThunk))

export default () => {
  const store = createStore(pReducer, composedEnhancers)
  const persistor = persistStore(store)
  return { store, persistor }
}
