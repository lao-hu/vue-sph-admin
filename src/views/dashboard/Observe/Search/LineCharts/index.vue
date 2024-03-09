<template>
  <div>
    <div class="header">
      <span class="search-title">搜索用户数</span>
      <span>
        <svg
          t="1709185418041"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1821"
          width="20"
          height="20"
        >
          <path
            d="M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z"
            fill="#999999"
            p-id="1822"
          />
          <path
            d="M499.512194 743.02439C499.512194 756.818039 510.694157 768 524.487806 768 538.281453 768 549.463415 756.818039 549.463415 743.02439L549.463415 424.585365C549.463415 410.791718 538.281453 399.609756 524.487806 399.609756 510.694157 399.609756 499.512194 410.791718 499.512194 424.585365L499.512194 743.02439Z"
            fill="#999999"
            p-id="1823"
          />
          <path
            d="M499.512194 318.439025C499.512194 332.232672 510.694157 343.414635 524.487806 343.414635 538.281453 343.414635 549.463415 332.232672 549.463415 318.439025L549.463415 274.731708C549.463415 260.938059 538.281453 249.756098 524.487806 249.756098 510.694157 249.756098 499.512194 260.938059 499.512194 274.731708L499.512194 318.439025Z"
            fill="#999999"
            p-id="1824"
          /></svg></span>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span style="margin-right: 10px">17.17 </span>
      <span><i class="el-icon-caret-bottom" /></span>
    </div>
    <div class="footer">
      <!-- 容器 -->
      <div ref="charts" class="charts" />
      
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineCharts',
  data() {
    return {
      mychart: null
    }
  },
  mounted() {
    // 初始化echarts实列
    const mychart = echarts.init(this.$refs.charts)

    // 使用刚指定的配置项和数据显示图表。
    mychart.setOption({
      xAxis: {
        // 是否显示X轴
        show: false,
        // 坐标轴类型。
        type: 'category'
      },
      yAxis: {
        // 是否显示X轴
        show: false
      },
      series: [
        {
          type: 'line',
          data: [175, 145, 167, 187, 135, 145, 162, 149, 105, 147],
          // 填充颜色设置
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#4967c5' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          // 是否平滑曲线显示。
          smooth: false,
          // 拐点的样式设计
          itemStyle: {
            opacity: 0
          },
          // 线条颜色
          lineStyle: {
            color: '#4967c5'
          }
        }
      ],
      // 布局
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      // 提升组件
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.search-title {
  margin-right: 20px;
}
.main {
  margin-top: 10px;
}
.main-title {
  margin-right: 30px;
}
.charts {
  height: 100px;
  padding: 0;
  margin: 0;
}
</style>
