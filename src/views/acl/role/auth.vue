<template>
  <div>
    <!-- input框 -->
    <el-input disabled :value="$route.query.roleName" placeholder="" />
    <div class="auth">
 
      <!-- 
        权限树形结构：
            node-key：              每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
            default-expand-all：	是否默认展开所有节点
       -->
      <el-tree
        ref="tree"
        :data="PermissionAll"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :default-checked-keys="selectAuth"
      />
    </div>
    <el-button type="primary" :loading="loading" @click="save">保 存</el-button>
    <el-button @click="$router.replace({ name: 'role' })">取 消</el-button>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data() {
    return {
      loading: false, // 是否正在提交请求中
      PermissionAll: [], // 获取全部菜单权限
      defaultProps: {
        children: 'children', // 指定子树为节点对象的某个属性值
        label: 'name' // 指定节点标签为节点对象的某个属性值
      },
      selectAuth:[] // 获取已选择的权限
    }
  },
  mounted() {
    this.getPermissions()
  },
  methods: {
    // 获取指定角色的权限列表
    async getPermissions() {
      const result = await this.$api.permission.reqPreToAssign(
        this.$route.params.id
      )
      if (result.code === 20000) {
        this.PermissionAll = result.data.children

        this.getSelectAuth(this.PermissionAll,this.selectAuth)
    
      }
  

    },
    // 递归获取已分配的权限ID
    getSelectAuth(auth,num){
       auth.map((item) => {
         // 判断当前是否有子节点，且子节点长度不为0
          if(item.children.length != 0){
             // select 表示当前节点已被选择
             if(item.select){
                num.push(item.id)
             }
             // 递归遍历当前子节点
             this.getSelectAuth(item.children,num)
          }else{
            // 当前没有子节点了
             if(item.select){
                num.push(item.id)
             }
          }
       })
    },
    //保存信息数据

    /* 
    {
    "permissionIdList": ["string"],
    "roleId": "string"
    }
    */
   async save(){
     this.loading = true
      // 获取当前选中的权限 .concat(this.$refs.tree.getHalfCheckedKeys())
        // 返回目前半选中的节点的 key 所组成的数组
       
     var ids = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())

      var id =  this.$route.params.id

      let result = await this.$api.permission.reqPreDoAssignAcl({
         permissionIdList:ids,
         roleId:id
      })

      if (result.code === 20000) {
        this.loading = false
        this.$message.success("分配权限成功")
         // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
        const roleName = this.$route.query.roleName
        //   const roles = this.$store.getters.roles
          this.$router.replace('/acl/role')
      }

     }
  }
}
</script>

<style scoped>
.auth {
  margin: 20px 0;
}
</style>
