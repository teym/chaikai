import request from '@/utils/request'
import { exportConf } from '@/api/oss'

export function fetchOrderList(query) {
  return request({
    url: '/sys/activity/order/list',
    method: 'get',
    params: query
  })
}
export function exportOrderList(query) {
  return exportConf('/sys/export/activity/order/list', query)
}
export function closeOrder(data) {
  return request({
    url: '/sys/activity/order/close',
    method: 'put',
    data
  })
}
export function remarkOrder(data) {
  return request({
    url: '/sys/activity/order/close',
    method: 'put',
    data
  })
}
