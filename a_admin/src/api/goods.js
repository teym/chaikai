import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/br/goods/list',
    method: 'get',
    params: query
  })
}

export function fetchData(id) {
  return request({
    url: '/br/goods/' + id,
    method: 'get'
  })
}

export function importData(query) {
  return request({
    url: '/br/goods/import',
    method: 'post',
    data: query
  })
}

export function createData(data) {
  return request({
    url: '/br/goods',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/br/goods',
    method: 'put',
    data
  })
}
export function removeData(id) {
  return request({
    url: '/br/goods/' + id,
    method: 'delete'
  })
}
export function fetchSkus() {
  return request({
    url: '/br/goods/sku/group/list',
    method: 'get'
  })
}

export function fetchPv(query) {
  return request({
    url: '/br/account/brand/list',
    method: 'get',
    params: query
  })
}

export function createPv(data) {
  return request({
    url: '/br/account/brand',
    method: 'post',
    data
  })
}

export function submitPv(data) {
  return request({
    url: '/br/account/brand/submit',
    method: 'post',
    data
  })
}
