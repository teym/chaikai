import { mrouter } from './router'
import { mrequest } from './request'
import { mstore } from './store'
import { mapi } from './api'
import { muiapi } from './uiapi'
import { msignal } from './signal'

export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
const CHS = {
  1: { img: '/static/images/channel_wb.png' },
  2: { img: '/static/images/channel_bi.png' },
  4: { img: '/static/images/channel_xhs.png' },
  8: { img: '/static/images/channel_dy.png' },
  16: { img: '/static/images/channel_ks.png' }
}
export function mapChannel (channels) {
  return channels.map(i => Object.assign({}, i, CHS[i.platformId]))
}

mapi.isLogin = () => {
  return !!mstore.getItem('token')
}
const login = mapi.login
const userInfo = mapi.userInfo
mapi.rlogin = login
mapi.login = () => {
  return login().then(code => {
    return Promise.all([Promise.resolve(code.code), userInfo()])
  }).then(([code, info]) => {
    return mrequest.post('/bl/auth/miniapp', Object.assign(
      {},
      info.userInfo,
      {
        code,
        encryptInfo:
          { encryptedData: info.encryptedData, iv: info.iv }
      }
    ))
  }).then(({ json }) => {
    mstore.setItem('token', json.data.token)
  })
}
// mapi.regist = (phone, c) => {
//   return login().then(code => {
//     return Promise.all([Promise.resolve(code.code), userInfo()])
//   }).then(([code, info]) => {
//     const ucode = mapi.launchOptions(c).ucode || ''
//     return mrequest.post('api/auth/miniapp/register', { code, info, phone, ucode })
//   }).then(({ headers }) => {
//     mstore.setItem('token', headers.accesstoken)
//   })
// }
// mapi.loginPhone = (phone, code, ucode) => {
//   return mrequest.post('api/auth/login/telephone', { telephone: phone, smsCode: code })
//     .then(({ json, headers }) => {
//       if (json.code === 121) {
//         return mrequest.post('api/auth/checkUcode', { ucode: ucode || 'XMTT12', telephone: phone })
//       } else {
//         return Promise.resolve({ json: {}, headers })
//       }
//     }).then(({ headers }) => {
//       mstore.setItem('token', headers.accesstoken)
//     })
// }
// mapi.loginPass = (account, password) => {
//   return mrequest.post('api/auth/login/pwd', { account, password }).then(({ headers }) => {
//     mstore.setItem('token', headers.accesstoken)
//   })
// }

export const request = mrequest
export const store = mstore
export const router = mrouter
export const api = mapi
export const uiapi = muiapi
export const signal = msignal

export default {
  formatNumber,
  formatTime,
  mapChannel,
  request,
  signal,
  store,
  router,
  uiapi,
  api
}
