<template>
  <el-card style="margin: 10px 0">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <!-- 
        一级分类
     -->
      <el-form-item label="一级分类">
        <el-select
          v-model="form.category1"
          placeholder="请选择"
          :disabled="show"
          @change="handlerCategory1('1')"
        >
          <el-option
            v-for="list in category1List"
            :key="list.id"
            :label="list.name"
            :value="list.id"
          />
        </el-select>
      </el-form-item>

      <!-- 
        二级分类
     -->
      <el-form-item label="二级分类">
        <el-select
          v-model="form.category2"
          placeholder="请选择"
          :disabled="show"
          @change="handlerCategory1('2')"
        >
          <!-- 如果没有选择一级分类则显示没有数据 -->
    
          <el-option
            v-for="list in category2List"
            :key="list.id"
            :label="list.name"
            :value="list.id"
          />
        </el-select>
      </el-form-item>

      <!-- 
        三级分类
     -->
      <el-form-item label="三级分类">
        <el-select
          v-model="form.category3"
          placeholder="请选择"
          :disabled="show"
          @change="handlerCategory1('3')"
        >
          <!-- 如果没有选择一级分类则显示没有数据 -->
    
          <el-option
            v-for="list in category3List"
            :key="list.id"
            :label="list.name"
            :value="list.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    show: Boolean
  },
  data() {
    return {
      form: {
        // 获取一级分类的id
        category1: '',
        // 获取二级分类的id
        category2: '',
        // 获取三级分类的id
        category3: ''
      },
      // 一级分类的数据
      category1List: [],
      // 二级分类的数据
      category2List: [],
      // 三级分类的数据
      category3List: []
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      const result = await this.$api.attr.reqgetCategory1()
      // 请求成功
      if (result.code === 200) {
        this.category1List = result.data
      }
    },

    // 选择 下拉框 触发该事件
    async handlerCategory1(level) {
      let result 
      // 通过 level 判断选择的几级分类
      switch (level) {
        // 当一级分类的select发生变化时，发起请求获取二级分类的数据 
        case '1':
          //  每次 选择一级分类：
          // 清除 二 ，三分类的id
          this.form.category2 = this.form.category3 = ''   
          // 清除上次二级分类 和 三级分类的数据
          this.category2List = this.category3List = []
          // 触发 getCategoryId 自定义事件
          this.$emit('getCategoryId', this.form.category1, level) 
          // 根据一级分类的id，获取二级分类的数据
          result = await this.$api.attr.reqgetCategory2(this.form.category1)
          // 请求成功
          if (result.code === 200) {
            this.category2List = result.data
          }

          break

        case '2':
          // 每次 二级分类 下拉框发生变化时， 清除上次 三级分类的数据
          this.category3List = []
          this.form.category3 = ''
          // 触发 getCategoryId 自定义事件
          this.$emit('getCategoryId', this.form.category2, level) 
          // 当二级分类的select发生变化时，发起请求获取三级分类的数据
          // 根据二级分类的id，获取三级分类的数据
          result = await this.$api.attr.reqgetCategory3(this.form.category2)
          // 请求成功
          if (result.code === 200) {
            this.category3List = result.data
          }

          break

        case '3':
          // 触发 getCategoryId 自定义事件
          this.$emit('getCategoryId', this.form.category3, level) 
       
          break
      }
    }

  }
}
</script>

<style>
</style>
