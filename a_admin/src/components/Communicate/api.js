import request from '@/utils/request'
import _ from 'underscore'
import { province } from './province'
import { city } from './city'
import { county } from './county'

export function fetchList(query) {
  return request({
    url: '/chat/br/room/list',
    method: 'get',
    params: query
  })
}
export function fetchStat() {
  return request({
    url: '/chat/br/unread',
    method: 'get'
  })
}
export function fetchHistory(query) {
  return request({
    url: '/chat/br/room/record/list',
    method: 'get',
    params: query
  })
}

export function createHistory(data) {
  return request({
    url: '/chat/br/record',
    method: 'post',
    data
  })
}

export function uploadFile(f) {
  const form = new FormData()
  form.append('file', f)
  return request({
    url: '/oss/upload',
    method: 'post',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}

export function fetchOrder(id) {
  return request({
    url: '/sys/activity/order/' + id,
    method: 'get'
  })
}

export function updateIssueState(data) {
  return request({
    url: '/sys/activity/order/ticket',
    method: 'put',
    data
  })
}
export function updateAddress(data) {
  return request({
    url: '/br/activity/order/receiver',
    method: 'put',
    data
  })
}
export function cancelReward(id) {
  return request({
    url: '/sys/activity/order/' + id + '/cancelReward',
    method: 'put'
  })
}
export const addrs = _.map(province, i => {
  return {
    value: i.name,
    label: i.name,
    children: _.map(city[i.id + ''], (j) => {
      return {
        value: j.name,
        label: j.name,
        children: _.map(county[j.id + ''], (m) => {
          return {
            value: m.name,
            label: m.name
          }
        })
      }
    })
  }
})
