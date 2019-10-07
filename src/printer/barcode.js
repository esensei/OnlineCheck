import _ from 'lodash'

export default class BarCode {
  constructor(confs, text, barcodeType) {
    this.barcodeSizes = {
      'upca': [95, 72],
      'upce': [51, 72],
      'ean8': [67, 72],
      'ean13': [95, 72],
      'ean14': [134, 72],
      'code39': [287, 72],
      'code93': [172, 72],
      'code128': [178, 72],
      'interleaved2of5': [117, 36],
      'rationalizedCodabar': [159, 72]
    }

    this.__wh = this.barcodeSizes[barcodeType]
    this.__confs = _.defaults(confs, {
      enableHRI: false,
      modes: [],
      font: 'A',
      height: this.__wh[1],
      width: 1,
      leftSpace: 0,
      top: 0,
      left: 0
    })
    this.__text = text
    this.__barcodeType = barcodeType
  }

  _copyBarcode(sourceCanvas, ctx, topLeft) {
    ctx.drawImage(sourceCanvas, topLeft.left, topLeft.top + 5)
    return {
      top: topLeft.top + sourceCanvas.height + 5,
      left: topLeft.left
    }
  }

  _drawBarCode(callback) {
    const elt = symdesc[this.__barcodeType]
    const text = this.__text
    const scaleX = this.__confs.width
    const scaleY = this.__confs.height / 72
    bw = new BWIPJS()

    bw.bitmap(new Bitmap())
    bw.scale(scaleX, scaleY)
    bw.bitmap().pad(0, 0)
    bw.push(text)
    bw.push({
      includetext: bw.value(false),
      guardwhitespace: bw.value(false)
    })

    bw.call(this.__barcodeType, (err) => {
      if (err) {
        if (typeof err === 'string') {
          alert(err)
        } else if (err.stack) {
          alert(`${err.message}\r\n${err.stack}`)
        } else {
          let s = ''
          if (err.fileName) { s += `${err.fileName} ` }
          if (err.lineNumber) { s += `[line ${err.lineNumber}] ` }
          alert(s + (s ? ': ' : '') + err.message)
        }
      } else {
        const canvas = document.createElement('canvas')
        canvas.id = 'barcode'
        document.body.appendChild(canvas)
        bw.bitmap().show(canvas, 'N')
        callback(canvas)
      }
    })
  }

  _drawText(ctx, text, left, top, width, fontSize) {
    ctx.font = `${fontSize}px Arial`

    let resLeft = Math.round((width - ctx.measureText(text).width) / 2)
    resLeft = resLeft > 0 ? resLeft : left

    ctx.fillText(text, resLeft, top + fontSize)

    return {
      top: top + fontSize,
      left
    }
  }

  draw(ctx) {
    const conf = this.__confs
    const { left } = conf
    let { top } = conf
    this._drawBarCode(function (self) {
      return function (barcodeCanvas) {
        if (conf.enableHRI) {
          const count = conf.modes.length
          _.each(conf.modes, (mode) => {
            switch (mode) {
              case 'above':
                var topLeft = self._drawText(ctx, self.__text, left, top, barcodeCanvas.width, 12)
                top = topLeft.top
                break
              case 'below':
                self._drawText(ctx, self.__text, left, top + 5 + barcodeCanvas.height, barcodeCanvas.width, 12)
                break
            }
          })
        }
        self._copyBarcode(barcodeCanvas, ctx, { top, left })
        document.body.removeChild(barcodeCanvas)
      }
    }(this))
  }

  width() {
    return this.__confs.width * this.__wh[0]
  }

  height() {
    let resHeight = this.__confs.height
    if (this.__confs.enableHRI) {
      _.each(this.__confs.modes, (mode) => {
        resHeight += 12
        if (mode == 'below') {
          resHeight += 5
        }
      })
    }
    return resHeight
  }

  value() {
    return this.__text
  }
}
