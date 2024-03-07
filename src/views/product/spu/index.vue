<template>
  <div>
    <!-- 三级分类 全局组件 -->
    <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />

    <el-card>
      <!-- 底部是由三部分进行切换的 -->
      <!-- 
        展示Spu列表
       -->
      <div v-show="scene === 0">
        <!-- 按钮 -->
        <div style="margin: 10px 0">
          <el-button icon="el-icon-plus" type="primary" :disabled="category3 === ''" @click="addSpu">添加SPU</el-button>
        </div>
        <!-- 表格 -->
        <el-table border :data="records" style="width: 100%">
          <el-table-column type="index" label="序号" width="100px" />
          <el-table-column label="spu名称" prop="spuName" />
          <el-table-column label="spu描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="scope">
              <span title="添加spu" style="padding-right:10px">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addSku(scope.row)"
                />
              </span>
              <span title="修改spu" style="padding-right:10px">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  @click="updateSpu(scope.row)"
                />
              </span>
              <span title="查看当前spu的sku列表" style="padding-right:10px">
                <el-button size="mini" type="info" icon="el-icon-info" @click="seeSkuList(scope.row)" />
              </span>
              <!-- 
                  当前element 版本 为 2.13.2
                  el-popconfirm : 确定气泡框
                  deleteSpu(scope.$index)
                  
                  @onConfirm 确定按钮事件的回调
                 -->

              <el-popconfirm 
                placement="top" 
                :title="`你确定删除”${scope.row.spuName}“吗？`"
                @onConfirm="deleteSpu(scope.row)"
              >
                <span slot="reference" title="删除spu" style="padding-right:10px">
                  <el-button size="mini" type="danger" icon="el-icon-delete-solid" />
                </span>
             
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <!-- 
              total: 总条目数
              current-page：当前页面数
              page-size：每页显示条目个数
              pager-count: 按钮显示个数，超过数量会折叠
              layout: 按钮布局
              @current-change：	currentPage 改变时会触发
              @size-change：	pageSize 改变时会触发
          -->
        <div style="margin-top: 10px; text-align: center">
          <el-pagination
            background
            :total="total"
            :current-page="page"
            :page-size="limit"
            :page-sizes="[3,5, 10]"
            prev-text="上一页"
            next-text="下一页"
            layout=" prev, pager, next, jumper, ->,sizes, total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
      <!-- 
        添加或修改spu
         在原生事件中，$event 是事件对象；在自定义事件中，$event是传递过来的数据（参数）

         ref 如果在普通的DOM元素上，引用指向的就是该DOM元素;
         如果在子组件上，引用的指向就是子组件实例，然后父组件就可以通过 ref 主动获取子组件的属性或者调用子组件的方法
       -->
      <SpuForm 
        v-show="scene === 1" 
        ref="spu"
        @changScene="changScene"
      />
      <!-- 
        添加sku
       -->
      <SkuForm v-show="scene === 2" ref="sku" @changScenes="changScenes" />
       
    </el-card>
    <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="handleClose">
      <el-table v-loading="loading" border style="width: 100%" :data="skuList">
        <el-table-column prop="skuName" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column label="默认图片">
          <template slot-scope="scope">
            <img :src="scope.row.skuDefaultImg" alt="" width="100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Sku',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 控制表格的显示与隐藏
      isShowTable: true,
      // 一级分类id
      category1: '',
      // 二级分类id
      category2: '',
      // 三级分类id
      category3: '',
      // 当前页
      page: 1,
      // 每页显示几条数据
      limit: 3,
      // spu 列表
      records: [],
      // 一共有多少条数据
      total: 0,
      /* 
        0: 表示展示Spu列表
        1: 添加或修改spu
        2: 添加sku
      */
      scene: 0,
      // Dialog 弹出一个对话框, 控制Dialog的显示隐藏
      dialogTableVisible: false,
      // SPU下的 SKU的列表信息
      skuList: [],
      // 某个SPU的信息
      spu: {},
      // 表格的loading 加载效果
      loading: true
    }
  },
  methods: {
    // 获取id分类自定义事件回调
    getCategoryId(categoryId, level) {
      if (level === '1') {
        this.category1 = categoryId
        this.category2 = ''
        this.category3 = ''
        this.records = []
      } else if (level === '2') {
        this.category2 = categoryId
        this.category3 = ''
        this.records = []
      } else {
        this.category3 = categoryId
        // 获取SPU列表
        this.getSpuList()
      }
    },

    // 获取SPU列表
    async getSpuList() {
      const result = await this.$api.spu.reqSpuList(this.page, this.limit, this.category3)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 点击是第几页的回调
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    // pageSize 改变时会触发
    handleSizeChange(limit) {
      // 整理参数发起请求
      this.limit = limit
      this.getSpuList()
    },

    // 添加spu
    addSpu() {
      this.isShowTable = false
      this.scene = 1

      // 获取子组件的方法
      this.$refs.spu.addSpuData(this.category3)
    },

    // 修改spu
    updateSpu(row) {
      this.isShowTable = false
      this.scene = 1
      // 获取子组件的方法
      this.$refs.spu.initSpuData(row)
    },

    // 自定义事件回调
    changScene({ scene, flag }) {
      // 切换场景
      this.scene = scene
      // 解锁分类
      this.isShowTable = true
      // 重新获取SPU列表
      if (flag === '修改') {
        this.getSpuList()
      } else {
        this.page = 1
        this.getSpuList()
      }
    },

    //
    changScenes(scene) {
      // 切换场景
      this.scene = scene
      // 解锁分类
      this.isShowTable = true
    },

    // 删除spu
    async deleteSpu(row) {
      // 发送删除请求
      const result = await this.$api.spu.reqDeleteSpu(row.id)

      if (result.code === 200) {
        this.$message.success('删除成功')
        // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
        if (this.records.length <= 1) {
          this.page -= 1
        }
        // 删除成功后 ，重新发请请求
        this.getSpuList()
      }
    },

    // 添加SKU
    addSku(row) {
      // 切换场景
      this.scene = 2
      // 让 父组件调用子组件的方法,发请求
      this.$refs.sku.getData(this.category1, this.category2, this.category3, row)
    },

    // 查看SKU列表
    async seeSkuList(row) {
    // 
      this.spu = row

      this.dialogTableVisible = true

      const result = await this.$api.sku.reqSkuList(row.id)
       
      if (result.code === 200) {
        // 关闭loading加载效果
        this.loading = false
        this.skuList = result.data
      }
    },

    // 关闭 Dialog 的回调
    handleClose(done) {
      // 开启loading效果
      this.loading = true
     
      // 清除 skuList 数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>

<style>

</style>
