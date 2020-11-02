import request, { baseConf } from '@/utils/request'
import { exportConf } from "@/api/oss";

export function fetchList(query) {
  return request({
    url: '/br/activity/list',
    method: 'get',
    params: query
  })
}

export function fetchData(id) {
  return request({
    url: '/br/activity/' + id,
    method: 'get'
  })
}

export function fetchActivityQR(id) {
  return request({
    url: `/br/activity/${id}/miniapp/qrcode`,
    method: 'get',
    params: { path: 'pages/detail/main' }
  })
}

export function fetchIssues(query) {
  return request({
    url: '/ticket/ao/list',
    method: 'get',
    params: query
  })
}
export function fetchTickets() {
  return request({
    url: '/ticket/ao/items',
    method: 'get'
  })
}
export function fetchShip(no) {
  return request({
    url: '/common/logistics',
    method: 'get',
    params: { no }
  })
}
export function fetchScope() {
  return request({
    url: '/br/activity/order/score/items',
    method: 'get'
  })
}
export function updateScope(data) {
  return request({
    url: '/br/activity/order/score',
    method: 'post',
    data
  })
}
export function fetchStat() {
  return request({
    url: '/br/activity/stat',
    method: 'get'
  })
}
export function updateAction(data) {
  return request({
    url: '/br/activity/order/action',
    method: 'post',
    data
  })
}
export function createData(data) {
  return request({
    url: '/br/activity',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/br/activity',
    method: 'put',
    data
  })
}
export function passAll(data) {
  return request({
    url: '/br/activity/order/passAll',
    method: 'post',
    data
  })
}
export function updateNum(data) {
  return request({
    url: '/br/activity/quota',
    method: 'put',
    data
  })
}

export function submitData(id) {
  return request({
    url: '/br/activity/submit',
    method: 'put',
    data: { id }
  })
}

export function removeData(id) {
  return request({
    url: '/br/activity/' + id,
    method: 'delete'
  })
}

export function fetchPv(query) {
  return request({
    url: '/br/activity/goods/list',
    method: 'get',
    params: query
  })
}

export function fetchOdList(query) {
  return request({
    url: '/br/activity/order/list',
    method: 'get',
    params: query
  })
}
export function fetchOdStat(query) {
  return request({
    url: '/br/activity/order/stat',
    method: 'get',
    params: query
  })
}

export function complain(data) {
  return request({
    url: '/ticket/ao',
    method: 'post',
    data
  })
}

export function readPingce(id) {
  return request({
    url:`/br/activity/order/evaluation/${id}/read`,
    method: 'post'
  })
}

export function exportToken() {
  return request({
    url: '/br/activity/order/exportToken',
    method: 'get'
  })
}
export function downloadUrl(id) {
  return exportConf('/br/activity/order/export/undelivered', { brActivityId: id })
}
export function importUrl() {
  return baseConf().url + '/br/activity/order/import/undelivered'
}