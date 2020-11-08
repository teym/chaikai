import request from '@/utils/request'
import { exportConf } from '@/api/oss'

export function fetchInvoiceList(query) {
  return request({
    url: '/sys/finance/invoice/list',
    method: 'get',
    params: query
  })
}
export function exportInvoiceList(query) {
  return exportConf('/sys/export/finance/invoice/list', query)
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
export function exportBWithdrawList(query) {
  return exportConf('/sys/export/finance/withdraw/list', query)
}

export function updateBWithdraw(data) {
  return request({
    url: '/sys/finance/withdraw',
    method: 'put',
    data
  })
}

export function fetchTopupList(query) {
  return request({
    url: '/sys/finance/recharge/list',
    method: 'get',
    params: query
  })
}
export function exportTopupList(query) {
  return exportConf('/sys/export/finance/recharge/list', query)
}
export function addTopup(data) {
  return request({
    url: '/sys/finance/recharge',
    method: 'post',
    data
  })
}
export function fetchCWithdrawList(query) {
  return request({
    url: '/sys/finance/bl/withdraw/list',
    method: 'get',
    params: query
  })
}

export function exportCWithdrawList(query) {
  return exportConf('/sys/export/finance/bl/withdraw/list', query)
}

export function fetchBGiftList(query) {
  return request({
    url: '/sys/finance/br/giveaway/list',
    method: 'get',
    params: query
  })
}
export function exportBGiftList(query) {
  return exportConf('/sys/export/finance/br/giveaway/list', query)
}
export function addBGift(data) {
  return request({
    url: '/sys/finance/br/giveaway',
    method: 'post',
    data
  })
}
export function fetchCGiftList(query) {
  return request({
    url: '/sys/finance/bl/giveaway/list',
    method: 'get',
    params: query
  })
}
export function exportCGiftList(query) {
  return exportConf('/sys/export/finance/bl/giveaway/list', query)
}
export function addCGift(data) {
  return request({
    url: '/sys/finance/bl/giveaway',
    method: 'post',
    data
  })
}
