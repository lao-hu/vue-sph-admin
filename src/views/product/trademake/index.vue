<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="addShop"
    >添加</el-button>
    <!-- 表格数据
    el-table：
        data是显示的数据
        border属性，它接受一个Boolean，设置为true即可启用。

    el-table-column：
        多选：设type属性为selection即可 设置多选框
        prop:对应列内容的字段名
        label:显示的标题
        scope:  通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据
            row: 数组回传的数据
     -->
    <el-table :data="records" border style="width: 100%">
      <el-table-column type="index" label="序号" width="180" />
      <el-table-column prop="tmName" label="品牌名称" width="180" />
      <el-table-column label="品牌logo">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="图片" width="80px">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="updataShop(scope.row)"
          >
            修改
          </el-button>

          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete-solid"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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
        :page-sizes="[5, 10, 15, 20]"
        prev-text="上一页"
        next-text="下一页"
        layout=" prev, pager, next, jumper, ->,sizes, total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 嵌套表单元素的dialog对话框 -->
    <!-- 
     title: 对话框标题
     visible.sync： 设置visible属性，它接收Boolean，当为true时显示 Dialog
     -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <!-- 
        model: 表单数据对象 
        只需要通过 rules 属性传入约定的验证规则，
        并将 Form-Item 的 prop 属性设置为需校验的字段名即可
      -->
      <el-form ref="ruleForm" :model="form" width="80%" :rules="rules">
        <el-form-item label="商品名称" label-width="120px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="商品logo" label-width="120px" prop="logoUrl">
          <!-- 文件上传插件 -->
          <!-- 
          action： 必选参数，上传的地址
          show-file-list：是否显示已上传文件列表，（上传多个时）
          on-success：上传成功时
          before-upload：文件上传之前
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev2-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:10px">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitShopData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademake',
  data() {
    var validatetmName = (rule, value, callback) => {
      // 自定义校验规则
      
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度在 2 到 10 个字符之间'))
      } else {
        callback()
      }
    }

    return {
      // 品牌数据
      page: 1, // 当前页码
      limit: 5, // 每页记录数
      total: 0, // 总条数
      records: [], // 数据
      // 控制对话框的显示与隐藏
      dialogFormVisible: false,
      form: {
        tmName: '',
        logoUrl: ''
      },
      // 对话框标题
      title: '添加品牌商品',

      /* 
      rules： 表单验证规则：
        required: 必填项
        message：提示信息
        trigger: 行为(事件)表示在什么下触发，比如点击行为click, 失去焦点行为 blur
      */
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'change' },
          // 自定义校验规则
          { validator: validatetmName, trigger: 'change' }
        ],
        // 商品图片的验证规则
        logoUrl: [{ required: true, message: '请上传商品logo' }]
      }
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    // 图片上传成功触发
    /* 
      res：成功之后的回调
          {
            "code": 200,
            "message": "成功",
            "data": "http://139.198.127.41:9000/sph/20240113/yijia.jpg",
            "ok": true
          }
      file:上传文件 
   
    */
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data
    },

    // 上传文件之前的钩子
    beforeAvatarUpload(file) {
      const fileExe = file.type
      const size = file.size / 1024
      let success = true
      if (fileExe !== 'image/jpeg' && fileExe !== 'image/png') {
        success = false
        this.$message.error('只能上传jpg/png文件')
      }
      if (size > 500) {
        success = false
        this.$message.error('上传头像图片大小不能超过 500kb')
      }
      // 返回 false, 即终止上传
      return success
    },

    // 添加商品
    addShop() {
      this.dialogFormVisible = true
      this.title = `添加品牌商品`
      // 每次重新打开对话框清空数据
      this.form.logoUrl = ''
      this.form.tmName = ''
    },

    // 更新商品
    /* 
      row:选择当前的商品数据
    */
    updataShop(row) {
      this.dialogFormVisible = true
      this.title = `更新品牌商品`

      /* 
        不可以直接：
          this.form = row, 因为在赋值的时候就会修改页面数据
          
          扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之
      */
      this.form = { ...row }
      // console.log(row)
    },

    // 点击确定按钮，提交对话框数据，添加or修改
    submitShopData() {
      this.dialogFormVisible = false
      // 验证表单是否全部通过验证
      this.$refs.ruleForm.validate(async(vaild) => {
        // 验证成功
        if (vaild) {
          let result
          // 判断是否有 id， 如果更新，没有则是添加
          if (this.form.id) {
            // 发起请求，更新商品请求
            result = await this.$api.trademake.reqTrademarkUpdate(this.form)
          } else {
            // 发起请求添加商品
            result = await this.$api.trademake.reqTrademarkSave(this.form)
          }

          if (result.code === 200) {
            this.$message.success(
              this.form.id ? `更新品牌成功` : `添加品牌成功`
            )
            // 重新发起请求
            this.getlist()
          }
        } else {
          this.$message.error('错误提交')
          return false
        }
      })
    },
    // 删除商品信息
    handleDelete(row) {
      this.$confirm(`'你确定要删除${row.tmName}吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await this.$api.trademake.reqTrademarkRemove(row.id)
        if (result.code === 200) {
          this.$message.success('删除成功')
          // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
          if (this.records.length <= 1) {
            this.page -= 1
          }
          // 重新发起请求
          this.getlist()
        }
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    //	currentPage 改变时会触发
    handleCurrentChange(page) {
      // 整理参数发起请求
      this.page = page
      this.getlist()
    },
    // pageSize 改变时会触发
    handleSizeChange(limit) {
      // 整理参数发起请求
      this.limit = limit
      this.getlist()
    },
    // 获取品牌数据列表
    async getlist() {
      console.log('page', this.page)
    
      // 获取请求数据
      const result = await this.$api.trademake.reqbaseTrademarkList(this.page, this.limit)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
