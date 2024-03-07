<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="价格(元)"
          type="number"
        />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          type="textarea"
          value=""
          placeholder="规格描述"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item
            v-for="attr in attrInfoList"
            :key="attr.id"
            :label="attr.attrName"
          >
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- 
      
          selection-change	当选择项发生变化时会触发该事件, 	selection参数
         -->
        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60" />
          <el-table-column label="图片" width="220">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" width="100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isDefault === 0"
                type="primary"
                @click="changeDefault(scope.row)"
              >设为默认</el-button>
              <el-button v-else type="success" plain>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [], // spu 图片列表
      saleAttrList: [], // 整个平台的销售属性只有三个: 颜色, 版本, 尺码,
      // 属性表格数据
      attrInfoList: [],
      //  所需要的字段接口： http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/saveSkuInfoUsingPOST
      skuInfo: {
        /* 父组件传递的数据 */
        category3Id: 0, // 分类id
        spuId: 0, // spu商品id
        tmId: 0, // 品牌的id

        /*  通过表单收集的数据 */
        skuName: '', // sku名称
        price: 0, // 价格
        weight: '', // 重量
        skuDesc: '', // 描述

        /*  需要自己去收集的数据 */
        skuDefaultImg: '', // 默认图片

        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],

        // 收集的图片列表
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
          // },
        ],
        // 收集的销售属性列表
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ]
      },
      // 接收 父组件传递过来的当前SPU信息
      spu: {},
      // 接收，点击多选框触发的图片数据
      imgList: []
    }
  },
  methods: {
    // 获取数据
    async getData(category1, category2, category3, row) {
      //
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      // 接收 父组件传递过来的当前SPU信息
      this.spu = row

      // 图片的数据 获取SPU图片列表 reqSpuImageList
      const imgResult = await this.$api.spu.reqSpuImageList(row.id)
      if (imgResult.code === 200) {
        // this.spuImageList = imgResult.data
        const list = imgResult.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }

      // 获取销售属性
      const attrResult = await this.$api.sku.reqSpuSaleAttrList(row.id)
      if (attrResult.code === 200) {
        this.saleAttrList = attrResult.data
      }
      // 一，二，三分类id获取商品
      const result = await this.$api.attr.reqAttrInfoList(
        category1,
        category2,
        category3
      )
      if (result.code === 200) {
        this.attrInfoList = result.data
      }
    },

    // 当选择框发生改变时调用该方法
    // selection 参数，是selection-change事件回调参数
    handleSelectionChange(selection) {
      // 返回服务器的接口需要一个 isDefault的属性
      this.imgList = selection
    },

    // 设置 当前图片的isDefault属性等于1
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      // 点击的当前的图片的isDefault的属性为 1
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },

    // 取消按钮
    cancel() {
      // 通知 changScenes 事件回调，切换场景
      this.$emit('changScenes', { scene: 0, flag: '' })
      // 清理数据
      // this.$options.data() 获取当前组件初始状态下的data。
      // 组件实列化的响应式数据 this._data
      // Vue 实例观察的数据对象 this.$data
      Object.assign(this.$data, this.$options.data())
    },

    // 保存数据
    async save() {
      // 整理skuInfo,用户返回给服务器

      /* 
        
        array.reduce(function(accumulator, currentValue, currentIndex, arr), initialValue);

        accumulator:  必需。累计器
        currentValue: 必需。当前元素
        
        currentIndex: 可选。当前元素的索引；                    
        arr:          可选。要处理的数组
        initialValue: 可选。传递给函数的初始值，相当于accumulator的初始值

        */

      // 收集平台属性
      this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev, item) => {
        // attrIdAndValueId 属性存在，表示下拉框已选择
        if (item.attrIdAndValueId) {
          // attrIdAndValueId 值是： "${attr.id}:${attrValue.id}"
          const skuAttrId = item.attrIdAndValueId.split(':')
          prev.push({
            attrId: skuAttrId[0],
            valueId: skuAttrId[1]
          })
        }
        // 返回累计器
        return prev
      }, [])

      // 收集销售属性 
      this.skuInfo.skuSaleAttrValueList = this.saleAttrList.reduce((prev, item) => {
        // attrIdAndValueId 属性存在，表示下拉框已选择
        if (item.attrIdAndValueId) {
          const skuAttrId = item.attrIdAndValueId.split(':')
          prev.push({
            saleAttrId: skuAttrId[0],
            saleAttrValueId: skuAttrId[1]
          })
        }
        // 返回累计器
        return prev
      }, [])

      // 收集图片数据
      this.skuInfo.skuImageList = this.imgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      // 数据收集完毕，向服务器发送请求
      const result = await this.$api.sku.reqSaveSkuInfo(this.skuInfo)
      // 请求成功
      if (result.code === 200) {
        this.$message.success('添加sku成功')
        // 通知 changScenes 事件回调，切换场景
        this.$emit('changScenes', 0)
      }
    }
  }
}
</script>

<style>
</style>
