<template>
  <div>
    <!-- 表格 -->
    <el-table :data="records" border style="width: 100%">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号"
        width="80"
      />
      <el-table-column header-align="center" label="名称" prop="skuName" />
      <el-table-column header-align="center" label="描述" prop="skuDesc" />
      <el-table-column header-align="center" label="默认图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.skuDefaultImg" alt="" width="100px">
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        label="重量(KG)"
        prop="price"
        width="100"
      />
      <el-table-column
        header-align="center"
        label="价格(元)"
        prop="weight"
        width="100"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            v-if="scope.row.isSale === 0"
            title="下架"
            style="padding-right: 10px"
            @click="skuDowm(scope.row)"
          >
            <el-button size="mini" type="info" icon="el-icon-bottom" />
          </span>
          <span
            v-else
            title="上架"
            style="padding-right: 10px"
            @click="skuUp(scope.row)"
          >
            <el-button size="mini" type="success" icon="el-icon-top" />
          </span>
          <span title="修改sku" style="padding-right: 10px">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="$message.info(`正在开发中......`)"
            />
          </span>
          <span
            title="查看当前spu的sku列表"
            style="padding-right: 10px"
            @click="getSkuInfo(scope.row)"
          >
            <el-button size="mini" type="info" icon="el-icon-info" />
          </span>
          <!-- 
                  当前element 版本 为 2.13.2
                  el-popconfirm : 确定气泡框
                  deleteSpu(scope.$index)
                  
                  @onConfirm 确定按钮事件的回调
                 -->

          <el-popconfirm
            placement="top"
            :title="`你确定删除”${scope.row.skuName}“吗？`"
            @onConfirm="deleteSku(scope.row)"
          >
            <span slot="reference" title="删除spu" style="padding-right: 10px">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete-solid"
              />
            </span>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
        total: 总条目数
        current-page：当前页面页码
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
        :page-sizes="[3, 5, 10]"
        prev-text="上一页"
        next-text="下一页"
        layout=" prev, pager, next, jumper, ->,sizes, total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 
        抽屉效果
     -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
          >{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel style="width:300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" height="100%"> 
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 当前页
      page: 1,
      // 每页显示几条数据
      limit: 5,
      // spu 列表
      records: [],
      // 一共有多少条数据
      total: 0,
      // 控制抽屉的显示与隐藏
      show: false,
      // 根据ID 获取SKU的信息
      skuInfo: {}
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 点击是第几页的回调
    handleCurrentChange(page) {
      // 修改切换的页码数
      this.page = page
      // 重新发起请求
      this.getSkuList()
    },

    // pageSize 改变时会触发
    handleSizeChange(limit) {
      // 整理参数发起请求
      this.limit = limit
      // 重新发起请求
      this.getSkuList()
    },

    // 获取SKU管理下的数据
    async getSkuList() {
      // 发请求，获取SKU商品数据
      const result = await this.$api.sku.reqSkuManageList(
        this.page,
        this.limit
      )

      // 请求成功
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },

    // 管理SKU的上架
    async skuUp(row) {
      // 发请求让SKU产品上架
      const result = await this.$api.sku.reqOnSale(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message.success('上架成功')
      }
    },

    // 管理SKU的下架
    async skuDowm(row) {
      // 发请求让SKU产品下架
      const result = await this.$api.sku.reqCancelSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message.success('下架成功')
      }
    },

    // skuInfo 的详情
    async getSkuInfo(row) {
      this.show = true
      // 根据id 获取SKU信息
      const result = await this.$api.sku.reqSkuById(row.id)

      if (result.code === 200) {
        this.skuInfo = result.data
      }
    },

    // 删除sku信息
    async deleteSku(row) {
      // 根据id 删除SKU信息
      const result = await this.$api.sku.reqDeleteSku(row.id)

      if (result.code === 200) {
        this.$message.success('删除成功')

        // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
        if (this.records.length <= 1) {
          this.page -= 1
        }

        this.getSkuList()
      }
    }
  }
}
</script>
<style scoped>
.el-col.el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px;
}
/* 
  >>> 是深度选择器
*/
 >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>
<style>
 
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

</style>
