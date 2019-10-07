export default class Position {
  constructor(t, l, b, r) {
    this.__top = t || 0
    this.__left = l || 0
    this.__bottom = b || 0
    this.__right = r || 0
  }

  reset() {
    this.__top = 0
    this.__left = 0
    this.__width = 0
    this.__height = 0
  }

  set setLeft(l) {
    this.__left = l
  }

  set setTop(t) {
    this.__top = t
  }

   setTopLeft = (t, l) => {
     this.__top = t
     this.__left = l
   }

   setBottomRight = (b, r) => {
     this.__bottom = b
     this.__right = r
   }

   copy() {
     return new Position(this.__top, this.__left,
       this.__bottom, this.__right)
   }

   get topLeft() {
     return {
       top: this.__top,
       left: this.__left
     }

   }
   get getRight(){
     return {
       right: this.__right
     }
   }
   get bottomRight() {
     return {
       bottom: this.__bottom,
       right: this.__right
     }
   }
}
