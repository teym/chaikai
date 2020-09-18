import _ from 'underscore'
import { fetch } from './fetch'
import {mstore} from './store'
import md5 from 'blueimp-md5'

function cleanParam (p) {
  return _.object(_.pairs(p).filter(([k, v]) => (!(_.isNull(v) || _.isUndefined(v) || v === 'null' || v === 'undefined'))))
}

function mapHeaders (headers) {
  return _.object(_.map(_.keys(headers.map), (k) => ([k.toLowerCase(), headers.map[k]])))
}

function sign (param) {
  const timestamp = Date.now()
  const s = md5(_.map(_.extend(param, { timestamp }), (v, k) => (`${k}=${v}`)).sort().join('&') + md5('meiwen888') + timestamp)
  return { timestamp, sign: s }
}
const conf = {
  host: 'http://tpjtest.newtvmall.com',
  token: '',
  base: { app: 'XMTT' }
}
function setup (cache) {
  if (!conf.token || !cache) {
    conf.token = mstore.getItem('token') || ''
  }
}
function requestConf (path, params) {
  setup(true)
  const pp = cleanParam(_.extend({}, conf.base, params || {}))
  const qq = _.extend(pp, sign(pp))
  const queryStr = _.map(qq, (v, k) => (`${k}=${encodeURIComponent(v)}`)).join('&')
  const url = `${conf.host}/${path}?${queryStr}`
  const requestHeaders = conf.token ? { accessToken: conf.token } : {}

  console.log('-- conf', url, conf.token)
  return {url, headers: requestHeaders}
}
function requestGet (path, params) {
  const {url, headers} = requestConf(path, params)
  console.log('<--', 'GET', path, params)
  return fetch(url, {
    method: 'GET',
    headers: headers
  }).then(ret => {
    return Promise.all([ret.json(), Promise.resolve(mapHeaders(ret.headers))])
  }).then(([json, headers]) => {
    console.log('-->', 'GET', path, json)
    if (json.success) {
      return { json, headers }
    }
    throw json
  }).catch(e => {
    if (!e.info) { e.info = '请求出错' }
    throw e
  })
}
function requestPost (path, params) {
  setup(true)
  const pp = cleanParam(_.extend({}, conf.base, params || {}))
  const qq = _.extend(pp, sign(pp))
  const url = `${conf.host}/${path}`
  const requestHeaders = conf.token ? { accessToken: conf.token } : {}
  console.log('<--', 'POST', path, qq, conf.token)
  return fetch(url, {
    method: 'POST',
    headers: _.extend({ 'Content-Type': 'application/json' }, requestHeaders),
    body: JSON.stringify(qq)
  }).then(ret => {
    return Promise.all([ret.json(), Promise.resolve(mapHeaders(ret.headers))])
  }).then(([json, headers]) => {
    console.log('-->', 'POST', path, json)
    if (json.success) {
      return { json, headers }
    }
    throw json
  }).catch(e => {
    if (!e.info) { e.info = '请求出错' }
    throw e
  })
}
function requestRaw (url, headers) {
  return fetch(url, {
    method: 'GET',
    headers
  })
}

export const mrequest = { get: requestGet, raw: requestRaw, post: requestPost, conf: requestConf, setup }
export default mrequest
