<template>
  <div>
    <el-form :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="list in trademarkList"
            :key="list.id"
            :label="list.tmName"
            :value="list.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="spu.description"
          type="textarea"
          placeholder="SPU描述"
          :rows="5"
        />
      </el-form-item>
      <!-- 文件上传 -->
      <el-form-item label="SPU图片">
        <!-- 
          action： 必选参数，上传的地址
         // show-file-list：默认值是true,  是否显示已上传文件列表，（上传多个时）
            list-type:	文件列表的类型
          on-preview:	点击文件列表中已上传的文件时的钩子(预览图片), 	function(file)
          on-remove:	文件列表移除文件时的钩子(删除图片)	function(file, fileList)
          file-list	  照片展示的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
          on-success:	文件上传成功时的钩子	function(response, file, fileList)	
        -->
        <el-upload
          action="/dev2-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <!-- 预览的图片 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 
            整个平台的销售属性只有三个: 颜色, 版本, 尺码
         -->
        <el-select
          v-model="attrIdAndAttrName"
          :placeholder="unSelectSalaAttr.length ? `你还${unSelectSalaAttr.length}个未选择的属性`: `没有啦!!!`"
        >
          <el-option
            v-for="unselect in unSelectSalaAttr"
            :key="unselect.id"
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
          />
        </el-select>
        <!-- 添加销售属性 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="attrIdAndAttrName === ''"
          @click="addSaleAttr"
        >添加销售属性</el-button>

        <!-- SPU属于自己的销售属性 -->

        <el-table :data="spu.spuSaleAttrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="120px" />
          <el-table-column label="属性值名称列表">
            <template slot-scope="scope">
              <!-- 
                   tag组件 动态编辑标签

                   closable:	        是否可关闭	      boolean
                   disable-transitions:	是否禁用渐变动画   boolean
                 -->
              <!-- 标签组件 -->
              <!--
                展示已有的属性列表的
              -->
              <el-tag
                v-for="(tag,index) in scope.row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- input 输入框 -->
              <el-input
                v-if="scope.row.inputVisible"
                ref="saveTagInput"
                v-model="scope.row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              />
              <!-- 添加按钮  -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(scope.row)"
              >+ 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" @click="handleSpuSaleAttr(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu 是放回给服务器的数据结构
      spu: {
        id: 0,
        // 三级分类的id
        category3Id: 0,
        // 品牌id
        tmId: '',
        // 描述
        description: '',
        // 品牌名称
        spuName: '',
        // spu 图片列表
        spuImageList: [],
        // 商品的自身属性
        spuSaleAttrList: []
      }, // 存储SPU基本信息
      trademarkList: [], // 品牌属性
      spuImageList: [], // spu 图片列表
      saleAttrList: [], // 整个平台的销售属性只有三个: 颜色, 版本, 尺码,
      attrIdAndAttrName: '' // 收集未被选择的销售属性,在发请求之前记得整理好
      
    }
  },
  computed: {
    // 计算出未被选择的销售属性

    // 整个平台的销售属性只有三个: 颜色, 版本, 尺码
    unSelectSalaAttr() {
      // this.saleAttrList 是 整个平台的销售属性只有三个: 颜色, 版本, 尺码
      // this.spu.spuSaleAttrList 是 该商品自身的销售属性
      return this.saleAttrList.filter((item) => {
        // every() 方法测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值。
        return this.spu.spuSaleAttrList.every(
          (item1) => item.name !== item1.saleAttrName
        )
      })
    }
  },

  methods: {
    // 点击关闭标签, 删除属性
    handleClose(row, index) {
      // 使用数组的splice方法删除数组
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // input 根据输入内容来添加属性值
    handleInputConfirm(row) {
      const inputValue = row.inputValue

      // 属性值不能为空
      if (inputValue.trim() === '') {
        return this.$message.error('属性值不能为空')
      }
      // 检测属性值是否重复了
      const repeatValue = row.spuSaleAttrValueList.every((item) => item.saleAttrValueName !== inputValue)
      if (!repeatValue) {
        return this.$message.error('属性值不能重复')
      }

      // 添加一个属性值
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: inputValue
      })

      row.inputVisible = false
      // row.inputValue = ''
    },
    // 点击添加按钮标签
    /* 
      inputValue , inputVisible  两个属性不能直接添加到data，
      因为每个属性值都有自己的 inputVisible，inputValue 属性
    */ 
    addSaleAttrValue(row) {
      // 点击按钮需要把 button 变成 input, 通过当前的 inputVisible 属性控制
      // inputValue , inputVisible 那个属性当前对象没有
      // 响应式的添加 inputVisible 属性
      this.$set(row, 'inputVisible', true)
      // 响应式的添加 inputValue 属性
      this.$set(row, 'inputValue', '')
    },
    // 图片删除时触发的函数
    /* 
       file: 被删除的那张图片
       fileList: 剩余的图片数量
    */
    handleRemove(file, fileList) {
      // 图片删除后,把剩下的图片数量传给,图片列表
      // 发给服务器的时候, 图片字段里面是不需要 name 和 url 字段的
      this.spuImageList = fileList
    },

    // 图片预览时触发的函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 图片新增后,也需要搜索图片

    /* 
     response: 
        图片上传成功的回调  
        {code: 200, message: '成功', data: 'http://139.198.127.41:9000/sph/20240124/luxun.jpg', ok: true}
    
    file:
        上传的那种图片的信息, 

    filelist:
          所有的图片信息
    
    */
    handleSuccess(response, file, fileList) {
      // 图片上传成功后, 全部的图片列表
      // 发给服务器的时候, 图片字段里面是不需要 name 和 url 字段的
      this.spuImageList = fileList
    },

    // 初始化spuform 方法
    async initSpuData(row) {
      // 获取SPU基本信息
      const spuResult = await this.$api.spu.reqSpu(row.id)

      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌属性
      const tmResult = await this.$api.spu.reqTrademarkList()
      if (tmResult.code === 200) {
        this.trademarkList = tmResult.data
      }

      // 获取SPU图片列表 reqSpuImageList
      const imgResult = await this.$api.spu.reqSpuImageList(row.id)
   
      if (imgResult.code === 200) {
        // [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        // 由于element 要求图片列表，访问必须包含 name 和 url两个字段
        const img = imgResult.data
        img.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = img
      }

      // 平台销售属性  reqBaseSaleAttrList
      const attrResult = await this.$api.spu.reqBaseSaleAttrList()

      if (attrResult.code === 200) {
        this.saleAttrList = attrResult.data
      }
    },
    // 添加选择的销售属性
    addSaleAttr() {
      // 把收集到的销售属性进行字符串分割 , 'id:属性值'
      const attrs = this.attrIdAndAttrName.split(':')
      // 把搜集到属性值, 向 spu 对象的 spuSaleAttrList 属性里添加新的销售属性
      const newSalaAttr = {
        baseSaleAttrId: attrs[0],
        saleAttrName: attrs[1],
        spuSaleAttrValueList: []
      }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSalaAttr)
      // 添加成功，情况下拉框的选择
      this.attrIdAndAttrName = ''
    },

    // 删除销售属性
    handleSpuSaleAttr(index) {
      // 删除这一行是属性
      this.spu.spuSaleAttrList.splice(index, 1)
    },

    // 点击保存按钮
    async addOrUpdateSpu() {
      // 整理参数：收集照片墙的数据, 需要携带imgUrl与imgName
      this.spu.spuImageList = this.spuImageList.map((item) => {   
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      const result = await this.$api.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message.success('保存成功')
        this.$emit('changScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      
      // 清楚残留的数据，
      Object.assign(this.$data, this.$options.data())
    },

    // 点击添加SPU按钮的时候，发送请求函数
    async addSpuData(category3) {
      this.spu.category3Id = category3
      // 获取品牌属性
      const tmResult = await this.$api.spu.reqTrademarkList()
      if (tmResult.code === 200) {
        this.trademarkList = tmResult.data
      }
      
      // 平台销售属性  reqBaseSaleAttrList
      const attrResult = await this.$api.spu.reqBaseSaleAttrList()

      if (attrResult.code === 200) {
        this.saleAttrList = attrResult.data
      }
    },

    // 点击取消按钮
    cancel() {
      // 通知 changScene 事件回调，切换场景
      this.$emit('changScene', { scene: 0, flag: '' }) 
      
      // 清理数据 
      // this.$options.data() 获取当前组件初始状态下的data。
      // 组件实列化的响应式数据 this._data 
      // Vue 实例观察的数据对象 this.$data
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
