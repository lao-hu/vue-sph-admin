/* 
  平台属性管理接口
*/
import request from '@/utils/requestV2'

/* 
{
  "category3Id": 0,
  "price": 0,
    "spuId": 0,
  "tmId": 0,
  "weight": "string",
  "skuAttrValueList": [
    {
      "attrId": 0,
      "attrName": "string",
      "id": 0,
      "skuId": 0,
      "valueId": 0,
      "valueName": "string"
    }
  ],
  "skuDefaultImg": "string",
  "skuDesc": "string",
  "skuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string",
      "skuId": 0,
      "spuImgId": 0
    }
  ],
  "skuName": "string",
  "skuSaleAttrValueList": [
    {
      "id": 0,
      "saleAttrId": 0,
      "saleAttrName": "string",
      "saleAttrValueId": 0,
      "saleAttrValueName": "string",
      "skuId": 0,
      "spuId": 0
    }
  ],

}

    获取销售属性的数据
    请求方式： GET
    接口地址：/admin/product/spuSaleAttrList/{spuId}
*/
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: `get` })

/* 
  保存SKU信息数据
  请求方式：POST
  接口地址：/admin/product/saveSkuInfo
*/

export const reqSaveSkuInfo = (data) => request({ url: `/admin/product/saveSkuInfo`, method: `post`, data })

/* 
   查下SKU列表
   请求方式：GET
   接口地址：/admin/product/findBySpuId/{spuId}
*/

export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: `get` })

/* 
  获取SKU管理 ，列表的数据
  请求方式：GET
  接口地址：/admin/product/list/{page}/{limit}
*/
export const reqSkuManageList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: `get` })

/* 
  SKU商品，上架 
  请求方式：GET
  接口地址：/admin/product/onSale/{skuId}
*/

export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: `get` })

/* 
  SKU商品，下架 
  请求方式：GET
  接口地址：/admin/product/cancelSale/{skuId}
*/

export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: `get` })

/* 
  获取SKU商品详情数据 
  请求方式：GET
  接口地址：/admin/product/getSkuById/{skuId}
*/
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: `get` })

/* 
  删除SKU商品信息
  请求方式：delete
  接口地址：/admin/product/deleteSku/{skuId}
*/
export const reqDeleteSku = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: `delete` })
