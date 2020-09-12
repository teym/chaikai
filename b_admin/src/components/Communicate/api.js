import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/chat/br/room/list',
    method: 'get'
  })
}
export function fetchStat() {
  return request({
    url: '/chat/br/unread',
    method: 'get'
  })
}
export function fetchHistory(query) {
  return request({
    url: '/chat/br/room/record/list',
    method: 'get',
    params: query
  })
}
export function createData(data) {
  return request({
    url: '/chat/br/room',
    method: 'post',
    data
  })
}
export function createHistory(data) {
  return request({
    url: '/chat/br/record',
    method: 'post',
    data
  })
}
export function updateData(id) {
  return request({
    url: '/chat/br/room' + id + '/read',
    method: 'post',
    data: {}
  })
}
