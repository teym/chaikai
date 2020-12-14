import _ from 'underscore'
import { fetch, upload } from './fetch'
import { mstore } from './store'
// import md5 from 'blueimp-md5'

function cleanParam (p) {
  return _.object(_.pairs(p).filter(([k, v]) => (!(_.isNull(v) || _.isUndefined(v) || v === 'null' || v === 'undefined'))))
}

function mapHeaders (headers) {
  return _.object(_.map(_.keys(headers.map), (k) => ([k.toLowerCase(), headers.map[k]])))
}

// function sign (param) {
//   const timestamp = Date.now()
//   const s = md5(_.map(_.extend(param, { timestamp }), (v, k) => (`${k}=${v}`)).sort().join('&') + md5('meiwen888') + timestamp)
//   return { timestamp, sign: s }
// }
const conf = {
  host: 'http://192.168.50.17:8888/api',
  // web: 'https://sstest.ckgift.cn/th/article.html',

  // host: 'https://apartest.ckgift.cn/api',
  // web: 'https://sstest.ckgift.cn/th/article.html',

  // host: 'https://apart.ckgift.cn/api',
  web: 'https://ss.ckgift.cn/h/article.html',

  token: '',
  base: {}

}

function setup (cache) {
  if (!conf.token || !cache) {
    conf.token = mstore.getItem('token') || ''
  }
}
function requestConf (path, params) {
  setup(true)
  const pp = cleanParam(_.extend({}, conf.base, params || {}))
  const qq = pp // _.extend(pp, sign(pp))
  const queryStr = _.map(qq, (v, k) => (`${k}=${encodeURIComponent(v)}`)).join('&')
  const url = `${conf.host}${path}?${queryStr}`

  return { url, headers: {} }
}
function request (method, url, header, body) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, header, conf.token ? { token: conf.token } : {})
  console.log(method, '<--', url, headers, body)
  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : ''
  }).then(ret => {
    return Promise.all([ret.json(), Promise.resolve(mapHeaders(ret.headers))])
  }).then(([json, headers]) => {
    console.log(method, '-->', url, json)
    if (json.success) {
      return { json, headers }
    }
    throw json
  }).catch(e => {
    console.log(method, '-->', url, e)
    if (e.json) {
      return e.json().then(r => { throw Object.assign(r, { info: r.info || r.msg || '请求出错' }) })
    }
    if (!e.info) { e.info = e.msg || '请求出错' }
    throw e
  })
}
function requestGet (path, params) {
  const { url, headers } = requestConf(path, params)
  return request('GET', url, headers)
}

function requestPost (path, params) {
  setup(true)
  const pp = cleanParam(_.extend({}, conf.base, params || {}))
  const qq = pp// _.extend(pp, sign(pp))
  const url = `${conf.host}${path}`
  return request('POST', url, {}, qq)
}

function requestPut (path, params) {
  setup(true)
  const pp = cleanParam(_.extend({}, conf.base, params || {}))
  const qq = pp// _.extend(pp, sign(pp))
  const url = `${conf.host}${path}`
  return request('PUT', url, {}, qq)
}
function requestRaw (url, headers) {
  return fetch(url, {
    method: 'GET',
    headers
  })
}
function uploadFile (path, file) {
  setup(true)
  const header = conf.token ? { token: conf.token } : {}
  const url = `${conf.host}${path}`
  return upload(url, file, header).then(ret => {
    return Promise.all([ret.json(), Promise.resolve(mapHeaders(ret.headers))])
  }).then(([json, headers]) => {
    if (json.success) {
      return { json, headers }
    }
    throw json
  }).catch(e => {
    if (!e.info) { e.info = e.msg || '请求出错' }
    throw e
  })
}

function rawConf () {
  return Object.assign({}, conf)
}

export const mrequest = { get: requestGet, raw: requestRaw, post: requestPost, put: requestPut, conf: requestConf, rawConf: rawConf, setup, upload: uploadFile }
export default mrequest
