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
        min: 0,
        max: 100
      },
      yAxis: {
        // 是否显示X轴
        show: false,
        // 坐标轴类型。
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],

          // 柱条的宽度，不设时自适应
          barWidth: '10',
          // 颜色
          color: '#59b116',
          // 是否显示柱条的背景色
          showBackground: true,
          // 柱条的背景色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本标签
          label: {
            // 是否显示标签
            show: true,
            // 标签内容
            formatter: '|',
            // 文本标签颜色
            color: '#59b116',
            // 标签的位置
            position: 'right'
          }
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
