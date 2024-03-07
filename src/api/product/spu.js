/* 
  平台属性管理接口
*/
import request from '@/utils/requestV2'

/*
   获取SPU管理数据 

  接口地址：/admin/product/{page}/{limit}
  请求方式：get
*/

export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: `get`, params: { category3Id }})

/* 
  获取SPU基本信息

  接口地址：/admin/product/getSpuById/{spuId}
  请求方式：get
*/

export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: `get` })

/* 
  获取品牌信息
  接口地址：/admin/product/baseTrademark/getTrademarkList
  请求方式：get
*/
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: `get` })

/* 
 获取SPU图片列表
 接口地址：/admin/product/spuImageList/{spuId}
 请求方式：get
*/

export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: `get` })

/* 
  获取平台销售属性，属性最多3个
  接口地址：/admin/product/baseSaleAttrList
  请求方式：get
*/

export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: `get` })

// 修改SPU 或 添加SPU, 修改和添加都是一样，唯一区别就是有没有id

export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带的参数是否由id
  if (spuInfo.id) {
    // 修改
    return request({
      url: `/admin/product/updateSpuInfo`,
      method: `post`,
      data: spuInfo
    })
  } else {
    // 添加
    return request({
      url: `/admin/product/saveSpuInfo`,
      method: `post`,
      data: spuInfo
    })
  }
}

// 删除SPU数据
/* 
   接口地址：/admin/product/deleteSpu/{spuId}
   请求方式：delete
*/
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: `delete` })
