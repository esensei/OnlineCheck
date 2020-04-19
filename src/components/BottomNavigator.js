import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import Icon from 'react-native-ionicons'
import {
  BlankScreen,
  ChecksScreen,
  QRCodeScreen
} from '../screens'
import { AmplifyTheme } from './AmplifyTheme'
import COLORS from '../constants/Colors'
import { Receipts, Scan, More, MoreActive, ScanActive, ReceiptsActive } from '../assets/bottomSVG'

const Tab = createMaterialBottomTabNavigator()


const MyTheme = {
   dark: true,
   colors: {
     primary: 'rgb(255, 45, 85)',
     background: 'rgb(242, 242, 242)',
     card: 'rgb(255, 255, 255)',
     text: 'rgb(28, 28, 30)',
     border: 'rgb(199, 199, 204)',
   },
};

function MyTabs() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
      barStyle={{backgroundColor: 'white'}}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            switch (route.name) {
              case 'Ваши чеки':
                return (
                  focused
                    ? <ReceiptsActive style={{ marginTop: -3 }} />
                    : <Receipts style={{ marginTop: -3 }} />
                )

              case 'Сканировать чек':
                return (focused
                  ? <ScanActive style={{ marginTop: -3 }} />
                  : <Scan style={{ marginTop: -3 }} />)



              case 'Настройки':
                return (
                  focused
                    ? <MoreActive style={{ marginTop: -3 }} />
                    : <More style={{ marginTop: -3 }} />
                )

            }
          }
        })}
        tabBarOptions={{
          activeTintColor: COLORS.green,
          inactiveTintColor: COLORS.grey,
        }}
      >
        <Tab.Screen name="Ваши чеки" component={ChecksScreen} />
        <Tab.Screen name="Сканировать чек" component={QRCodeScreen} />
        <Tab.Screen name="Настройки" component={BlankScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  )
}



export default MyTabs
