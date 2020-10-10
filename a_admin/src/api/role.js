import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/sys/menu/nav',
    method: 'get'
  })
}
export function getAllRoutes(query) {
  return request({
    url: '/sys/menu/list',
    method: 'get',
    params: query
  })
}

export function getRoles() {
  return request({
    url: '/sys/role/list',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/sys/role/update`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

export function getUsers(query) {
  return request({
    url: '/sys/role/department/list',
    method: 'get',
    params: query
  })
}
export function updateRoleUser(data) {
  return request({
    url: '/sys/role/users',
    method: 'post',
    data
  })
}
export function syncUser() {
  return request({
    url: '/sys/role/sync',
    method: 'post'
  })
}
