import request from '@/utils/request'

export function fetchInvoiceList(query) {
  return request({
    url: '/sys/finance/invoice/list',
    method: 'get',
    params: query
  })
}
export function fetchInvoiceOrderList(query) {
  return request({
    url: '/sys/finance/invoice/relation/list',
    method: 'get',
    params: query
  })
}
export function updateInvoice(data) {
  return request({
    url: '/sys/finance/invoice',
    method: 'put',
    data
  })
}

export function fetchBWithdrawList(query) {
  return request({
    url: '/sys/finance/withdraw/list',
    method: 'get',
    params: query
  })
}
