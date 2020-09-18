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

const login = mapi.login
const userInfo = mapi.userInfo
mapi.rlogin = login
mapi.login = () => {
  return login().then(code => {
    return Promise.all([Promise.resolve(code.code), userInfo()])
  }).then(([code, info]) => {
    return mrequest.post('api/auth/login/wechat/miniapp', { code, info })
  }).then(({ headers }) => {
    mstore.setItem('token', headers.accesstoken)
  })
}
mapi.regist = (phone, c) => {
  return login().then(code => {
    return Promise.all([Promise.resolve(code.code), userInfo()])
  }).then(([code, info]) => {
    const ucode = mapi.launchOptions(c).ucode || ''
    return mrequest.post('api/auth/miniapp/register', { code, info, phone, ucode })
  }).then(({ headers }) => {
    mstore.setItem('token', headers.accesstoken)
  })
}
mapi.loginPhone = (phone, code, ucode) => {
  return mrequest.post('api/auth/login/telephone', { telephone: phone, smsCode: code })
    .then(({ json, headers }) => {
      if (json.code === 121) {
        return mrequest.post('api/auth/checkUcode', { ucode: ucode || 'XMTT12', telephone: phone })
      } else {
        return Promise.resolve({ json: {}, headers })
      }
    }).then(({ headers }) => {
      mstore.setItem('token', headers.accesstoken)
    })
}
mapi.loginPass = (account, password) => {
  return mrequest.post('api/auth/login/pwd', { account, password }).then(({ headers }) => {
    mstore.setItem('token', headers.accesstoken)
  })
}

export const request = mrequest
export const store = mstore
export const router = mrouter
export const api = mapi
export const uiapi = muiapi
export const signal = msignal

export default {
  formatNumber,
  formatTime,
  request,
  signal,
  store,
  router,
  uiapi,
  api
}
