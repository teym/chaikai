import request from '@/utils/request'
import md5 from 'blueimp-md5'

export function login(data) {
  return request({
    url: '/br/auth/login/password',
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

export function fetchHistory(query) {
  return request({
    url: '/br/account/finance/record/list',
    method: 'get',
    params: query
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

export function logout() {
  return request({
    url: '/br/auth/loginout',
    method: 'post'
  })
}
