<template>
  <div>
    <div class="header">
      <!-- 表单元素 -->
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="tempSearchObj.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <!-- 查询与情况的按钮 -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
          <el-button @click="resetSearch">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加与批量添加按钮 -->
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="showAddUser" style="margin-right: 10px"
        >添加</el-button
      >
      <el-popconfirm
        title="你确定要批量删除已选择的用户吗？"
        placement="right-start"
        @onConfirm="removeUsers"
      >
        <el-button type="danger" slot="reference">批量删除</el-button>
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
        ></el-table-column>
        <el-table-column
          align="center"
          prop="nickName"
          label="用户昵称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="roleName"
          label="权限列表"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="gmtCreate"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="gmtModified"
          label="更新时间"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button type="info" icon="el-icon-user-solid"></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showUpdateUser(scope.row)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
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
      >
      </el-pagination>
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
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 更新用户不需要密码框 -->
        <el-form-item label="用户密码" prop="password" v-if="!user.id">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cencel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    // 自定义验证密码的规则
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
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
      userRules: {
        // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 4, message: "用户名不能小于四个字符", trigger: "change" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      //  收集搜索条件输入的对象
      tempSearchObj: {
        // 收集搜索条件输入的对象
        username: "",
      },
      // 包含请求搜索条件数据的对象
      searchObj: {
        username: "",
      },
      selectedIds: [], // 所有选择的user的id的数组
    };
  },
  methods: {
    //	currentPage 改变时会触发
    handleCurrentChange(page) {
      // 整理参数发起请求
      this.page = page;
      this.getUserList();
    },
    // pageSize 改变时会触发
    handleSizeChange(limit) {
      // 整理参数发起请求
      this.limit = limit;
      this.getUserList();
    },
    // 查询
    search() {
      this.searchObj.username = this.tempSearchObj.username;
      // 重新发起请求
      this.getUserList();
    },
    // 清空查询
    resetSearch() {
      this.tempSearchObj.username = "";
      this.searchObj.username = "";
      // 重新发起请求
      this.getUserList();
    },
    // 添加用户
    showAddUser() {
      this.user = {};
      // 控制dialog的显示
      this.dialogUserVisible = true;
    },
    // 显示更新用户的界面
    showUpdateUser(row) {
      // 控制dialog的显示
      this.dialogUserVisible = true;
      this.user = { ...row };
    },
    // 批量删除
    async removeUsers() {
      let result = await this.$api.user.reqRemoveUsers(this.selectedIds);
      if (result.code === 20000) {
        this.$message.success("删除成功");
        this.getUserList();
      }
    },
    // 取消更新与保存
    cencel() {
      this.dialogUserVisible = false;
      this.user = {};
    },
    /* 
    保存或者更新用户
    */
    addOrUpdate() {
      // 验证表单是否全部通过验证
      this.$refs.ruleForm.validate(async (valid) => {
        // 验证成功
        let result;
        if (valid) {
          if(this.user.id) {
                result = await this.$api.user.reqUpdateUser(this.user);
          } else {
                result = await this.$api.user.reqSaveUser(this.user);
          }
             if(result.code === 200) {
                this.$message.success(
                this.user.id ? `更新品牌成功` : `添加品牌成功`
            );
          }
        } else {
          this.$message.error("表单验证失败");
          return false;
        }
      });
    },
    // 列表选中状态发生改变的监听回调
    // selection 参数，是selection-change事件回调参数
    handleSelectionChange(selection) {
      // map 返回列表 id
      this.selectedIds = selection.map((item) => item.id);
    },
    // 获取管理员用户列表
    async getUserList() {
      const result = await this.$api.user.reqUserList(
        this.page,
        this.limit,
        this.searchObj
      );
      if (result.code === 20000) {
        // 关闭loading 效果
        this.listLoading = false;
        this.total = result.data.total;
        this.items = result.data.items;
      }
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style scoped>
.page {
  margin-top: 10px;
}
</style>