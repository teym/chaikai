import request from '@/utils/request'

export function fetchBannerList(query) {
  return request({
    url: '/sys/banner/list',
    method: 'get',
    params: query
  })
}
export function addBanner(data) {
  return request({
    url: '/sys/banner',
    method: 'post',
    data
  })
}
export function updateBanner(data) {
  return request({
    url: '/sys/banner',
    method: 'put',
    data
  })
}
export function removeBanner(id) {
  return request({
    url: '/sys/banner/' + id,
    method: 'delete'
  })
}

export function fetchNotiList(query) {
  return request({
    url: '/sys/announcement/list',
    method: 'get',
    params: query
  })
}
export function addNoti(data) {
  return request({
    url: '/sys/announcement',
    method: 'post',
    data
  })
}
export function updateNoti(data) {
  return request({
    url: '/sys/announcement',
    method: 'put',
    data
  })
}
export function removeNoti(id) {
  return request({
    url: '/sys/announcement/' + id,
    method: 'delete'
  })
}
