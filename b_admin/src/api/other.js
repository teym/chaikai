import request from '@/utils/request'

export function fetchNotiList() {
  return request({
    url: '/announcement/list',
    method: 'get'
  })
}
