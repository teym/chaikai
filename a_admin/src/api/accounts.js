import request from '@/utils/request'

export function fetchBloggerList(query) {
  return request({
    url: '/sys/blogger/list',
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
