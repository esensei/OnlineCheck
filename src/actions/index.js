export function fetchCheck(payload) {
  return {
    type: 'CHECK_FETCH',
    payload
  }
}

export function removeCheck() {
  return {
    type: 'CHECK_REMOVE'
  }
}

export function startListenBLE() {
  return {
    type: 'RUN_FIND_BLE'
  }
}


export function uploadedCheckImage() {
  return {
    type: 'CHECK_UPLOAD'
  }
}

export function downloadedCheckImage() {
  return {
    type: 'CHECK_DOWNLOADED'
  }
}
