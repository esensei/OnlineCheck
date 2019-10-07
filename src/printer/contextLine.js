export default class ContextLine {
  constructor(l, t, w, h) {
    this._left = l
    this._top = t
    this._height = h
    this._width = w
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(this._left, this._top)
    ctx.lineTo(this._left + this._width, this._getTopHeight())
    ctx.stroke()
  }

  _getTopHeight() {
    return this._top + (this._height === 1 ? 0 : this._height)
  }

  get width() {
    return this._width
  }

  get widthWithLeft() {
    return this._width + this._left
  }

  get height() {
    return this._height
  }

  get heightWithTop() {
    return this._getTopHeight()
  }
}
