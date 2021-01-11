let gOptions = {}
export function launchOptions (component) {
  let options = component && component.$root.$mp
  let path = options && options.page && options.page.route
  if (!(options && options.query.scene)) {
    options = mpvue.getEnterOptionsSync ? mpvue.getEnterOptionsSync() : gOptions
    path = options.path
    if (!options.query.scene) {
      options = mpvue.getLaunchOptionsSync ? mpvue.getLaunchOptionsSync() : gOptions
      path = options.path
    }
  }

  let param = decodeURIComponent(options.query.scene || '')
  switch (path) {
    case 'pages/detail/main':
      return { id: param }
  }
  return {}
}
export function onLaunch (params) {
  if (!mpvue.getEnterOptionsSync) {
    gOptions = params || {}
  }
}
export function copy (txt) {
  return new Promise((resolve, reject) => {
    mpvue.setClipboardData({ data: txt, success: resolve, fail: reject })
  })
}
export function login () {
  return new Promise((resolve, reject) => {
    mpvue.login({
      success: resolve,
      fail: reject
    })
  })
}
function checkSession () {
  return new Promise((resolve, reject) => {
    mpvue.checkSession({
      success: resolve,
      fail: reject
    })
  })
}
export function userInfo () {
  return checkSession().catch(() => login()).then(() => {
    return new Promise((resolve, reject) => {
      mpvue.getUserInfo({
        withCredentials: true,
        success: resolve,
        fail: reject
      })
    })
  })
}

export function pay (data) {
  return new Promise((resolve, reject) => {
    mpvue.requestPayment(Object.assign({}, data, {
      success: (r) => {
        console.log(r)
        resolve(r)
      },
      fail: (e) => {
        console.log(e)
        e.info = e.errMsg.endsWith('cancel') ? '支付取消' : '支付失败'
        reject(e)
      }
    }))
  })
}

export function imageInfo (src) {
  return new Promise((resolve, reject) => {
    mpvue.getImageInfo({ src, success: resolve, fail: reject })
  })
}

export function saveCanvas (canvas) {
  return new Promise((resolve, reject) => {
    mpvue.canvasToTempFilePath({ canvasId: canvas, fileType: 'png', success: resolve, fail: reject })
  })
}
export function saveImage (path) {
  const getSetting = (auth) => {
    return new Promise((resolve, reject) => {
      mpvue.getSetting({
        success: (r) => {
          resolve(r.authSetting[auth])
        },
        fail: reject
      })
    })
  }
  const auth = (auth) => {
    return new Promise((resolve, reject) => {
      mpvue.authorize({ scope: auth, success: resolve, fail: reject })
    })
  }
  const save = (path) => {
    return new Promise((resolve, reject) => {
      mpvue.saveImageToPhotosAlbum({
        filePath: path,
        success: resolve,
        fail: reject
      })
    })
  }
  return getSetting('scope.writePhotosAlbum').then(r => {
    return r ? Promise.resolve() : auth('scope.writePhotosAlbum')
  }).then(() => save(path))
}

export function pixelRate () {
  const mobile = mpvue.getSystemInfoSync()
  return mobile.windowWidth / 375
}

export function isIOS () {
  const mobile = mpvue.getSystemInfoSync()
  return mobile.platform === 'ios'
}

export function download (url, header) {
  return new Promise((resolve, reject) => {
    mpvue.downloadFile({ url, header, success: resolve, fail: reject })
  })
}

export function canvasContext (id) {
  return mpvue.createCanvasContext(id)
}

export const mapi = { launchOptions, onLaunch, copy, login, userInfo, pay, imageInfo, saveCanvas, saveImage, pixelRate, download, canvasContext, isIOS }
export default mapi
