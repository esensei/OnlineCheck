import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native'
const RNFS = require('react-native-fs')

import { Container, Title, Header, Content, Right, Card, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base'
import { connect } from 'react-redux'
import { downloadedCheckImage } from '../actions'
import AutoHeightImage from 'react-native-auto-height-image';

class ChecksScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: []
    }

    this.canvas = React.createRef()
  }

  componentDidUpdate() {
    if (this.props.isCheckUpload){

      this.setState({images:[]}, this.readfile())
      this.props.downloadedCheckImage()
    }
  }

  readfile(){

    RNFS.readdir(RNFS.DocumentDirectoryPath)
      .then(files =>
        files.sort((a,b) => (b - a))
          .filter(filename => filename !== "RCTAsyncLocalStorage_V1")
          .map(filename =>
            RNFS.readFile(`${RNFS.DocumentDirectoryPath}/${filename}`, 'base64')
              .then(
                res => this.setState(prevState => ({images: [...prevState.images, res]}))
              )
          )
      )
  }

  componentDidMount() {
   this.readfile()
  }

  render() {
    const { canvas } = styles
    if (this.props.loadingImage.uploaded || this.props.loadingImage.fetched || this.props.loadingImage.startListenBLE) {
      return (
        <Container style={{ flex: 1,
          justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="rgb(21,59,63)" />
        </Container>
      )
    }
    return (
      <Container style={{ backgroundColor: 'rgb(239,243,248)' }}>
        <Header style={{  height: 64, backgroundColor: 'rgb(21,59,63)' }}>
          <Left />
          <Body>
            <Title style={{color: 'white'}}>Ваши чеки</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ paddingHorizontal: 5 }}>
          {this.state.images.map( (res, index) => {

            return (
              <Card key={index}>
                <CardItem style={{ backgroundColor: 'rgb(76,171,157)' }}>
                  <Left>
                    <Thumbnail source={require('../img/logoOnCheck.png')} />
                    <Body>
                      <Text style={{ color: 'white' }}>Лукойл</Text>
                      <Text style={{ color: 'rgb(209,243,248)' }} note>Товарный чек</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem style={canvas} >
                  <Image style={{resizeMode: 'contain', width: '100%', height: 300}}  source={{uri: "data:image/png;base64,"+res}}/>
                </CardItem>
              </Card>
            )
            }

          )}
        </Content>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    justifyContent: 'center'
  }
})

const mapStateToProps = state => ({
  isCheckUpload: state.check.uploaded,
  loadingImage: state.check
})

const mapDispatchToProps = dispatch => ({
  downloadedCheckImage: () => dispatch(downloadedCheckImage())
})

export default connect(mapStateToProps, mapDispatchToProps)(ChecksScreen)
