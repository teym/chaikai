import { baseConf } from '@/utils/request'

export function getConf() {
  const conf = baseConf()
  return {
    url: conf.url + '/oss/upload',
    headers: conf.headers
  }
}
