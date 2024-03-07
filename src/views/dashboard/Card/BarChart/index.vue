<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    // 初始化echarts实列
    const mychart = echarts.init(this.$refs.charts)
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
          type: 'bar',
          data: [175, 145, 167, 187, 135, 145, 162, 149, 105, 147],
          // 填充颜色设置
        
          // 是否平滑曲线显示。
          smooth: false
        
        }
      ],
      // 布局
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
