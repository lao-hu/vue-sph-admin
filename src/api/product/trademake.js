import request from '@/utils/requestV2'

// http://39.98.123.211:8510/swagger-ui.html#/ 接口文档
/* 
  这个模块就是品牌管理模块的数据
    接口地址：/admin/product/baseTrademark/{page}/{limit}
*/
export function reqbaseTrademarkList(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

// 新增品牌
/* 
  /admin/product/baseTrademark/save

*/
export function reqTrademarkSave(data) {
  return request({
    url: `/admin/product/baseTrademark/save`,
    method: 'post',
    data
  })
}

// 修改品牌
// /admin/product/baseTrademark/update
export function reqTrademarkUpdate(data) {
  return request({
    url: `/admin/product/baseTrademark/update`,
    method: 'put',
    data
  })
}

/* 
 删除品牌商品
 /admin/product/baseTrademark/remove/{id}
*/
export function reqTrademarkRemove(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
