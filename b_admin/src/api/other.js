import request from '@/utils/request'

export function fetchNotiList() {
  return request({
    url: '/sys/announcement/list',
    method: 'get'
  })
}
