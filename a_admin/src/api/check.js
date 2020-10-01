import request from '@/utils/request'

export function fetchCompanyList(query) {
  return request({
    url: '/sys/company/list',
    method: 'get',
    params: query
  })
}
export function updateCompanyState(data) {
  return request({
    url: '/sys/company',
    method: 'put',
    data
  })
}

export function fetchBrandList(query) {
  return request({
    url: '/sys/brand/list',
    method: 'get',
    params: query
  })
}
export function updateBrandState(data) {
  return request({
    url: '/sys/brand',
    method: 'put',
    data
  })
}

export function fetchBloggerList(query) {
  return request({
    url: '/sys/blogger/channel/list',
    method: 'get',
    params: query
  })
}
export function updateBloggerState(data) {
  return request({
    url: '/sys/blogger/channel',
    method: 'put',
    data
  })
}

export function fetchActivityList(query) {
  return request({
    url: '/sys/activity/list',
    method: 'get',
    params: query
  })
}
export function updateActivityState(data) {
  return request({
    url: '/sys/activity/status',
    method: 'put',
    data
  })
}
export function fetchActivity(id) {
  return request({
    url: '/sys/activity/' + id,
    method: 'get'
  })
}
export function updateActivity(data) {
  return request({
    url: '/sys/activity',
    method: 'put',
    data
  })
}
