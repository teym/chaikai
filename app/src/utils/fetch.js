export function fetch (url, { method, headers, body }) {
  return new Promise((resolve, reject) => {
    mpvue.request({
      url,
      method,
      data: body,
      header: headers,
      responseType: 'text',
      success: ({ data, statusCode, header }) => {
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
