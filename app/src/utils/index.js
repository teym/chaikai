import { mrouter } from './router'
import { mrequest } from './request'
import { mstore } from './store'
import { mapi } from './api'
import { muiapi } from './uiapi'
import { msignal } from './signal'
import moment from 'moment'
import _ from 'underscore'

export function resetData (obj, data) {
  _.each(_.keys(data), (k) => {
    obj[k] = data[k]
  })
}

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
export function isPhoneNumber (s) {
  return /^1[0-9]{10}$/.test(s)
}
export function formatMsgTime (date) {
  const m = moment(date)
  const s = m.isSame(new Date(), 'day') ? m.format('Ahh:mm') : m.format('MM-DD HH:mm')
  return s.replace('AM', '上午').replace('PM', '下午')
}
export function isImgMsg (s) {
  return /^\[img:http[s]?:\/\/[a-zA-Z0-9-_./]+\]$/.test(s)
}
export function imgMsgUrl (s) {
  return /^\[img:(http[s]?:\/\/[a-zA-Z0-9-_./]+)\]$/.exec(s)[1]
}
export function makeImgMsg (u) {
  return `[img:${u}]`
}
export function diffTime (date, def) {
  const sec = date ? moment(date).diff(moment(), 'seconds') : 0
  if (sec <= 0) {
    return def
  }
  const d = Math.floor(sec / (24 * 60 * 60))
  const h = Math.floor((sec - d * 24 * 60 * 60) / (60 * 60))
  const m = Math.floor((sec - d * 24 * 60 * 60 - h * 60 * 60) / 60)
  return `${d > 0 ? d + '天' : ''}${(d > 0 || h > 0) ? h + '小时' : ''}${m}分`
}

export function checkAddress (conf, address) {
  if (conf.length === 0) {
    return true
  }
  const isSame = (b) => {
    const p1 = address.province.replace('省', '').replace('市', '').replace('自治区', '').replace('特别行政区', '')
    const p2 = b.province.replace('省', '').replace('市', '').replace('自治区', '').replace('特别行政区', '')
    const c1 = address.city.replace('市', '').replace('区', '')
    const c2 = (b.city || '').replace('市', '').replace('区', '')
    return p1 === p2 && (!c2 || c1 === c2)
  }
  const type = conf[0].type
  // console.log(conf, address, type)
  if (type === 1) {
    return !_.some(conf, isSame)
  }
  return _.some(conf, isSame)
}
export function formatAddressConf (conf) {
  const type = conf[0].type
  return (type === 1 ? '不' : '') + '可收货地区如下：' + conf.map(i => (i.province + (i.city || ''))).join('、')
}

export function matchURL (u) {
  const url = /.*(https?:\/\/[-a-zA-Z0-9@:%._+~#=/]+).*/.exec(u || '')
  return url && url.length > 1 ? url[1] : ''
}

const AllChannels = [{
  platformId: 1,
  platformName: '微博'
}, {
  platformId: 2,
  platformName: 'B站'
}, {
  platformId: 4,
  platformName: '小红书'
}, {
  platformId: 8,
  platformName: '抖音'
}, {
  platformId: 16,
  platformName: '快手'
}]

const CHS = {
  1: { img: '/static/images/channel_wb.png', match: [/^https?:\/\/t.cn\/.+/, /^https?:\/\/([a-z0-9A-Z]+\.)?weibo.com\/.+/, /^https?:\/\/([a-z0-9A-Z]\.)?weibo.cn\/.+/] },
  2: { img: '/static/images/channel_bi.png', match: [/^https?:\/\/([a-z0-9A-Z]+\.)?bilibili.com\/.+/] },
  4: { img: '/static/images/channel_xhs.png', match: [/^https?:\/\/xhslink.com\/.+/, /^https?:\/\/([a-z0-9A-Z]+\.)?xiaohongshu.com\/.+/] },
  8: { img: '/static/images/channel_dy.png', match: [/^https?:\/\/([a-z0-9A-Z]+\.)?douyin.com\/.+/] },
  16: { img: '/static/images/channel_ks.png', match: [/^https?:v.kuaishou.com\/.+/, /^https?:\/\/([a-z0-9A-Z]+\.)?kuaishou.com\/.+/] }
}
export function mapChannel (channels) {
  return (channels || AllChannels).map(i => Object.assign({}, i, CHS[i.platformId]))
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
  checkAddress,
  formatAddressConf,
  formatMsgTime,
  formatNumber,
  formatTime,
  isPhoneNumber,
  mapChannel,
  makeImgMsg,
  resetData,
  matchURL,
  diffTime,
  imgMsgUrl,
  isImgMsg,
  request,
  signal,
  store,
  router,
  uiapi,
  api
}
