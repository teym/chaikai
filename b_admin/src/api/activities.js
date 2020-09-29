import request from '@/utils/request'

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
