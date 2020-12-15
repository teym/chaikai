import request from '@/utils/request'
import { exportConf } from '@/api/oss'

export function fetchOrderList(query) {
  return request({
    url: '/sys/activity/order/fine/list',
    method: 'get',
    params: query
  })
}
export function exportOrderList(query) {
  return exportConf('/sys/export/activity/order/fine/list', query)
}
export function closeOrder(data) {
  return request({
    url: '/sys/activity/order/fine',
    method: 'put',
    data
  })
}
export function remarkOrder(data) {
  return request({
    url: '/sys/activity/order/fine',
    method: 'put',
    data
  })
}
