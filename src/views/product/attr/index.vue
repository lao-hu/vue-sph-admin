<template>
  <div>
    <!-- 三级分类 -->
    <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />

    <el-card>
      <!-- 
        v-show="isShowTable" 控制表格的显示与隐藏
       -->
      <div v-show="isShowTable">
        <div style="margin: 10px 0">
          <el-button
            icon="el-icon-plus"
            type="primary"
            :disabled="category3 === ''"
            @click="addAttr"
          >添加属性</el-button>
        </div>
        <!--

        -->
        <el-table :data="attrDataList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="100px" />
          <el-table-column label="属性名称" prop="attrName" width="200px" />
          <el-table-column label="属性值列表">
            <template slot-scope="scope">
              <el-tag
                v-for="list in scope.row.attrValueList"
                :key="list.id"
                style="margin: 0 10px"
                type="success"
              >
                {{ list.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdata(scope.row)"
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
      </div>

      <!-- 添加属性值 表单 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo" class="demo-form-inline">
          <el-form-item label="属性值">
            <el-input v-model="attrInfo.attrName" placeholder="属性名称" />
          </el-form-item>
          <div>
            <el-form-item>
              <!-- 添加属性名称的按钮 -->
              <el-button
                type="primary"
                :disabled="attrInfo.attrName === ''"
                @click="addAttrValue"
              >添加属性名称</el-button>

              <el-button @click="isShowTable = true">取消</el-button>
            </el-form-item>
          </div>
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
          <el-table :data="attrInfo.attrValueList" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="150px" />
            <!-- 属性值名称 -->
            <el-table-column label="属性值名称" align="center">
              <template slot-scope="scope">
                <!-- 
                   这里需要，控制span与input的来回显示
                 -->

                <el-input
                  v-show="!scope.row.flag"
                  :ref="scope.$index"
                  v-model="scope.row.valueName"
                  placeholder="请输入属性值名称"
                  size="mini"
                  @blur="toSee(scope.row)"
                  @keyup.native.enter="toSee(scope.row)"
                />
                <span
                  v-show="scope.row.flag"
                  style="display: block"
                  @click="toEdit(scope.row,scope.$index)"
                >{{ scope.row.valueName }}</span>
                
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 
                  当前element 版本 为 2.13.2
                  el-popconfirm : 确定气泡框
                  attrValueDelete(scope.$index)
                  
                  @onConfirm 确定按钮事件的回调
                 -->
                <el-popconfirm 
                  placement="top-start" 
                  :title="`你确定删除”${scope.row.valueName}“吗？`"
                  @onConfirm="attrValueDelete(scope.$index)"
                >
                  <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete-solid">
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px">
            <el-button 
              type="primary" 
              :disabled="attrInfo.attrValueList.length === 0"
              @click="addOrUpdateAttr"
            >保存</el-button>
            <el-button @click="isShowTable = true">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 这个方法类似_.clone，除了它会递归拷贝 value。（注：也叫深拷贝）。
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      // 控制表格的显示与隐藏
      isShowTable: true,
      // 表单对象
      attrInfo: {
        attrName: '', // 属性名：如：颜色
        attrValueList: [
          // 属性值如：红色，黑色，白色
        ],
        categoryId: 0, // 分类id, 三级分类id
        categoryLevel: 3 // 几级id，3级
      },
      // 一级分类id
      category1: '',
      // 二级分类id
      category2: '',
      // 三级分类id
      category3: '',

      // 属性表格数据
      attrDataList: [],
      // 控制气泡框的显示与隐藏
      visible: false
    }
  },
  methods: {
    // 获取id分类自定义事件回调
    getCategoryId(categoryId, level) {
      if (level === '1') {
        this.category1 = categoryId
        this.category2 = ''
        this.category3 = ''
        this.attrDataList = []
      } else if (level === '2') {
        this.category2 = categoryId
        this.category3 = ''
        this.attrDataList = []
      } else {
        this.category3 = categoryId
        // 
        this.getAttrList()
      }
    },
    // row 表示当前行的数据
    handleUpdata(row) {
      this.isShowTable = false
      // 深拷贝 注意：这里也可以使用： JSON.parse(JSON.stringify(row))
      // 现在使用的 lodash的cloneDeep方法
      this.attrInfo = cloneDeep(row)
      // console.log(this.attrInfo)
      // flag 属性用于切换编辑模式与查看模式
      this.attrInfo.attrValueList.forEach(element => {
        // 给数组添加一个 响应式 flag 属性
        if (!element.flag) {
          // 使用$set方法添加一个响应式属性
          this.$set(element, 'flag', true)
        }
      })
    },

    // 属性删除
    async handleDelete(row) {
      // console.log('deleterow:', row)
      // 发请求删除属性
      await this.$api.attr.reqDeleteAttr(row.id)
      this.$message.success('删除成功')
      // 成功发起请求重新获取数据
      this.getAttrList()
    },
    // 属性值删除操作
    // index 传递过来的索引值
    attrValueDelete(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 点击显示添加属性的操作
    addAttr() {
      this.isShowTable = false
      // 每次 点击按钮需要重新给表单数据赋值一个新对象，以清除上次残留的数据
      this.attrInfo = {
        attrName: '', // 属性名：如：颜色
        attrValueList: [
          // 属性值如：红色，黑色，白色
        ],
        categoryId: this.category3 || 0, // 分类id, 三级分类id
        categoryLevel: 3 || 3 // 几级id，3级
      }
    },
    // 添加属性名称
    addAttrValue() {
      /*  {
            attrId: 0, // 属性名的id, 知道是属于哪个属性的
            valueName: '' // 属性值名称如： 黑色
          } 
      */
     
      // 像 attrInfo.attrValueList 数组里面 添加一个属性值对象，
      // 比如： 属性是颜色的话， 那属性值是，白色，黑色。。。等具体的颜色
      this.attrInfo.attrValueList.push({
        //
        /* 
           注意：
            新增：对于新增，attrInfo是没有id属性，就为 undefined，
            修改：对于修改, attrInfo是有id属性, 就为id的值
         */
        attrId: this.attrInfo.id,
        // 属性值名称 v-model
        valueName: '',
        // 控制 span 与 input的切换
        flag: false
      })

      // 实现新添加属性值，input输入框 自动聚焦
      // 
      this.$nextTick(() => {
        // 新添加的对象在数组的末尾， 获取新添加的对象索引值，就是数组长度减一
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    /* 
      失去焦点事件， 有input 切换为span
      row ：是attrInfo.attrValueList数组里面的当前一行对象  
    */
    toSee(row) {
      // 判断用户输入数据为空
      if (row.valueName.trim() === '') {
        // 提示错误信息
        this.$message.error('属性值不能为空')
        return false
      }
      // 新增的属性不能与已有的属性重复
      const isRepeat = this.attrInfo.attrValueList.some((element) => {
        // 抛出最新的对象，去和之前存储的数据去比较
        if (row !== element) {
          return row.valueName === element.valueName
        }
      })
      // 如果为true 表示出现重复
      if (isRepeat) {
        this.$message.error('属性值出现重复')
        return false
      }

      row.flag = true
    },
    // 切换编辑模式
    toEdit(row, index) {
      row.flag = false
      // 点击 span ，切换为input 是需要加载时间，因此不能马上获取input的焦点
      this.$nextTick(() => {
        // 使input 获取焦点
        this.$refs[index].focus()
      })
    },
    
    // 获取平台属性数据
    async getAttrList() {
      //  当三级分类的下拉框选择的那一刻
      const result = await this.$api.attr.reqAttrInfoList(this.category1, this.category2, this.category3)
      // 请求成功
      if (result.code === 200) { 
        this.attrDataList = result.data
      } 
    },
    // 整理添加或更新属性数据
    async addOrUpdateAttr() {
      // 过滤掉后台不需要的属性, 属性值为空不应该提交给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        // 判断属性值是否不为空
        if (item.valueNam !== '') {
          // 后台不需要 flag 属性，这里进行删除
          delete item.flag  
          return true
        }
      })

      try {
        // 发起请求添加或修改女性
        await this.$api.attr.reqSaveAttrInfo(this.attrInfo)
        this.isShowTable = true
        this.$message.success('保存成功')
        // 成功发起请求重新获取数据
        this.getAttrList()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>
