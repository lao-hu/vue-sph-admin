import request from '@/utils/requestV1'

//  对外暴露的登录接口
export function login(data) {
  return request({
    // /admin/index/login  
    // 尚硅谷的接口  /admin/acl/index/login
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
// 对外暴露用户信息接口
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

//  对外暴露的退出登录接口
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
