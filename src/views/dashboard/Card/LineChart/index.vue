<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
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
                  color: '#d71fd2' // 0% 处的颜色
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
            color: '#c71bba'
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
.charts {
  width: 100%;
  height: 100%;
}
</style>
