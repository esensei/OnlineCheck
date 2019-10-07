import _ from 'lodash'
import { pc866 } from './codepages/pc866'

export default class PageDecoder {
  constructor(cp) {
    this.codePage = cp || 0x0
    this.charCodePages = {
      0x00: 'USA',
      0x01: 'Japanese Katakana',
      0x02: 'Multilingual',
      0x03: 'Portuguese',
      0x04: 'Canadian-French',
      0x05: 'Nordic',
      0x06: 'Simplified Kanji, Hirakana',
      0x07: 'Simplified Kanji',
      0x08: 'Simplified Kanji',
      0x10: 'Western European Windows Code Set',
      0x11: 'Cirillic #2',
      0x12: 'Latin 2',
      0x13: 'Euro'
    }
  }

  getCodeTable() {
    /*
    switch (this.codePage) {
      case 0x0:
      case 0x1:
      case 0x2:
      case 0x3:
      case 0x4:
      case 0x5:
      case 0x6:
      case 0x7:
      case 0x8:
      case 0x10:
      case 0x11:
        return pc866
      case 0x12:
      case 0x13:
        break
    }
    */
    return pc866
  }

  setCodePage(cp) {
    cp != null && (this.codePage = cp)
  }

  resetCodePage() {
    this.codePage = 0x0
  }

  getCodePage() {
    return this.charCodePages[this.codePage]
  }

  decodeText = (text) => {
    const codeTable = this.getCodeTable();


    return _.map(text, item => {

      const unicodeChar = codeTable[item]
      return String.fromCharCode(
        unicodeChar != null ? unicodeChar :
          item
      )
    })
      .join('')
  }
}
