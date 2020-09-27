export function alert (conf) {
  return new Promise((resolve, reject) => {
    mpvue.showModal(Object.assign({}, conf, {
      success: (r) => {
        if (r.confirm) {
          resolve({})
        } else {
          reject(new Error(''))
        }
      },
      fail: reject
    }))
  })
}
export function toast (title) {
  return title && mpvue.showToast({ title: title || '', icon: 'none' })
}
export function loading (title) {
  mpvue.showLoading({ title: title || '' })
  return () => {
    mpvue.hideLoading()
  }
}

export function chooseImage () {
  return new Promise((resolve, reject) => {
    mpvue.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (e) => {
        resolve(e.tempFilePaths[0])
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
export function chooseAddress () {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (e) => {
        const addr = {
          address: e.detailInfo,
          province: e.provinceName,
          city: e.cityName,
          county: e.countyName,
          telephone: e.telNumber,
          name: e.userName
        }
        resolve(addr)
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
export function previewImgs (imgs) {
  return new Promise((resolve, reject) => {
    wx.previewImage({
      urls: imgs,
      success: resolve,
      fail: reject
    })
  })
}

export const muiapi = { alert, toast, loading, chooseImage, chooseAddress, previewImgs }
export default muiapi
