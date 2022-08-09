import Cookies from 'js-cookie'

const TokenKey = 'hr-token'
const TimeKey = 'time-key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTime() {
  return Cookies.set(TimeKey, Date.now())
}

export function getTime() {
  return Cookies.get(TimeKey)
}
