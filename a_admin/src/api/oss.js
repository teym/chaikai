import { baseConf } from '@/utils/request'
import _ from 'underscore'

export function getConf() {
  const conf = baseConf()
  return {
    url: conf.url + '/oss/upload',
    headers: conf.headers
  }
}

export function exportConf(path, params) {
  const conf = baseConf()
  const query = _.map(params, (v, k) => (`${k}=${encodeURIComponent(v)}`)).join('&')
  return `${conf.url}${path}?token=${encodeURIComponent(conf.headers.token)}&${query}`
}
