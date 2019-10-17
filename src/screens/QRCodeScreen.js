import React, { Component } from 'react'

import { BleManager } from 'react-native-ble-plx'
import QRCodeScanner from 'react-native-qrcode-scanner'
import {
  Body,
  Container,
  Content,
  Header,
  Button,
  Text,
  Title
} from 'native-base'
import NfcManager, {
  Ndef,
  ByteParser,
  NfcEvents
} from 'react-native-nfc-manager'
import { connect } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import {decode as atob, encode as btoa} from 'base-64'

import {
  startListenBLE,
  fetchCheck
} from '../actions'

class QRCodeScreen extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
  }

  base64toHEX(base64) {
    const raw = atob(base64)

    let HEX = ''

    for (let i = 0; i < raw.length; i++) {
      const _hex = raw.charCodeAt(i).toString(16)

      HEX += (_hex.length === 2 ? _hex : `0${_hex}`)
    }
    return HEX.toUpperCase()
  }


  scanAndConnect = (id) => {
    this.props.startListenBLE()
    // this.manager.startDeviceScan(null, null, (error, device) => {


    // if (id.indexOf(device.id) > -1) {

    let data = ''
    this.props.navigation.navigate('Ваши чеки')
    this.manager
      .connectToDevice(id)
      .then(device => device.discoverAllServicesAndCharacteristics())
      .then(services => {
        this.manager
          .servicesForDevice(services.id)
          .then(() => {
            setTimeout(() => {
              this.manager.cancelDeviceConnection(id)
                .then(() => {
                  this.props.fetchCheck(data)
                })
            }, 3000)


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
                    data += this.base64toHEX(characteristic.value)
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
        NfcManager.unregisterTagEvent().catch(() => alert('Ошибка'))
      }
      const conf = ByteParser.byteToString(tag.ndefMessage[0].payload)
      this.scanAndConnect(conf.substr(1, conf.length - 1))
      NfcManager.setAlertMessageIOS('I got your tag!')
      NfcManager.unregisterTagEvent().catch(() => 0)
    })
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null)
    NfcManager.unregisterTagEvent().catch(() => 0)
  }

  _test = () => {
    NfcManager.registerTagEvent()
      .then()
      .catch(err => {
        NfcManager.unregisterTagEvent().catch(() => 0)
        console.warn(err)
      })
  }

  render() {
    return (
      <Container style={{ backgroundColor: 'rgb(239,243,248)' }}>
        <Header style={{ height: 64, backgroundColor: 'rgb(21,59,63)' }}>
          <Body>
            <Title style={{ color: 'white' }}>Сканируйте QR-код или NFC</Title>
          </Body>
        </Header>
        <Content>
          <QRCodeScanner
            reactivate
            reactivateTimeout={5000}
            onRead={(e) => this.scanAndConnect(e.data)}
            showMarker
          />
          <Content style={{ paddingHorizontal: 15, paddingTop: 20 }}>
            <Button onPress={this._test} block style={{ backgroundColor: 'rgb(21,59,63)' }}>
              <Text>
            NFC
              </Text>
            </Button>
          </Content>
        </Content>
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
