<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="¥ 126560">
            <template v-slot:charts>
              <div class="sales">
                <span>周同比 <span style="padding-left:8px">56.67%</span> <i class="el-icon-caret-bottom" style="color:#d71f1f" /></span>
                <span>日同比 <span style="padding-left:8px">19.16%</span>  <i class="el-icon-caret-top" style="color:#21cb35" /></span>
              </div>
            </template>
            <template v-slot:footer>
              <span>日销售额¥ 126560</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template v-slot:charts>
              <LineChart />
            </template>
            <template v-slot:footer>
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template v-slot:charts>
              <BarChart />
            </template>
            <template v-slot:footer>
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template v-slot:charts>
              <ProgressChart/>
            </template>
            <template v-slot:footer>
              <div class="sales" style=" width: 70%;">
                <span>周同比 <span style="padding-left:5px">12%</span> <i class="el-icon-caret-bottom" style="color:#d71f1f" /></span>
                <span>日同比 <span style="padding-left:5px">11%</span>  <i class="el-icon-caret-top" style="color:#21cb35" /></span>
              </div>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './LineChart'
import BarChart from './BarChart'
import ProgressChart from './ProgressChart';
export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  }
}
</script>

<style>
.sales{
    width: 80%;
    display: flex;
    justify-content: space-between;
}
.sales i{padding-left: 5px;}
</style>
