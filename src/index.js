import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { StatusBar, View, Text } from 'react-native'
import Icon from 'react-native-ionicons'
import Amplify from '@aws-amplify/core'
import {createAppContainer} from 'react-navigation'
import { Authenticator , withAuthenticator} from 'aws-amplify-react-native'
import awsconfig from '../aws-exports'
import { AmplifyTheme, Localei18n } from './components'

import {
  BlankScreen,
  ChecksScreen
} from './screens'

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true
  }
})

const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    }
  ]
}

const BottomNavigator = createMaterialBottomTabNavigator(
  {
    Album: {
      screen: BlankScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="paper" size={25} color={tintColor} />
      }
    },
    'Ваши чеки': {
      screen: ChecksScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="list" size={25} color={tintColor} />
      }
    },
    Карты: {
      screen: BlankScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="qr-scanner" size={25} color={tintColor} />
      }
    },
    History: {
      screen: BlankScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="person" size={25} color={tintColor} />
      }
    },
    Cart: {
      screen: BlankScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon name="settings" size={25} color={tintColor} />
      }
    }
  },
  {
    initialRouteName: 'Album',
    activeColor: 'rgb(106,175,237)',
    inactiveColor: 'black',
    barStyle: { backgroundColor: 'white' }
  }
)

 const BottomContainer = createAppContainer(BottomNavigator)
const App = () => (
  <>
    <Localei18n />

    <Authenticator
      usernameAttributes="email"
      signUpConfig={signUpConfig}
      theme={AmplifyTheme}
    >
      <Text> ZZZZZZ</Text>
    </Authenticator>
  </>
)

 export default withAuthenticator(BottomContainer, { signUpConfig, theme: AmplifyTheme })
