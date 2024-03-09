<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <span>
        <el-dropdown placement="bottom">
          <span class="el-dropdown-link">
            <i class="el-icon-more" />
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <div>
      <el-row :gutter="16">
        <el-col :span="12">
          <LineCharts />
        </el-col>
        <el-col :span="12">
          <LineCharts />
        </el-col>
      </el-row>
      <!-- 
         数据表格

          :default-sort="{ prop: 'date', order: 'descending' }"
       -->
      <div class="tableInfo">
        <el-table :data="tableInfo" style="width: 100%" border>
          <el-table-column type="index" align="center" prop="prop" label="排名" width="80" />
          <el-table-column label="搜索关键词" align="center" width="180" />
          <el-table-column label="用户数" align="center" sortable width="180" />
          <el-table-column label="周涨幅" align="center" sortable />
        </el-table>
      </div>
      <!-- 分页器  -->
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="1000"
        />
      </div>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './LineCharts'
export default {
  name: 'Search',
  components: {
    LineCharts
  },
  data() {
    return {
      tableInfo: [{}]
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.tableInfo{
    margin-top: 20px;
}
.pagination{
    margin-top: 10px;
    text-align: right;
}
</style>
