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

export const muiapi = { alert, toast, loading }
export default muiapi
