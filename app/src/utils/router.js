import conf from '@/app.json'
import _ from 'underscore'

export function mrouter (component) {
  function push (path, params) {
    const query = _.map(params, (v, k) => (`${k}=${encodeURIComponent(v)}`)).join('&')
    const url = path + (query ? '?' : '') + query
    if (conf.tabBar.list.find(i => path.endsWith(i.pagePath))) {
      mpvue.switchTab({ url })
    } else {
      mpvue.navigateTo({ url })
    }
  }
  function replace (path, params) {
    const query = _.map(params, (v, k) => (`${k}=${encodeURIComponent(v)}`)).join('&')
    const url = path + (query ? '?' : '') + query
    if (conf.tabBar.list.find(i => path.endsWith(i.pagePath))) {
      mpvue.switchTab({ url })
    } else {
      mpvue.redirectTo({ url })
    }
  }
  function replaceAll (path, params) {
    const query = _.map(params, (v, k) => (`${k}=${encodeURIComponent(v)}`)).join('&')
    const url = path + (query ? '?' : '') + query
    mpvue.reLaunch({url})
  }
  function params () {
    return _.mapObject(component.$root.$mp.query || {}, (v) => decodeURIComponent(v))
  }
  function pop () {
    mpvue.navigateBack()
  }
  function popAll () {
    mpvue.navigateBack({ delta: 99 })
  }
  return { push, replace, replaceAll, pop, popAll, params }
}
