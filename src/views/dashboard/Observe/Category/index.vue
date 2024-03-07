<template>
  <el-card>
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <span>
        <el-radio-group v-model="radios">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </span>
    </div>
    <div class="main">
      <!-- 容器 -->
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      radios: "",
    };
  },
  mounted() {
    // 初始化echarts实列
    const mychart = echarts.init(this.$refs.charts);

    // 使用刚指定的配置项和数据显示图表。
    mychart.setOption({
      // 标题
      title: {
        // 主标题
        text: "搜索引擎",
        // 副标题
        subtext: "1048",
        // 左侧的距离
        left: "center",
        // 上侧的距离
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
       
          type: "pie",
          radius: ["42%", "72%"],
          avoidLabelOverlap: false,
          // 图形样式。
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
          label: {
            show: true,
            // 标签的位置 饼图扇区外侧，通过视觉引导线连到相应的扇区。
            position: "outside",
            fontSize: 16,
          },

          // 是否显示视觉引导线。
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "搜索引擎:1048" },
            { value: 735, name: "直接访问:735" },
            { value: 580, name: "邮箱营销:580" },
            { value: 484, name: "联盟广告:484" },
            { value: 300, name: "视频广告:300 " },
          ],
        },
      ],
    });
    // 给 echarts 绑定鼠标事件
    mychart.on('mouseover',(params) => {
        // 分割字符串
       let name =  params.data.name.split(":")
       // 给 标题重新赋值

       mychart.setOption({
                // 标题
            title: {
                // 主标题
                text: name[0],
                // 副标题
                subtext: name[1],
            }
       })
    })
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  height: 300px;
}
</style>