import Cookies from 'js-cookie'

const TokenKey = 'token'
// 获取cookie
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置cookie
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 存储cookie
export function removeToken() {
  return Cookies.remove(TokenKey)
}
