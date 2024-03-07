/* 
  平台属性管理接口
*/
import request from '@/utils/requestV2'

/* 
  获取一级分类的数据
    接口： /admin/product/getCategory1
   请求方式：get
*/

export function reqgetCategory1() {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'get'
  })
}

/* 
  通过一级分类的id，获取二级分类的数据
    接口： /admin/product/getCategory2/{category1Id}
   请求方式：get
*/

export function reqgetCategory2(category1Id) {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  })
}

/* 
  通过二级分类的id，获取三级分类的数据
    接口： /admin/product/getCategory2/{category1Id}
   请求方式：get
*/

export function reqgetCategory3(category2Id) {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  })
}

/* 
   通过 一，二，三分类id获取商品
   接口：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
   请求方式：get
*/

export function reqAttrInfoList(category1Id, category2Id, category3Id) {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}

/* 
  添加属性与属性值的接口
  接口：    /admin/product/saveAttrInfo
  请求方式：post

  {
  "attrName": "string",  // 属性名：如：颜色  
    
  "attrValueList": [  // 属性值如：红色，黑色，白色
    {
      "attrId": 0,  // 属性名的id, 知道是属于哪个属性的
      "valueName": "string"  // 属性值名称如： 黑色
    }
  ],
  "categoryId": 0,  // 分类id, 都是三级分类id
  "categoryLevel": 0, // 几级id，3级
  }
*/

export function reqSaveAttrInfo(data) {
  return request({
    url: `/admin/product/saveAttrInfo`,
    method: 'post',
    data
  })
}

/* 
  删除属性
  /admin/product/deleteAttr/{attrId}
*/

export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })
