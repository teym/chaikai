import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, valid) {
  return Cookies.set(TokenKey, token, valid)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
