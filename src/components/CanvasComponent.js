import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Canvas from 'react-native-canvas'
import { useSelector, useDispatch } from 'react-redux'
import EscPosPrinter from '../printer/printer'
import { strToHexArr } from '../functions'
import { checkUploaded, uploadImageCheck } from '../actions'


const RNFS = require('react-native-fs')

const CanvasComponent = () => {
  const dispatch = useDispatch()

  const canvas = useRef(null)
  const isCheckFetch = useSelector(state => state.check.fetched)
  const checkNewCheck = async () => {
    if (isCheckFetch) {
      const buffer = strToHexArr(isCheckFetch)

      const _escPosPrinter = new EscPosPrinter(canvas.current)
      await _escPosPrinter.print(buffer)
      const path = `${RNFS.DocumentDirectoryPath}/${Date.now()}.png`
      canvas.current.toDataURL()
        .then(res => {
          const Base64Code = res.split('data:image/png;base64,')

          RNFS.writeFile(path, Base64Code[1], 'base64')
            .then(() => {
              console.log(Base64Code[0])
              dispatch(uploadImageCheck(path))
              dispatch(checkUploaded())
            })
        })
    }
  }
  useEffect(() => {
    checkNewCheck()
  }, [isCheckFetch])

  return (
    <View style={{ position: 'absolute', top: 0, left: 30000 }}>
      <Canvas ref={canvas} />
    </View>
  )
}


// const mapDispatchToProps = dispatch => ({
//   uploadedCheckImage: () => dispatch(uploadedCheckImage())
// })

export default CanvasComponent
