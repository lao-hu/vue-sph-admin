<template>
  <div style="margin: 10px 0">
    <el-card>
      <div slot="header" class="clearfix">
        <!-- 
                 @tab-click="handleClick"
             -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
          <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
        </el-tabs>

        <div class="right">
          <span @click="setDate('今日')">今日</span>
          <span @click="setDate('本周')">本周</span>
          <span @click="setDate('本月')">本月</span>
          <span @click="setDate('本年')">本年</span>
          <!-- 
             
         -->
          <el-date-picker
            class="date"
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6" class="sorts">
            <h3>门店{{ activeName }}排名</h3>
            <ul>
              <li>
                <span class="index" style="padding: 0 5px"> 1</span>
                <span style="margin-left: 26px">肯德基</span>
                <span class="value">94538</span>
              </li>
              <li>
                <span class="index" style="padding: 0 5px"> 2</span>
                <span style="margin-left: 26px">麦当劳</span>
                <span class="value">90256</span>
              </li>
              <li>
                <span class="index" style="padding: 0 5px"> 3</span>
                <span style="margin-left: 26px">沙县小吃</span>
                <span class="value">87563</span>
              </li>
              <li>
                <span style="padding: 0 5px"> 4</span>
                <span style="margin-left: 26px">必胜客</span>
                <span class="value">84231</span>
              </li>
              <li>
                <span style="padding: 0 5px"> 5</span>
                <span style="margin-left: 26px">战斧牛排</span>
                <span class="value">64521</span>
              </li>
              <li>
                <span style="padding: 0 5px">6</span>
                <span style="margin-left: 26px">德州烤肉</span>
                <span class="value">56823</span>
              </li>
              <li>
                <span style="padding: 0 5px"> 7</span>
                <span style="margin-left: 26px">麻辣火锅</span>
                <span class="value">32651</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入 echarts 图表库
import * as echarts from "echarts";
// 引入dayjs 时间库
import dayjs from "dayjs";
// 引入辅助函数
import { mapState } from "vuex";

export default {
  name: "Sale",
  data() {
    return {
      // 标签切换
      activeName: "销售额",
      // echarts 实例 挂载到 组件上
      mychart: null,
      date: [],
    };
  },
  computed: {
    ...mapState("home", ["list"]),
  },
  methods: {
    setDate(data) {
      switch (data) {
        case "今日":
          // 获取今日时间
          this.date = [
            dayjs().format("YYYY-MM-DD"),
            dayjs().format("YYYY-MM-DD"),
          ];
          break;
        case "本周":
          // 星期一到星期天 为 一周

          this.date = [
            // 获取星期一 day是周几
            dayjs().day(1).format("YYYY-MM-DD"),
            // 获取星期天 day是周几
            dayjs().day(7).format("YYYY-MM-DD"),
          ];
          break;
        case "本月":
          this.date = [
            // startOf 时间的开始 ，month是月份
            dayjs().startOf("month").format("YYYY-MM-DD"),

            // endOf 时间的结束 ，month是月份
            dayjs().endOf("month").format("YYYY-MM-DD"),
          ];

          break;
        case "本年":
          this.date = [
            // startOf 时间的开始 ，year是年份
            dayjs().startOf("year").format("YYYY-MM-DD"),

            // endOf 时间的结束 ，year是年份
            dayjs().endOf("year").format("YYYY-MM-DD"),
          ];
          break;
      }
    },
  },
  mounted() {
    // 初始化echarts实列
    this.mychart = echarts.init(this.$refs.charts);
  },
  // 监听
  watch: {
    // 监听 activeName
    activeName() {
      // 如果有新属性的值，会替换老属性的值
      this.mychart.setOption({
        title: {
          text: `${this.activeName}趋势`,
        },
        xAxis: {
          data:
            this.activeName == "销售额"
              ? this.list.orderFullYearAxis
              : this.list.userFullYearAxis,
        },
        series: {
          data:
            this.activeName == "销售额"
              ? this.list.orderFullYear
              : this.list.userFullYear,
        },
      });
    },
    // 监听服务器的数据变化
    list() {
        // 使用刚指定的配置项和数据显示图表。
      this.mychart.setOption({
        title: {
          text: `${this.activeName}趋势`,
        },
        // 提示组件
        tooltip: {
          // 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
          trigger: "axis",
          // 坐标轴指示器配置项
          axisPointer: {
            // 阴影指示器
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.list.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.list.orderFullYear,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
::v-deep .el-card__header {
  border-bottom: none;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
  cursor: pointer;
}
.charts {
  width: 100%;
  height: 300px;
}

::v-deep .sorts h3 {
  margin: 0;
}
ul {
  list-style: none;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 12px 0;
  position: relative;
  font-size: 18px;
}

.index {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
}
.value {
  position: absolute;
  right: 0;
}
</style>