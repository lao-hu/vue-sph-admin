<template>
  <div>
    <div class="header">
      <!-- 表单元素 -->
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="tempSearchObj.roleName"
            placeholder="角色名称"
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
      <el-button
        type="primary"
        style="margin-right: 10px"
        @click="addRole"
      >添加</el-button>
      <el-popconfirm
        title="你确定要批量删除已选择的角色吗？"
        placement="right-start"
        @onConfirm="removeRoles"
      >
        <el-button
          slot="reference"
          type="danger"
          :disabled="selectedIds.length === 0"
        >批量删除</el-button>
      </el-popconfirm>
    </div>

    <div style="margin-bottom: 20px">
      <el-table
        :data="items"
        style="width: 60%"
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
        <el-table-column align="center" label="角色名称">
          <template v-slot="scope">
            <div v-if="scope.row.flag">
              {{ scope.row.roleName }}
            </div>
            <div v-else>
              <el-input
                :ref="scope.$index"
                v-model="scope.row.roleName"
                style="width: 80%"
                @change="toEdit(scope.row)"
                @blur="toEdit(scope.row)"
              />
              <span style="margin-left: 20px">
                <el-button
                  type="warning"
                  icon="el-icon-refresh"
                >取消</el-button>
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="280px">
          <template v-slot="scope">
            <el-button
              type="info"
              icon="el-icon-user-solid"
              title="分配权限"
              @click="$router.push(`/acl/role/auth/${scope.row.id}?roleName=${scope.row.roleName}`)"
            />
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-right: 10px"
              title="更新"
              @click="showUpdateRole(scope.row, scope.$index)"
            />

            <el-popconfirm
              title="你确定要删除当前角色吗？"
              placement="top-start"
              @onConfirm="removeRole(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                title="删除"
              />
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
        :page-sizes="[5, 10, 15]"
        layout=" prev, pager, next, jumper,->,sizes,total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      listLoading: true, // 是否显示列表加载的提示
      loading: false, // 是否正在提交请求中
      page: 1, // 当前页码
      limit: 5, // 每页记录数
      total: 0, // 总条数
      items: [], // 用户数据
      role: {}, // 需要收集的角色信息
      //  收集搜索条件输入的对象
      tempSearchObj: {
        // 收集搜索条件输入的对象
        roleName: ''
      },
      // 包含请求搜索条件数据的对象
      searchObj: {
        roleName: ''
      },
      selectedIds: [] // 所有选择的role的id的数组
    }
  },
  // 组件加载完毕
  mounted() {
    this.getRoleList()
  },
  methods: {
    //	currentPage 改变时会触发
    handleCurrentChange(page) {
      // 整理参数发起请求
      this.page = page
      this.getRoleList()
    },
    // pageSize 改变时会触发
    handleSizeChange(limit) {
      // 整理参数发起请求
      this.limit = limit
      this.getRoleList()
    },
    // 查询
    search() {
      this.searchObj.roleName = this.tempSearchObj.roleName
      // 重新发起请求
      this.page = 1
      this.getRoleList()
    },
    // 清空查询
    resetSearch() {
      this.tempSearchObj.roleName = ''
      this.searchObj.roleName = ''
      // 重新发起请求
      this.getRoleList()
    },
    // 列表选中状态发生改变的监听回调
    // selection 参数，是selection-change事件回调参数
    handleSelectionChange(selection) {
      // map 返回列表 id
      this.selectedIds = selection.map((item) => item.id)
    },
    // 添加角色
    addRole() {
      this.$prompt('请输入新名称', '角色名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async({ value }) => {
        // 发请求添加角色
        const result = await this.$api.role.reqRoleSave({ roleName: value })
        if (result.code === 20000) {
          this.$message.success('添加成功')
          this.getRoleList()
        }
      })
    },
    // 显示更新角色界面
    showUpdateRole(row, index) {
      row.flag = false
      // 点击 span ，切换为input 是需要加载时间，因此不能马上获取input的焦点
      this.$nextTick(() => {
        // 使input 获取焦点
        this.$refs[index].focus()
      })
    },
    // 失去焦点触发该方法
    async toEdit(row) {
      // 判断用户输入数据为空
      if (row.roleName.trim() === '') {
        // 提示错误信息
        this.$message.error('属性值不能为空')
        return false
      }

      // 新增的属性不能与已有的属性重复
      // 抛出最新的对象，去和之前存储的数据去比较
      const isRepeat = this.items.some((element) => {
        // 抛出最新的对象，去和之前存储的数据去比较
        if (row !== element) {
          return row.roleName === element.roleName
        }
      })

      // 如果为true 表示出现重复
      if (isRepeat) {
        this.$message.error('角色名称出现重复')
        return false
      }

      row.flag = true

      //  过滤掉后台不需要的 falg 属性
      const info = {}
      for (const key in row) {
        // 过滤掉后台不需要的 falg 属性
        if (key !== 'flag') {
          info[key] = row[key]
        }
      }
      // 发请求更新角色
      const result = await this.$api.role.reqRoleUpdate(info)
      if (result.code === 20000) {
        this.$message.success('修改成功')
        this.getRoleList()
      }
    },
    // 删除某个角色
    async removeRole(row) {
      const result = await this.$api.role.reqRemoveRoleOne(row.id)
      if (result.code === 20000) {
        this.$message.success('删除成功')
        // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
        if (this.items.length <= 1) {
          this.page -= 1
        }
        this.getRoleList()
      }
    },
    // 批量 删除角色
    async removeRoles() {
      const result = await this.$api.role.reqRemoveRoleAll(this.selectedIds)
      if (result.code === 20000) {
        this.$message.success('删除成功')
        // 如果表格当前的数据只有1条了，那么在删除后，将显示上一页的数据
        if (this.items.length <= 1) {
          this.page -= 1
        }
        this.getRoleList()
      }
    },
    // 角色管理列表
    async getRoleList() {
      const result = await this.$api.role.reqRoleList(
        this.page,
        this.limit,
        this.searchObj
      )
      if (result.code === 20000) {
        // 关闭loading 效果
        this.listLoading = false
        this.total = result.data.total
        const info = result.data.items

        info.forEach((item) => {
          if (!item.flag) {
            this.$set(item, 'flag', true)
          }
        })
        this.items = info
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
