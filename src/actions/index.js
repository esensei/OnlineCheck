export function fetchCheck(payload) {


  return {
    type: 'CHECK_FETCH',
    payload
  }
}


export function uploadImageCheck(payload) {

  return {
    type: 'UPLOAD_IMAGE_CHECK',
    payload
  }
}


export function removeAllCheck() {
  return {
    type: 'REMOVE_IMAGES'
  }
}



export function startListenBLE() {
  return {
    type: 'RUN_FIND_BLE'
  }
}


export function checkUploaded() {
  return {
    type: 'CHECK_UPLOAD'
  }
}

export function downloadedCheckImage() {
  return {
    type: 'CHECK_DOWNLOADED'
  }
}
