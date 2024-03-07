/* 
   引入产品请求接口
*/
import * as trademake from '@/api/product/trademake'
import * as attr from '@/api/product/attr'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'

// 引入权限相关接口
import * as user from '@/api/acl/user'
import * as role from '@/api/acl/role'
import * as premission from '@/api/acl/premission'
// 对外暴露
export default {
  trademake,
  attr,
  sku,
  spu,
  user,
  role,
  premission
}
