import request from '@/utils/request'

export function fetchBloggerList(query) {
  return request({
    url: '/sys/account/bl/list',
    method: 'get',
    params: query
  })
}
export function fetchBlogger(id) {
  return request({
    url: '/sys/account/bl/' + id,
    method: 'get'
  })
}
export function unbindBlogger(data) {
  return request({
    url: '/sys/account/bl/channel/unbind',
    method: 'post',
    data
  })
}
export function fetchBloggerFinance(query) {
  return request({
    url: '/sys/account/bl/finance/record/list',
    method: 'get',
    params: query
  })
}
export function fetchCompanyList(query) {
  return request({
    url: '/sys/company/list',
    method: 'get',
    params: query
  })
}
