export default class TextElement {
  constructor(text, conf, ctx) {
    this._conf = conf
    this._text = text
    this._ctx = ctx
  }

  draw(ctx) {
    const conf = this._conf
    this._setFont()
    ctx.fillText(this._text, conf.left, conf.top)
    if (conf.underline) {
      ctx.beginPath()
      ctx.lineWidth = conf.underlineMode || 1
      ctx.moveTo(conf.left, this.heightWithTop)
      ctx.lineTo(conf.left + this.width, this.heightWithTop)
      ctx.stroke()
    }
  }

  _getTopHeight() {
    return this._top + (this.height === 1 ? 0 : this.height)
  }

  _setFont() {
    this._font = this._font || `${(this._conf.fontWeight === 'normal' ? 'normal ' : 'bold ') +
    this._conf.fontSize}px Courier`
    this._ctx.font = this._font
  }

  getTextAlign() {
    return this._conf.textAlign
  }

  getLeft() {
    return this._conf.left
  }

  set(key, value) {
    return this._conf[key] = value
  }

  get width() {
    this._setFont()
    return this._ctx.measureText(this._text).width
  }

   getWidth = async () => {
     this._setFont()
     return (await this._ctx.measureText(this._text)).width
   }

   get widthWithLeft() {
     return this.width + this._conf.left
   }

   get height() {
     return this._conf.fontSize
   }

   get heightWithTop() {
     return this._conf.top + this._conf.lineHeight
   }
}
