import request from '@/utils/request'
import { exportConf } from '@/api/oss'

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
export function fetchGoods(query) {
  return request({
    url: '/sys/activity/goods/list',
    method: 'get',
    params: query
  })
}
export function fetchActivityQR(id) {
  return request({
    url: `/br/activity/${id}/miniapp/qrcode`,
    method: 'get',
    params: { path: 'pages/detail/main' }
  })
}
export function updateActivity(data) {
  return request({
    url: '/sys/activity',
    method: 'put',
    data
  })
}

export function fetchOrderList(query) {
  return request({
    url: '/sys/activity/order/list',
    method: 'get',
    params: query
  })
}
export function exportOrderList(query) {
  return exportConf('/sys/export/activity/order/list', query)
}
export function closeOrder(data) {
  return request({
    url: '/sys/activity/order/close',
    method: 'put',
    data
  })
}
export function fetchDeposit(id) {
  return request({
    url: '/sys/activity/order/' + id + '/deposit',
    method: 'get'
  })
}

export function fetchIssueList(query) {
  return request({
    url: '/sys/activity/order/ticket/list',
    method: 'get',
    params: query
  })
}

export function exportIssueList(query) {
  return exportConf('/sys/export/activity/order/ticket/list', query)
}

export function fetchServeList(query) {
  return request({
    url: '/sys/finance/subscribe/list',
    method: 'get',
    params: query
  })
}
export function exportServeList(query) {
  return exportConf('/sys/export/finance/subscribe/list', query)
}
