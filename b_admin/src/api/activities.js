import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/br/activity/list',
    method: 'get',
    params: query
  })
}

export function fetchStat() {
  return request({
    url: '/br/activity/stat',
    method: 'get'
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

export function submitData(data) {
  return request({
    url: '/br/activity/sumbit',
    method: 'post',
    data
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
