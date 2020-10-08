import request from '@/utils/request'

export function fetchBannerList(query) {
  return request({
    url: '/banner/list',
    method: 'get',
    params: query
  })
}
export function addBanner(data) {
  return request({
    url: '/banner',
    method: 'post',
    data
  })
}
export function updateBanner(data) {
  return request({
    url: '/banner',
    method: 'put',
    data
  })
}
export function removeBanner(id) {
  return request({
    url: '/banner/' + id,
    method: 'delete'
  })
}

export function fetchNotiList(query) {
  return request({
    url: '/announcement/list',
    method: 'get',
    params: query
  })
}
export function addNoti(data) {
  return request({
    url: '/announcement',
    method: 'post',
    data
  })
}
export function updateNoti(data) {
  return request({
    url: '/announcement',
    method: 'put',
    data
  })
}
export function removeNoti(id) {
  return request({
    url: '/announcement/' + id,
    method: 'delete'
  })
}
