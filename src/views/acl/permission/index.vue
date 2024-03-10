<template>
  <div>

     <!-- 
      code: "Acl" // 标识名称
      deleted: false
      gmtCreate: "2020-11-30 16:40:08"
      gmtModified: "2020-11-30 16:40:08"
      id: "1333329957008228353"
      level: 2
      name: "权限管理"
      pid: "1" // 所属节点的id
      select: false
      status: null
      toCode: ""
      type: 1  // 1: 路由 2: 按钮
-->
<!--
      children: []
      code: "btn.Role.assgin"
      deleted: false
      gmtCreate: "2020-11-30 16:50:13"
      gmtModified: "2020-12-01 08:13:47"
      id: "1333332492158812161"
      level: 4
      name: "分配权限"
      pid: "1333330152781561858"
      select: false
      status: null
      toCode: "RoleAuth"
      type: 2
    -->
    <el-table 
      v-loading="listLoading" 
      :data="items"
      style="width: 100%;margin-top:10px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >

      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="toCode" label="跳转权限值" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-plus"
            title="添加"
            :disabled="scope.row.level === 4"
            @click="addPermission(scope.row)"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            style="margin-right: 10px"
            title="更新"
            @click="updatePermission(scope.row, scope.$index)"
          />

          <el-popconfirm
            title="你确定要删除当前角色吗？"
            placement="top-start"
            @onConfirm="removePre(scope.row)"
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogPermissionVisible"  @close="resetData">
      <el-form 
      ref="ruleForm"
      :model="permission" label-width="120px"
       :rules="Rules"
      >
        <el-form-item label="父级名称" v-if="permission.level > 2 && !permission.id">
              <el-input :value="permission.pname"  disabled ></el-input>
        </el-form-item>
          <el-form-item label="名称" prop="name">
              <el-input v-model="permission.name" placeholder="" ></el-input>
        </el-form-item>
          <el-form-item label="功能权限值" prop="code">
              <el-input v-model="permission.code"  placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="跳转路由权限值"  v-if="permission.level > 2">
              <el-input v-model="permission.toCode"  placeholder="" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" >
          <el-button @click="resetData">取 消</el-button>
          <el-button :loading="loading" type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Permisson',
  data() {
    return {
      dialogPermissionVisible:false , // 控制添加权限菜单的显示与隐藏 
      listLoading: true, // 是否显示列表加载的提示
      loading: false, // 是否正在提交请求中
      page: 1, // 当前页码
      limit: 5, // 每页记录数
      total: 0, // 总条数
      items: [], // 用户数据
       permission: { // 要操作的菜单权限对象
        level: 0,
        name: '',
        code: '',
        toCode: ''
      }, 
      Rules:{
        name:[
          {required:true,message:"名称必须填",trigger: 'blur'}
        ],
        code:[
           {required:true,message:"名称必须填",trigger: 'blur'}
        ]
      }
    }
  },
  // 组件加载完毕
  mounted() {
    this.getPermissionList()
  },
  computed:{
    dialogTitle(){
      // 根据id来区分添加与修改
      if(this.permission.id){
        return this.permission.level == 4 ? "修改功能" : ` 修改${this.permission.level == 2 ? '一' :'二' }级菜单`
      }else{
        return this.permission.level == 4 ? "添加功能" : ` 添加${this.permission.level == 2 ? '一' :'二' }级菜单`
      }
     
    }
  },
  methods: {
    // 添加菜单,
    async addPermission(row) {
      this.dialogPermissionVisible = true
      this.permission.pid = row.id
      this.permission.level = row.level + 1
      this.permission.type = this.permission.level===4 ? 2 : 1
      this.permission.pname = row.name // 用于显示父名称, 但提交请求时是不需要的
      // const result = this.$api.permission.reqPermissionSave()
    },
    // 修改当前菜单信息
    updatePermission(row){
      this.dialogPermissionVisible = true
      this.permission.id = row.id
      this.permission.level = row.level
      this.permission.toCode = row.toCodec
      this.permission.code = row.code
      this.permission.type = row.type
      this.permission.name = row.name 
    },
    // 删除当前
  async removePre(row){
      let result = await this.$api.permission.reqPreRemove(row.id)
      if(result.code === 20000){
        this.$message.success("删除成功")
          this.getPermissionList()
      }
    },

    // 获取菜单分页列表
    async getPermissionList() {
      const result = await this.$api.permission.reqPermissionList()
      if (result.code === 20000) {
        // 关闭loading 效果
        this.listLoading = false
        this.items = result.data.children
      }
    },
    // 保存信息
  save(){
       this.$refs.ruleForm.validate(async(valid) => {
         this.loading = true
            const {pname, ...perm} = this.permission // pname不需要携带
        // 验证成功
        let result
        let msg
        if (valid) {
             if(this.permission.id){
               result = await this.$api.permission.reqPermissionUpdate(perm)
               msg = "修改"
             }else{
                result = await this.$api.permission.reqPermissionSave(perm)
                msg = "添加"
             }

             if(result.code === 20000){
                this.loading = false
                this.dialogPermissionVisible = false
                this.$message.success(`${msg}成功`)
                this.getPermissionList()
             }
        }else{
            this.$message.error("表单验证失败")
        }

       })
      
    },

    // 关闭
    resetData(){
      this.dialogPermissionVisible = false
      this.permission = {
        level: 0,
        name: '',
        code: '',
        toCode: ''
      }
    }
  }
}
</script>

<style>
</style>
