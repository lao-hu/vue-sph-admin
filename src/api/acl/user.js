
// 接口文档 http://39.98.123.211:8170/swagger-ui.html# 
import request from '@/utils/requestV1'

const url = "/admin/acl/user"

/* 
  获取管理用户分页列表
    接口： /admin/acl/user/{page}/{limit}
   请求方式：get

    // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
*/

export const reqUserList = (page,limit,searchObj={}) => request({url:`${url}/${page}/${limit}`,method:'get',params:searchObj})

/* 
    批量删除用户列表
    接口： /admin/acl/user/batchRemov
    请求方式：delete

*/
export const reqRemoveUsers = ids => request({url:`${url}/batchRemove`,method:"delete",data:ids})

/* 
    添加一个用户
    接口： /admin/acl/user/save
    请求方式：post

*/
export const reqSaveUser = user => request({url:`${url}/save`,method:"post",data:user})

/* 
    更新一个用户
    接口：  /admin/acl/user/update
    请求方式：put

*/
export const reqUpdateUser = user => request({url:`${url}/update`,method:"put",data:user})