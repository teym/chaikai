export function fetch (url, { method, headers, body }) {
  var tmp = {
    task: null,
    headers: {},
    call: () => {
      // console.log('on header', resp)
    }
  }
  return new Promise((resolve, reject) => {
    tmp.task = mpvue.request({
      url,
      method,
      data: body,
      header: headers,
      responseType: 'text',
      success: (resp) => {
        console.log(resp)
        const { data, statusCode, header } = resp
        const res = {
          headers: { map: header },
          statusCode,
          text: () => {
            return new Promise((resolve, reject) => {
              try {
                resolve(typeof data === 'string' ? data : '')
              } catch (e) {
                reject(e)
              }
            })
          },
          json: () => {
            return new Promise((resolve, reject) => {
              try {
                resolve(typeof data === 'string' ? JSON.parse(data) : data)
              } catch (e) {
                reject(e)
              }
            })
          }
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: (e) => {
        reject(e)
      },
      complete: () => {
        tmp.task.offHeadersReceived && tmp.task.offHeadersReceived(tmp.call)
      }
    })
    tmp.task.onHeadersReceived && tmp.task.onHeadersReceived(tmp.call)
  })
}

export function upload (url, filePath, header) {
  return new Promise((resolve, reject) => {
    mpvue.uploadFile({
      url,
      filePath,
      name: 'file',
      header,
      success: ({ data, statusCode, header }) => {
        console.log(data, statusCode, header)
        const res = {
          headers: { map: header },
          statusCode,
          json: () => {
            return new Promise((resolve, reject) => {
              try {
                resolve(typeof data === 'string' ? JSON.parse(data) : data)
              } catch (e) {
                reject(e)
              }
            })
          }
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
