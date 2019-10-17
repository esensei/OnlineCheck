import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import Icon from 'react-native-ionicons'
import Amplify from 'aws-amplify'
import { createAppContainer } from 'react-navigation'
import {
  withAuthenticator
} from 'aws-amplify-react-native'
import awsconfig from '../aws-exports'
import { Provider } from 'react-redux'
import store from './stores'
import CanvasComponent from './components/CanvasComponent'
import { View, StatusBar, Platform } from 'react-native'
import {
  AmplifyTheme,
  Localei18n
} from './components'

import {
  BlankScreen,
  ChecksScreen,
  QRCodeScreen
} from './screens'
import { CardItem } from "native-base"

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true
  }
})

const signUpConfig = {
  hiddenDefaults: ['phone_number'],
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password',
    }]

}

const BottomNavigator = createMaterialBottomTabNavigator(
  {
    'Ваши чеки': {
      screen: ChecksScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="list" size={25} color={tintColor} />
      }
    },
    'Сканировать чек': {
      screen: QRCodeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="qr-scanner" size={25} color={tintColor} />
      }
    },
    "Настройки": {
      screen: BlankScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="settings" size={25} color={tintColor} />
      }
    }
  },
  {

    activeColor: 'rgb(223,225,86)',
    inactiveColor: 'rgb(76,171,157)',

    theme: AmplifyTheme,
    barStyle: { backgroundColor: 'rgb(21,59,63)',
    }
  }
)

const BottomContainer = createAppContainer(BottomNavigator)
console.disableYellowBox = true
class Index extends Component {


  render() {
    return (
        <Provider store={store}>
          <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: "rgb(21,59,63)"
          }}>
            <StatusBar barStyle="light-content" />
          </View>


          <BottomContainer/>
          <CanvasComponent/>
        </Provider>
    )
  }
}

 export default withAuthenticator(Index,   {  signUpConfig, usernameAttributes: 'email' }, <Localei18n/>, null, AmplifyTheme )
