import React from 'react'
import { YellowBox } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import BottomNavigator from './components/BottomNavigator'
import returnStoreAndPersistor from './stores'
import CanvasComponent from './components/CanvasComponent'
import 'react-native-gesture-handler'
YellowBox.ignoreWarnings([
  'Battery state',
  'componentWillMount',
  'componentWillUpdate',
  'componentWillReceiveProps',
  '[location] ERROR - 0',
  'RCTRootView cancelTouches'
])
const Index = () => {
  const { store, persistor } = returnStoreAndPersistor()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BottomNavigator />
        <CanvasComponent />
      </PersistGate>
    </Provider>
  )
}

export default Index
