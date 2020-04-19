import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import {
  Body,
  Container,
  Content,
  Header,
  Left,
  Right,
  Text,
  Title,
  View
} from 'native-base'
import RNRestart from 'react-native-restart'
import Icon from 'react-native-ionicons'
import styles from '../styles'
import ProfileDefault from '../assets/settings_screen/profile_default.svg'
import test_check from '../configs/test_check'
import {
  fetchCheck,
  removeAllCheck
} from '../actions'

const RNFS = require('react-native-fs')


const BlankScreen = () => {
  const dispatch = useDispatch()
  const deleteChecks = () => {
    dispatch(removeAllCheck())
    // RNFS.readdir(RNFS.DocumentDirectoryPath)
    //   .then(files =>
    //     files.filter(filename => filename !== 'RCTAsyncLocalStorage_V1')
    //       .map(filename =>
    //         RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${filename}`)
    //           .then()
    //           .catch()))
    //   .then(() => dispatch(uploadedCheckImage()))
  }


  const signOut = () => {
    Auth.signOut()
      .then(() => RNRestart.Restart())
      .catch(err => console.log(err))
  }

  const checkTest = () => {
    dispatch(fetchCheck(test_check))
  }

  const { container, settingsButton, buttonText, buttonTextContainer } = styles
  return (
    <Container style={container}>
      <Header style={{ backgroundColor: 'white' }}>
        <Left />
        <Body>
          <Title>Настройки</Title>
        </Body>
        <Right>
          <Icon onPress={signOut} name="log-out" color="#73AC05" />
        </Right>
      </Header>
      <View style={{ paddingHorizontal: 32, paddingVertical: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <ProfileDefault />
        </View>
        <TouchableOpacity onPress={checkTest} style={settingsButton}>
          <View style={buttonTextContainer}>
            <Text style={buttonText}>Тест получения чека</Text>
          </View>
          <Icon name="swap" color="#73AC05" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteChecks} style={settingsButton}>
          <View style={buttonTextContainer}>
            <Text style={buttonText}>Удалить все чеки</Text>
          </View>
          <Icon name="trash" color="#73AC05" />
        </TouchableOpacity>
      </View>
    </Container>
  )
}


export default BlankScreen
