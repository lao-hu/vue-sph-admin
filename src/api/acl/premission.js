
// 接口文档 http://39.98.123.211:8170/swagger-ui.html# 
import request from '@/utils/requestV1'

const url = '/admin/acl/permission'

/* 
  获取菜单管理分页列表
    接口： /admin/acl/premission/{page}/{limit}
   请求方式：get

*/

export const reqPremissionList = () => request({ url: `${url}`, method: 'get' })

/* 
    保存菜单管理
    接口： /admin/acl/premission/save
    请求方式：post

*/

export const reqPermissionSave = (permission) => request({ url: `${url}/save`, method: 'post', data: permission })

/* 
    更新菜单管理
    接口： /admin/acl/premission/update
    请求方式：put

*/

export const reqPermissionUpdate = (permission) => request({ url: `${url}/update`, method: 'put', data: permission })

/* 
    获取指定角色的权限
    接口： /admin/acl/permission/toAssign/{roleId}
    请求方式：get

*/

export const reqPreToAssign = roleId => request({ url: `${url}/toAssign/${roleId}`, method: 'get'})

/* 
    给角色分配权限
    接口： /admin/acl/permission/doAssignAcl
    请求方式：post

*/
export const reqPreDoAssignAcl = permission => request({ url: `${url}/doAssignAcl`, method: 'post', data: permission })


/* 
  递归删除菜单
  接口： /admin/acl/permission/remove/{id}
  请求方式：delete
*/

export const reqPreRemove = id => request({url:`${url}/remove/${id}`,method:'delete'})