import request from '@/utils/request'
import md5 from 'blueimp-md5'

export function login(data) {
  return request({
    url: '/br/auth/login/password',
    method: 'post',
    data
  })
}
export function loginCode(data) {
  return request({
    url: '/sys/login/qywx',
    method: 'post',
    data
  })
}
export function regist(data) {
  return request({
    url: '/br/auth/register',
    method: 'post',
    data
  })
}

export function reset(data) {
  return request({
    url: '/br/auth/resetPassword',
    method: 'put',
    data
  })
}

export function getInfo() {
  return request({
    url: '/br/account/info',
    method: 'get'
  })
}

export function fetchStat() {
  return request({
    url: '/br/account/company',
    method: 'get'
  })
}

export function fetchFinance() {
  return request({
    url: '/br/account/finance',
    method: 'get'
  })
}

export function fetchDash() {
  return request({
    url: '/br/home/stat',
    method: 'get'
  })
}

export function fetchHistory(query) {
  return request({
    url: '/br/account/finance/record/list',
    method: 'get',
    params: query
  })
}
export function fetchInvoices(query) {
  return request({
    url: '/br/invoice/list',
    method: 'get',
    params: query
  })
}
export function fetchInvoice(query) {
  return request({
    url: '/br/invoice/order/list',
    method: 'get',
    params: query
  })
}

export function fetchLinkInvoice(query) {
  return request({
    url: '/br/invoice/order/relation/list',
    method: 'get',
    params: query
  })
}

export function createInvoice(data) {
  return request({
    url: '/br/invoice',
    method: 'post',
    data
  })
}

export function buy(data) {
  return request({
    url: '/br/account/finance/exchange',
    method: 'post',
    data
  })
}
export function buyAlipay(data) {
  return request({
    url: '/alipay/br',
    method: 'post',
    data
  })
}
export function withdraw(data) {
  return request({
    url: '/br/account/finance/withdraw',
    method: 'post',
    data
  })
}

export function auth(data) {
  return request({
    url: '/br/account/company',
    method: 'post',
    data
  })
}

export function getCode(telephone, type) {
  const sign = md5(`telephone=${telephone}&type=${type}chaikai`)
  return request({
    url: '/sms/verifyCode',
    method: 'post',
    data: { type, telephone, sign }
  })
}
export function bindPhone(data) {
  return request({
    url: '/br/account/telephone/bind',
    method: 'put',
    data
  })
}
export function resetPass(data) {
  return request({
    url: '/br/account/password',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/br/auth/loginout',
    method: 'post'
  })
}
