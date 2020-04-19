export const strToHexArr = (str) => {
  const arr = []
  let curStr = ''
  for (let i = 0; i < str.length; i++) {
    if (i % 2 !== 0) {
      curStr += str[i]
      arr.push(parseInt(curStr, 16))
      curStr = ''
    } else {
      curStr += str[i]
    }
  }
  return arr
}
