
// 接口文档 http://39.98.123.211:8170/swagger-ui.html# 
import request from '@/utils/requestV1'

const url = '/admin/acl/role'

/* 
  获取角色管理分页列表
    接口： /admin/acl/role/{page}/{limit}
   请求方式：get

    // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
*/

export const reqRoleList = (page, limit, searchObj = {}) => request({ url: `${url}/${page}/${limit}`, method: 'get', params: searchObj })

/* 
    新增角色管理
    接口： /admin/acl/role/save
   请求方式：post
*/

export const reqRoleSave = role => request({ url: `${url}/save`, method: 'post', data: role })

/* 
    更新角色管理
    接口： /admin/acl/role/update
   请求方式：put
*/

export const reqRoleUpdate = role => request({ url: `${url}/update`, method: 'put', data: role })

/* 
   删除某个角色
   接口：/admin/acl/role/remove/{id}
   请求：delete

*/

export const reqRemoveRoleOne = id => request({ url: `${url}/remove/${id}`, method: 'delete' })

/* 
   删除多个角色 
   接口：/admin/acl/role/batchRemove
   请求：deletes

*/

export const reqRemoveRoleAll = ids => request({ url: `${url}/batchRemove`, method: 'delete', data: ids })
