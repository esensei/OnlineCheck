import React, { Component } from 'react'
import {
  Dimensions,
  View
} from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import QRCodeScanner from 'react-native-qrcode-scanner'
import {
  Body,
  Container,
  Header,
  Title
} from 'native-base'
import NfcManager, {
  ByteParser,
  NfcEvents
} from 'react-native-nfc-manager'
import { connect } from 'react-redux'
import { decode as atob } from 'base-64'
import styles from '../styles'
import {
  fetchCheck,
  startListenBLE
} from '../actions'

class QRCodeScreen extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
  }

  base64toHEX = base64 => {
    const raw = atob(base64)
    let HEX = ''
    for (let i = 0; i < raw.length; i++) {
      const _hex = raw.charCodeAt(i)
        .toString(16)
      HEX += (_hex.length === 2 ? _hex : `0${_hex}`)
    }
    return HEX.toUpperCase()
  }


  scanAndConnect = (id) => {
    console.log(id)
    this.props.startListenBLE()
    // this.manager.startDeviceScan(null, null, (error, device) => {


    // if (id.indexOf(device.id) > -1) {
    // id = "88609F29-D421-D20B-835B-CB837E21D652"
    let data = ''
    this.props.navigation.navigate('Ваши чеки')
    this.manager
      .connectToDevice(id)
      .then(device => device.discoverAllServicesAndCharacteristics())
      .then(services => {
        this.manager
          .servicesForDevice(services.id)
          .then(() => {
            this.manager
              .writeCharacteristicWithoutResponseForDevice(
                id,
                '0000ffe0-0000-1000-8000-00805f9b34fb',
                '0000ffe1-0000-1000-8000-00805f9b34fb',
                '0YXRg9C5'
              )
              .then(res => console.log('OK'))
              .catch(err => console.log(err.reason))

            this.manager
              .monitorCharacteristicForDevice(
                id,
                '0000ffe0-0000-1000-8000-00805f9b34fb',
                '0000ffe1-0000-1000-8000-00805f9b34fb',
                (error, characteristic) => {
                  if (error) {

                  } else {
                    const hexData = this.base64toHEX(characteristic.value)
                    data += hexData

                    if (data.indexOf('0F0F0F') > -1) {

                      data = data.substr(0, data.length - 6)
                      this.manager.cancelDeviceConnection(id)
                        .then(() => {
                          this.props.fetchCheck(data)
                        })
                    }
                  }
                }
              )
          })
          .catch(error => {
            console.log(error)
          })
      })
    // }
    // })
  }

  componentDidMount() {
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        // subscription.remove()
      }
    }, true)

    NfcManager.start()
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      if (ByteParser.byteToString(tag.ndefMessage[0].payload) === '') {
        NfcManager.unregisterTagEvent()
          .catch(() => alert('Ошибка'))
      }
      const conf = ByteParser.byteToString(tag.ndefMessage[0].payload)
      this.scanAndConnect(conf.substr(1, conf.length - 1))
      NfcManager.setAlertMessageIOS('I got your tag!')
      NfcManager.unregisterTagEvent()
        .catch(() => 0)
    })
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null)
    NfcManager.unregisterTagEvent()
      .catch(() => 0)
  }

  _test = () => {
    NfcManager.registerTagEvent()
      .then()
      .catch(err => {
        NfcManager.unregisterTagEvent()
          .catch(() => 0)
        console.warn(err)
      })
  }

  render() {
    const { header } = styles

    return (
      <Container style={{ flex: 1 }}>
        <Header>
          <Body>
            <Title style={header}>Сканировать</Title>
          </Body>
        </Header>
        <View style={{ flex: 1 }}>
          <QRCodeScanner
            style={{
              justifyContent: 'flex-start',
              alignContent: 'stretch'
            }}

            reactivate
            reactivateTimeout={5000}
            onRead={(e) => this.scanAndConnect(e.data)}
            showMarker
            topContent={<View style={{ height: 0 }}></View>}
            bottomContent={<View style={{ height: 0 }}></View>}
          />
        </View>
        {/*<Content style={{ flex: 0.3, paddingHorizontal: 15, paddingTop: 20 }}>*/}
        {/*  <Button onPress={this._test} block style={{ backgroundColor: 'rgb(21,59,63)' }}>*/}
        {/*    <Text>NFC</Text>*/}
        {/*  </Button>*/}
        {/*</Content>*/}
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCheck: (payload) => dispatch(fetchCheck(payload)),
  startListenBLE: () => dispatch(startListenBLE())
})

const mapStateToProps = state => ({
  loadingImage: state.check
})
export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScreen)
