function getItem (key) {
  if (mpvuePlatform === 'my') {
    return mpvue.getStorageSync({ key }).data
  } else {
    return mpvue.getStorageSync(key)
  }
}

function setItem (key, data) {
  if (mpvuePlatform === 'my') {
    mpvue.setStorageSync({
      key,
      data
    })
  } else {
    mpvue.setStorageSync(key, data)
  }
}

export const mstore = {getItem, setItem}

export default mstore
