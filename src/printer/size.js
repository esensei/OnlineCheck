export default class Size {
  constructor(w, h) {
    this.width = w || 0
    this.height = h || 0
  }

  setWidth(w) {
    this.width = w
  }

  setHeight(h) {
    this.height = h
  }

  reset() {
    this.width = 0
    this.height
  }

  width() {
    return this.width
  }

  height() {
    return this.height
  }
}
