<template>
  <div>
    <div class="header">
      <!-- 表单元素 -->
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="tempSearchObj.username"
            placeholder="用户名"
          />
        </el-form-item>
        <!-- 查询与情况的按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
          >查询</el-button>
          <el-button @click="resetSearch">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加与批量添加按钮 -->
    <div style="margin-bottom: 20px">
      <!-- 添加按钮 
       判断是否按钮权限
        v-show="buttons.indexOf('btn.User.add') != -1"
      -->
      <el-button
        type="primary"
        style="margin-right: 10px"
        @click="showAddUser"
        v-show="buttons.indexOf('btn.User.add') != -1"
      >添加</el-button>

      <el-popconfirm
        title="你确定要批量删除已选择的用户吗？"
        placement="right-start"
        @onConfirm="removeUsers"
       v-show="buttons.indexOf('btn.User.remove') != -1"
      >
        <el-button slot="reference" type="danger" :disabled="selectedIds.length === 0">批量删除</el-button>
      </el-popconfirm>
    </div>
    <!-- table表格：展示用户信息的地方 -->
    <div class="table">
      <el-table
        v-loading="listLoading"
        :data="items"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80px"
        />
        <el-table-column
          align="center"
          prop="username"
          label="用户名"
        />
        <el-table-column
          align="center"
          prop="nickName"
          label="用户昵称"
        />
        <el-table-column
          align="center"
          prop="roleName"
          label="权限列表"
        />
        <el-table-column
          align="center"
          prop="gmtCreate"
          label="创建时间"
        />
        <el-table-column
          align="center"
          prop="gmtModified"
          label="更新时间"
        />
        <!-- 
          操作
         -->
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button type="info" icon="el-icon-info" title="分配角色" @click="showAssignRole(scope.row)" />

            <!-- 更新用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-right: 10px"
              title="更新"
              @click="showUpdateUser(scope.row)"
                 v-show="buttons.indexOf('btn.User.update') != -1"
            />
          
            <!-- 
            删除用户
           -->
            <el-popconfirm
              title="你确定要删除当前用户吗？"
              placement="top-start"
              @onConfirm="removeUser(scope.row)"
                 v-show="buttons.indexOf('btn.User.remove') != -1"
            >
              <el-button slot="reference" type="danger" icon="el-icon-delete" title="删除" />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="page">
      <el-pagination
        background
        :total="total"
        :current-page="page"
        :page-size="limit"
        :page-sizes="[3, 5, 10]"
        layout=" prev, pager, next, jumper,->,sizes,total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 
          添加用户 与 修改用户对话框
    -->
    <el-dialog
      :title="user.id ? `修改用户` : `添加用户`"
      :visible.sync="dialogUserVisible"
    >
      <!-- 
                model: 表单数据对象 
        只需要通过 rules 属性传入约定的验证规则，
        并将 Form-Item 的 prop 属性设置为需校验的字段名即可
         -->
      <el-form
        ref="ruleForm"
        :model="user"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="user.nickName" autocomplete="off" />
        </el-form-item>
        <!-- 更新用户不需要密码框 -->
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cencel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="addOrUpdate">确 定 </el-button>
      </div>
    </el-dialog>
   
    <!-- 设置角色 -->
    <!-- 

    :before-close="resetRoleData"
    -->
    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="user.username" disabled />
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- 全选 -->
          <!-- 
              indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
              -->
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <!-- 
               多选框按钮组
              -->
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="res in allRoles" :key="res.id" :label="res.id">{{ res.roleName }}</el-checkbox>  
          </el-checkbox-group>

        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole">保 存</el-button>
        <el-button @click="resetRoleData">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    // 自定义验证密码的规则
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      listLoading: true, // 是否显示列表加载的提示
      loading: false, // 是否正在提交请求中
      dialogUserVisible: false, // 是否显示用户添加/修改的dialog
      dialogRoleVisible: false, // 是否显示角色Dialog
      page: 1, // 当前页码
      limit: 3, // 每页记录数
      total: 0, // 总条数
      items: [], // 用户数据
      user: {}, // 当前要操作的user
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      userRules: {
        // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 4, message: '用户名不能小于四个字符', trigger: 'change' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      //  收集搜索条件输入的对象
      tempSearchObj: {
        // 收集搜索条件输入的对象
        username: ''
      },
      // 包含请求搜索条件数据的对象
      searchObj: {
        username: ''
      },
      selectedIds: [], // 所有选择的user的id的数组,
      isIndeterminate: true, // 用于不确定的样式
      checkAll: false // 是否全选
      
    }
  },
  // 组件加载完毕
  mounted() {
    this.getUserList()
  },
  computed:{
    //  获取vuex里面保存按钮权限
    buttons(){
      return this.$store.state.user.buttons
    }
  },
  methods: {

    //	currentPage 改变时会触发
    handleCurrentChange(page) {
      // 整理参数发起请求
      this.page = page
      this.getUserList()
    },
    // pageSize 改变时会触发
    handleSizeChange(limit) {
      // 整理参数发起请求
      this.limit = limit
      this.getUserList()
    },
    // 查询
    search() {
      this.searchObj = { ...this.tempSearchObj }
      // 重新发起请求
      this.getUserList()
    },
    // 清空查询
    resetSearch() {
      this.tempSearchObj.username = ''
      this.searchObj.username = ''
      // 重新发起请求
      this.getUserList()
    },
    // 添加用户
    showAddUser() {
      this.user = {}
      // 控制dialog的显示
      this.dialogUserVisible = true
    },
    // 显示更新用户的界面
    showUpdateUser(row) {
      // 控制dialog的显示
      this.dialogUserVisible = true
      this.user = { ...row }
    },
    // 批量删除
    async removeUsers() {
      const result = await this.$api.user.reqRemoveUserAll(this.selectedIds)
      if (result.code === 20000) {
        this.$message.success('删除成功')
        // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
        if (this.items.length <= 1) {
          this.page -= 1
        }
        this.getUserList()
      }
    },
    // 分配角色
    showAssignRole(row) {
      this.dialogRoleVisible = true
      this.user = { ...row }
      this.getRoles()
    },
    // 获取某个用户的所有角色
    async getRoles() {
      const result = await this.$api.user.reqToAssignRole(this.user.id)
     
      if (result.code === 20000) {
        // 全部角色列表
        this.allRoles = result.data.allRolesList
        // 该用户的角色列表
        const info = result.data.assignRoles 
        // map 返回该用户的角色id数组
        this.userRoleIds = info.map((element) => element.id)
      }
    },
    // 全选按钮的监听
    handleCheckAllChange(val) {
      this.userRoleIds = val ? this.allRoles.map(item => item.id) : []
      this.isIndeterminate = false
    },
    // 角色列表选中项发生改变的监听
    handleCheckedChange(val) {
      this.userRoleIds = val

      // indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果

      this.checkAll = this.userRoleIds.length > 0 && this.userRoleIds.length === this.allRoles.length
     
      this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
    },

    // 保存分配的角色

    /* 
      {
        "roleIdList": [
          "string"
        ],
        "userId": "string"
      }
    */
    async assignRole() {
      this.loading = true
      const result = await this.$api.user.reqdoAssignRole({
        roleIdList: this.userRoleIds,
        userId: this.user.id
      }) 
      if (result.code === 20000) {
        this.dialogRoleVisible = false
        this.$message.success('分配角色成功')
        this.loading = false
        this.getUserList()
      }
    },

    // 重置用户数据
    resetRoleData() {
      this.dialogRoleVisible = false
      this.allRoles = []
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
    },    

    // 删除某个用户
    async removeUser(row) {
      const result = await this.$api.user.reqRemoveUserOne(row.id)
      if (result.code === 20000) {
        this.$message.success('删除成功')
        // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
        if (this.items.length <= 1) {
          this.page -= 1
        }
        this.getUserList()
      }
    },

    // 取消更新与保存
    cencel() {
      this.dialogUserVisible = false
      this.user = {}
    },
    /* 
    保存或者更新用户
    */
    addOrUpdate() {
      // 验证表单是否全部通过验证
      this.$refs.ruleForm.validate(async(valid) => {
        this.loading = true
        // 验证成功
        let result
        if (valid) {
          if (this.user.id) {
            result = await this.$api.user.reqUpdateUser(this.user)
          } else {
            // 添加用户
            result = await this.$api.user.reqSaveUser(this.user)
          }
          if (result.code === 20000) {
            this.loading = false
            this.user = {}
            this.dialogUserVisible = false
            this.$message.success('成功')
            this.getUserList()
          }
        } else {
          this.$message.error('表单验证失败')
          return false
        }
      })
    },
    // 列表选中状态发生改变的监听回调
    // selection 参数，是selection-change事件回调参数
    handleSelectionChange(selection) {
      // map 返回列表 id
      this.selectedIds = selection.map((item) => item.id)
    },
    // 获取管理员用户列表
    async getUserList() {
      const result = await this.$api.user.reqUserList(
        this.page,
        this.limit,
        this.searchObj
      )
      if (result.code === 20000) {
        // 关闭loading 效果
        this.listLoading = false
        this.total = result.data.total
        const info = result.data.items
        // 过滤掉 用户名等于 admin 的数据
        this.items = info.filter(value => value.username != 'admin')
      }
    }
  }
}
</script>

<style scoped>
.page {
  margin-top: 10px
}
</style>
