import _ from 'lodash'
import PageDecoder from './pageDecoder'
import Position from './position'
import Size from './size'
import TextElement from './textElement'
import ContextLine from './contextLine'

const EscPosPrinter = (function () {
  let canvas
  let docCanvas
  const commands = [0x09, 0x0A, 0x10, 0x1B, 0x1C, 0x1D]
  let modes
  let barCodeMode
  let pageDecoder

  function EscPosPrinter(canvasId) {
    docCanvas = canvasId
    // canvas = new fabric.StaticCanvas(canvasId);
    // canvas.renderOnAddRemove = true;
    // canvas.selection = false;
    pageDecoder = new PageDecoder(0x11)
    this._defaultConf()
  }

  _.extend(EscPosPrinter.prototype, {
    _defaultConf() {
      position = new Position()
      size = new Size()
      modes = {
        codeTable: 0,
        bold: false,
        underline: false,
        underlineMode: undefined,
        doubleHeight: false,
        doubleWidth: false,
        lineHeight: 1.3,
        letterSpace: 0,
        align: 'left',
        characterFont: 'A',
        upsideDownMode: false,
        clockwise90: false,
        inverseMode: false,
        userDefinedCharacterSet: {},
        currentUserDefinedCharacter: undefined
      }
      tabPositions = []
      ///////////////////////////////////////
      kanjiMode = {
        on: true,
        doubleWidth: false,
        doubleHeight: false,
        underline: false,
        underlineMode: undefined,
        leftSideSpace: 0,
        rightSideSpace: 0
      }
      ///////////////////////////////////////
      barCodeMode = {
        enableHRI: false,
        modes: [],
        font: 'A',
        height: 72,
        width: 1,
        leftSpace: 0
      }
    },

    async _makeText(buffer) {
      // console.log(_.map(buffer, function(charCode) {
      //     return '0x' + charCode.toString(16)
      // }));

      const { topLeft } = position
      const textElement = new TextElement(
        pageDecoder.decodeText(buffer),
        { left: topLeft.left,
          top: topLeft.top,
          right: size.width,
          //bold: modes.bold,
          fontWeight: modes.bold ||
            modes.doubleWidth ||
            modes.doubleHeight ? '800' : 'normal',
          fontSize: modes.characterFont === 'A' ? 16 : 20,
          underline: modes.underline,
          underlineMode: modes.underlineMode,
          lineHeight: modes.lineHeight,
          letterSpace: modes.letterSpace,
          textAlign: modes.align },
        this.getContext()
      )

      const width2 = await textElement.getWidth()

      // return new Promise((res, rej) => {
      //   var fetchPromise = textElement.getWidth()
      //   fetchPromise
      //     .then(data => {
      //       res(data);
      //     })
      //     .catch(err => rej(err))
      // })

      // return {
      //   element: textElement,
      //   height: textElement.height,
      //   width: width,
      //   top: topLeft.top,
      //   left: topLeft.left
      // };


      // return () => textElement.getWidth().then(calculatedWidth => {
      //   return {
      //     element: textElement,
      //     height: textElement.height,
      //     width: calculatedWidth,
      //     top: topLeft.top,
      //     left: topLeft.left
      //   };
      // })
      //

      // kek.
      // return await textElement.getWidth().then(res => ({
      //   element: textElement,
      //   height: textElement.height,
      //   width: res,
      //   top: topLeft.top,
      //   left: topLeft.left
      // }))

      return {
        element: textElement,
        height: textElement.height,
        width: width2,
        top: topLeft.top,
        left: topLeft.left
      }
    },
    _isESCCommand(commands) { //1B
      const escSubCommands = [0x20, 0x0E, 0x14, 0x21, 0x24, 0x25, 0x26, 0x2A, 0x2D, 0x32,
        0x33, 0x3F, 0x40, 0x42, 0x44, 0x45, 0x47, 0x4A, 0x4D, 0x56, 0x5C,
        0x61, 0x63, 0x70, 0x74, 0x7B, 0x5A]

      const isContain = _.includes(escSubCommands, commands[0])
      if (isContain && commands[0] == 0x63) {
        return commands[1] === 0x35
      }
      return isContain
    },
    _isFSCommand(subCommand) { //1C
      const fsSubCommands = [0x70,
        0x71,
        0x21,
        0x26,
        0x2D,
        0x2E,
        0x53,
        0x57 //
      ]
      return _.includes(fsSubCommands, subCommand)
    },
    _isGSCommand(commands) { //1D
      const gsSubCommands = [0x21, 0x42, 0x48, 0x4C, 0x66, 0x68, 0x6B, 0x76,
        0x77, 0x78]
      const isContain = _.includes(gsSubCommands, commands[0])
      if (commands[0] == 0x76) {
        return commands[1] === 0x30
      }
      return isContain
    },
    _setSizes(w, h, t, l) {
      position.setTopLeft(t, l)
      size.setWidth(w)
      size.setHeight(h)
    },
    _handleESCCommand(buffer) {
      const elements = []
      let sliceIndex = 1
      switch (buffer[0]) {
        case 0xE:
          modes.doubleWidth = true
          break
        case 0x14:
          modes.doubleWidth = false
          break
        case 0x20:
          modes.letterSpace = buffer[1]
          sliceIndex += 1
          break
        case 0x21:
          modes.bold = !!(buffer[1] & 0x8)
          modes.doubleHeight = !!(buffer[1] & 0x10)
          modes.doubleWidth = !!(buffer[1] & 0x20)
          modes.underline = !!(buffer[1] & 0x80)
          if (modes.underlineMode == null) {
            modes.underlineMode = 1
          }
          sliceIndex += 1
          break
        case 0x24: // select absolute position
          position.setTopLeft(
            buffer[1],
            buffer[2]
          )
          sliceIndex += 2
          break
        case 0x25: // select/cancel user-defined character set
          modes.currentUserDefinedCharacter = buffer[1]
          sliceIndex += 1
          break
        case 0x26: // define user-defined characters
          var height = buffer[1]
          var c1 = buffer[2]
          var c2 = buffer[3]
          var width = buffer[4]
          var charData = buffer.slice(5, height * width)
          userDefinedCharacterSet[c2 - c1 + 1] = {
            width,
            height,
            charData
          }
          sliceIndex += 4 + height * width
          break
        case 0x2D:
          modes.underline = buffer[1] === 48 || buffer[1] === 0
          modes.underlineMode = buffer[1] === 49 || buffer[1] == 1 ?
            1 :
            buffer[1] === 50 || buffer[1] == 2 ? 2 : undefined
          sliceIndex += 1
          break
        case 0x32: //select default line spacing
          modes.lineHeight = 1.3
          break
        case 0x33: //set line spacing
          modes.lineHeight = buffer[1]
          sliceIndex += 1
          break
        case 0x40:
          this._defaultConf()
          break
        case 0x42:
          sliceIndex += 2
          break
        case 0x44:
          var endPosition = _.indexOf(buffer, 0)
          tabPositions = buffer.slice(1, endPosition)
          sliceIndex += endPosition
          break
        case 0x45: //emphasized
        case 0x47: //double strike
          modes.bold = buffer[1] === 1
          sliceIndex += 1
          break
        case 0x4A: // print and feed paper
          var feed = buffer[1]
          var tl = position.topLeft
          //position.setTopLeft(tl.top + feed, 0);
          this._setSizes(
            size.width, size.height + Math.round(feed * 1.142857143),
            tl.top + Math.round(feed * 1.142857143), 0
          )
          sliceIndex += 1
          break
        case 0x4D:
          modes.characterFont = buffer[1] === 0 || buffer === 48 ? 'A' :
            buffer[1] === 1 || buffer === 49 ? 'B' : undefined
          sliceIndex += 1
          break
        case 0x56:
          modes.clockwise90 = buffer[1] === 1 || buffer[1] === 49
          sliceIndex += 1
          break
        case 0x5A: //print 2D barcode
          var m = buffer[1] // specifies column number of 2D barcode
          var n = buffer[2] // specifies security level to restore when barcode image is damaged
          var k = buffer[3] // used for define horizontal and vertical ratio
          var dataLength = (buffer[5] << 8) | buffer[4] // the length of data and it is consist of 2 bytes
          var buff = buffer.slice(6, dataLength)
          sliceIndex += dataLength + 5
          break
        case 0x5C:
          position.setTopLeft(
            position.topLeft.top + buffer[1],
            position.topLeft.left + buffer[2]
          )
          sliceIndex += 2
          break
        case 0x63: //pannel button
          command = buffer[1] === 0x35 ? buffer[2] : undefined
          sliceIndex += 2
          break
        case 0x61: // select justification
          switch (buffer[1]) {
            case 0x0:
            case 0x48:
              modes.align = 'left'
              break
            case 0x1:
            case 0x49:
              modes.align = 'center'
              break
            case 0x2:
            case 0x50:
              modes.align = 'right'
              break
          }
          sliceIndex += 1
          break
        case 0x70: //generate impulse
          var m = buffer[1]
          var t1 = buffer[2]
          var t2 = buffer[3]
          sliceIndex += 3
          break
        case 0x74: //select code table
          //0 <= n <= 5,16 <=n <= 19,n=255
          //   modes.codeTable = charCodeTable[buffer[1]];
          sliceIndex += 1
          break
        case 0x7B: //rotate 180degree
          modes.upsideDownMode = buffer[1] === 1
          sliceIndex += 1
          break
        case 0x64:
          var count = buffer[1]
          var obj = this._makeText()
          elements.push(obj.element)
          this._setSizes(
            size.width < obj.width ? obj.width : size.width,
            size.height + obj.height,
            modes.lineHeight * count, 0
          )
          break
      }
      return {
        elements,
        sliceIndex
      }
    },
    _handleFSCommand(buffer) {
      switch (buffer[0]) {
        case 0x21: //select print mode(s) for Kanji characters
          kanjiMode.doubleWidth = !!(buffer[0] & 0x04)
          kanjiMode.doubleHeight = !!(buffer[0] & 0x08)
          kanjiMode.underline = !!(buffer[0] & 0x80)
          break
        case 0x26: //specify Kanji mode

          break
        case 0x2D:
          kanjiMode.underline = buffer[1] === 48 || buffer[1] === 0
          kanjiMode.underlineMode = buffer[1] === 49 || buffer[1] == 1 ?
            1 :
            buffer[1] === 50 || buffer[1] == 2 ? 2 : undefined
          break
        case 0x2E:
          kanjiMode.on = true
          break
        case 0x53: //set kanji character spacing
          kanjiMode.leftSideSpace = buffer[1] //left-side character spacing
          kanjiMode.rightSideSpace = buffer[2] //right-side character spacing
          break
        case 0x57:
          break
      }
    },
    _handleGSCommand(buffer) { //1D
      const elements = []
      let sliceIndex = 2
      const maxWidth = 0
      switch (buffer[0]) {
        case 0x21: //select character size
          modes.doubleWidthParam = ((buffer[1] >> 4) & 0xF) + 1
          modes.doubleHeightParam = (buffer[1] & 0xF) + 1
          break
        case 0x42: //inverse mode
          modes.inverseMode = buffer[1] === 0x1
          break
        case 0x48: //enable HRI mode
          barCodeMode.enableHRI = buffer[1] === 0x1 || buffer[1] === 0x49 ||
            buffer[1] === 0x2 || buffer[1] === 0x50 ||
            buffer[1] === 0x3 || buffer[1] === 0x51
          if (barCodeMode.enableHRI) {
            switch (buffer[1]) {
              case 0x0:
              case 0x48:
                barCodeMode.modes = []
                break
              case 0x1:
              case 0x49:
                barCodeMode.modes = ['above']
                break
              case 0x2:
              case 0x50:
                barCodeMode.modes = ['below']
                break
              case 0x3:
              case 0x51:
                barCodeMode.modes = ['above', 'below']
                break
            }
          }
          //console.log('enable hri', barCodeMode.modes, barCodeMode.enableHRI);
          break
        case 0x4C: //Set left margin
          var nL = buffer[1]
          var nH = buffer[2]
          modes.margin = {
            nL,
            nH
          }
          sliceIndex += 1
          break
        case 0x66: //select font for HRI
          barCodeMode.ont = buffer[1] === 0 || buffer === 48 ? 'A' :
            buffer[1] === 1 || buffer === 49 ? 'B' : undefined
          break
        case 0x68: //set bar code height
          barCodeMode.height = buffer[1]
          break
        case 0x6B: //print bar code

          var barCodeV1 = [0, 1, 2, 3, 5, 6]
          var barCodeV2 = [65, 66, 67, 68, 69, 70, 71, 72, 73]
          var ranges = {
            0: {
              kRange: [11, 12],
              dRange: [[48, 57]]
            },
            1: {
              kRange: [11, 12],
              dRange: [[48, 57]]
            },
            2: {
              kRange: [12, 13],
              dRange: [[48, 57]]
            },
            3: {
              kRange: [7, 8],
              dRange: [[48, 57]]
            },
            4: {
              kRange: [1, 255],
              dRange: [[48, 57], [65, 90], [32], [36, 37], [43], [45, 47]]
            },
            5: {
              kRange: [1, 255],
              dRange: [[48, 57]],
              evenNumber: true
            },
            6: {
              kRange: [1, 255],
              dRange: [[48, 57], [65, 68], [36], [43], [45, 47], [58]]
            },
            65: {
              kRange: [11, 12],
              dRange: [[48, 57]]
            },
            66: {
              kRange: [11, 12],
              dRange: [[48, 57]]
            },
            67: {
              kRange: [12, 13],
              dRange: [[48, 57]]
            },
            68: {
              kRange: [7, 8],
              dRange: [[48, 57]]
            },
            69: {
              kRange: [1, 255],
              dRange: [[48, 57], [65, 90], [32], [36, 37], [43], [45, 47]]
            },
            70: {
              kRange: [1, 255],
              dRange: [[48, 57]],
              evenNumber: true
            },
            71: {
              kRange: [1, 255],
              dRange: [[48, 57], [65, 68], [36], [43], [45, 47], [58]]
            },
            72: {
              kRange: [1, 255],
              dRange: [[0, 127]]
            },
            73: {
              kRange: [2, 255],
              dRange: [[0, 127]]
            }
          }
          var barCodeFormats = {
            0: 'upca',
            1: 'upce',
            2: 'ean13',
            3: 'ean8',
            4: 'code39',
            5: 'interleaved2of5',
            6: 'rationalizedCodabar',
            65: 'upca',
            66: 'upce',
            67: 'ean14',
            68: 'ean8',
            69: 'code39',
            70: 'interleaved2of5',
            71: 'rationalizedCodabar',
            72: 'code93',
            73: 'code128'
          }
          m = buffer[1],
          isFirst = _.indexOf(barCodeV1, m) != -1,
          isSecond = _.indexOf(barCodeV2, m) != -1,
          range = ranges[m],
          dBuffer = [],
          idx = 2
          if (isFirst) {
            for (var i = 0; i < range.kRange[1]; idx = ++i + 2) {
              if (i >= range.kRange[0] && buffer[idx] === 0x0) { break }
              dBuffer.push(buffer[idx])
            }
          } else if (isSecond) {
            const length = buffer[2]
            for (var i = 0; i < length; idx = ++i + 3) {
              var val = buffer[idx]
              const match = _.find(_.map(range.dRange, (arrRange) => {
                if (arrRange.length > 1) {
                  return arrRange[0] <= val &&
                        val <= arrRange[1]
                }
                return val === arrRange[0]
              }), (isInRange) => isInRange === true) !== -1
              if (i >= range.kRange[0] && !match) { break }
              dBuffer.push(buffer[idx])
            }
          }
          sliceIndex += idx
          //console.log(position.topLeft);
          var { topLeft } = position
          var barcode = new BarCode(
            _.extend(_.clone(barCodeMode), position.topLeft),
            pageDecoder.decodeText(dBuffer),
            barCodeFormats[m]
          )

          this._setSizes(
            size.width < barcode.width ? barcode.width : size.width,
            size.height + barcode.height,
            topLeft.top + barcode.height, topLeft.left
          )
          elements.push(barcode)
          break
        case 0x76: //print image
          if (buffer[1] === 0x30) {
            var m = buffer[2]
            const xL = buffer[3]
            const xH = buffer[4]
            const yL = buffer[5]
            const yH = buffer[6]
            const width = xL + xH * 256
            const height = yL + yH * 256

            const pos = position.copy()
            const inchInPx = 1 //fabric.util.parseUnit('1in'),
            let index = 0

            const addRect = function (left, width, height) {
              const tl = pos.topLeft
              // topPos = tl.top,
              // leftPos = tl.left + left*inchInPx;
              const element = new ContextLine(
                tl.left + left * inchInPx,
                tl.top,
                width * inchInPx,
                height * inchInPx
              )
              elements.push(element)
              const fullWidth = element.widthWithLeft // element.left + element.width;
              size.setWidth(size.width > fullWidth ? size.width : fullWidth)
            }

            imageBuffer = new Uint8Array(buffer.slice(7, width * height))
            _.each(imageBuffer, (inchByte) => {
              //var tl = pos.topLeft;
              if (inchByte !== 0) {
                let calcWidth = 0
                let left = 0
                let b = inchByte
                let isPixel
                do {
                  isPixel = !!(b & 0x80)
                  if (isPixel) {
                    calcWidth += 1
                  } else if (calcWidth > 0) {
                    addRect(left, calcWidth, 1)
                    left += calcWidth
                    calcWidth = 0
                  }
                  if (!isPixel) { left++ }
                  b = (b << 1) & 0xFF
                } while (b !== 0)
                if (calcWidth) { addRect(left, calcWidth, 1) }
              }
              pos.setLeft(pos.topLeft.left + inchInPx * 8)
              index++
              if (index == width) {
                found = false
                index = 0
                pos.setTopLeft(
                  pos.topLeft.top + inchInPx,
                  position.topLeft.left
                )
              }
            })

            let qrHeight = pos.topLeft.top - position.topLeft.top

            position.setTop(pos.topLeft.top)
            this._setSizes(size.width, size.height + qrHeight, position.topLeft.top, 0)
            sliceIndex += 5 + width * height
          }
          break
        case 0x77: //set bar code width
          barCodeMode.width = buffer[1]
          break
        case 0x78: //set barcode printing left space
          barCodeMode.left = buffer[1]
          break
      }
      return {
        elements,
        sliceIndex
      }
    },
    async _prepareElements(buff) {
      let elements = []
      let res
      let textBuffer = []
      let { width } = size
      let { height } = size
      for (let i = 0, length = buff.byteLength; i < length; ++i) {
        switch (buff[i]) {
          case 0x1D:
            if (this._isGSCommand([buff[i + 1], buff[i + 2]])) {
              res = this._handleGSCommand(_.drop(buff, i + 1))
            } else {
              textBuffer.push(buff[i])
            }
            break
          case 0xA:
            var w = 0; var h = 0
            var { topLeft } = position
            if (textBuffer.length) {
              const obj = await this._makeText(textBuffer)

              elements.push(obj.element)
              textBuffer = []

              w = obj.width
              h = obj.height
            }
            this._setSizes(
              size.width < w ? w : size.width,
              size.height + h,
              topLeft.top + h, 0
            )
            break
          case 0x1C:
            if (this._isFSCommand(buff[i + 1])) {

            } else {
              textBuffer.push(buff[i])
            }
            break
          case 0x1B:
            if (this._isESCCommand([buff[i + 1], buff[i + 2]])) {
              res = this._handleESCCommand(_.drop(buff, i + 1))
            } else {
              textBuffer.push(buff[i])
            }
            break
          default:
            textBuffer.push(buff[i])
            break
        }
        if (res) {
          if (res.elements) { elements = elements.concat(res.elements) }
          i += res.sliceIndex || 0
          res = undefined
        }

        width = size.width < width ? width : size.width
        height = size.height < height ? height : size.height
      }
      return {
        elements,
        resultHeight: height,
        resultWidth: width
      }
    },
    async print(buffer) {
      this._defaultConf()
      const uintArray = new Uint8Array(buffer)
      const obj = await this._prepareElements(uintArray)

      console.log(`${obj.resultWidth} ${obj.resultHeight}`)
      // obj.resultWidth = 300
      // obj.resultHeight = 1000
      // obj.resultHeight += 200
      this.changeSize(obj.resultWidth, obj.resultHeight)
      const ctx = this.getContext()
      this.elements = obj.elements
      _.each(obj.elements, (elem, idx) => {
        //var isAdd = true;
        if (elem instanceof TextElement) {
          let left
          switch (elem.getTextAlign()) {
            case 'left':
              left = elem.getLeft()
              break
            case 'right':
              left = obj.resultWidth - elem.width - 1
              break
            case 'center':
              left = (obj.resultWidth - elem.width) / 2
              break
          }
          elem.set('left', left)
        }
        elem.draw(ctx)
      })
    },
    changeSize(width, height) {
      const ctx = this.getContext()
      docCanvas.width = width
      docCanvas.height = height
      ctx.clearRect(0, 0, docCanvas.width, docCanvas.height)
      // docCanvas.style.width = width + 'px';
      // docCanvas.style.height = height + 'px';
      docCanvas.width = width
      docCanvas.height = height

      const { fillStyle } = ctx
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = fillStyle
    },
    getContext() {
      this.ctx = this.ctx || docCanvas.getContext('2d')
      return this.ctx
    },
    getCanvas() {
      return this.getContext().canvas
    },
    getImageData() {
      return this.getCanvas().toDataURL()
    }
  })
  return EscPosPrinter
}())

export default EscPosPrinter
