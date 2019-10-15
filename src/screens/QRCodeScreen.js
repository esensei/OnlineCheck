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
import NfcManager, {NfcEvents} from 'react-native-nfc-manager'

export default class QRCodeScreen extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
  }

  base64toHEX(base64) {
    const raw = atob(base64)

    let HEX = ''

    for (i = 0; i < raw.length; i++) {
      const _hex = raw.charCodeAt(i).toString(16)

      HEX += (_hex.length === 2 ? _hex : `0${_hex}`)
    }
    return HEX.toUpperCase()
  }


  scanAndConnect = (id) => {
    alert('Сработал')
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return
      }
      if (device.id === id) {
        let data = ''
        console.log('Da')
        this.manager
          .connectToDevice(device.id)
          .then(device => device.discoverAllServicesAndCharacteristics())
          .then(services => {
            this.manager
              .servicesForDevice(services.id)
              .then(() => {
                this.manager
                  .writeCharacteristicWithoutResponseForDevice(
                    device.id,
                    '0000ffe0-0000-1000-8000-00805f9b34fb',
                    '0000ffe1-0000-1000-8000-00805f9b34fb',
                    '0YXRg9C5'
                  )
                  .then(res => console.log('OK'))
                  .catch(err => console.log(err.reason))

                this.manager
                  .monitorCharacteristicForDevice(
                    device.id,
                    '0000ffe0-0000-1000-8000-00805f9b34fb',
                    '0000ffe1-0000-1000-8000-00805f9b34fb',
                    (error, characteristic) => {
                      data += this.base64toHEX(characteristic.value)
                      console.log(data)
                    }
                  )
              })
              .catch(error => {
                console.log(error)
              })
          })
        setTimeout(() => { this.manager.cancelDeviceConnection(device.id).then() }, 5000);
      }
    })
  }

  componentDidMount() {
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        // subscription.remove()
      }
    }, true)

    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      console.warn('tag', tag);
      NfcManager.setAlertMessageIOS('I got your tag!');
      NfcManager.unregisterTagEvent().catch(() => 0);
    })
  }
  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  _test = () => {
    NfcManager.registerTagEvent()
      .then()
      .catch(err => {
        NfcManager.unregisterTagEvent().catch(() => 0);
        console.warn(err)})

  }
  render() {
    return (
      <Container style={{ backgroundColor: 'rgb(239,243,248)' }}>
        <Header style={{  height: 64, backgroundColor: 'rgb(21,59,63)' }}>
          <Body>
            <Title style={{color: 'white'}}>Сканируйте QR-код или NFC</Title>
          </Body>
        </Header>
        <Content >
        <QRCodeScanner
          onRead={(e) => this.scanAndConnect(e.data)}
          showMarker
        />
        <Content style={{paddingHorizontal: 15, paddingTop: 20}}>
        <Button  onPress={this._test} block style={{backgroundColor: 'rgb(21,59,63)' }}>
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
