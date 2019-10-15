export function fetchCheck(payload) {
  return {
    type: "CHECK_FETCH",
    payload
  }
}

export function removeCheck() {
  return {
    type: "CHECK_REMOVE"
  }
}
