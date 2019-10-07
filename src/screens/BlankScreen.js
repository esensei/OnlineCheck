import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

import { Container, Button, Text } from 'native-base'
import { Auth } from 'aws-amplify';



class BlankScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  signOut= () => {
  Auth.signOut()
  .then(data => console.log(data))
  .catch(err => console.log(err));
}
  render() {
    const { container } = styles
    return (
      <Container style={container} >
        <Button danger onPress={ this.signOut()} >
          <Text> LogOut </Text>
        </Button>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30,
    backgroundColor: 'rgb(239,243,248)'
  }
})

export default BlankScreen
