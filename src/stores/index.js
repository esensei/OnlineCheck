import {createStore, applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '../reducers'

export default store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)))
