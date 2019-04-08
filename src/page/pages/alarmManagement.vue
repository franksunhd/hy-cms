<template>
  <Box class="grayBg">
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 图表-->
    <el-row :gutter="10">
      <el-col :span="16">
        <div style="padding: 10px 0 0 10px;">
          <div id="alarmLine" class="whiteBg" style="height:370px; width: 100%;padding: 10px 0 0;"/>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="padding: 10px 10px 0 0">
          <div id="alarmPuff" class="whiteBg" style="height:370px; width: 100%;padding: 10px 0 0;"/>
        </div>
      </el-col>
    </el-row>
    <!--表格-->

  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {dateFilterSeconds} from "../../assets/js/filters";

  export default {
    name: "alarmManagement",
    components: {Box},
    data() {
      return {
        // 千层饼图
        optionsPuff: {
          // 标题
          title: {
            text: '设备告警级别占比',
            subtext: dateFilterSeconds(new Date()),
            textStyle: {
              color: 'blue'
            },
            subtextStyle: {
              color: 'red'
            },
            left: 20, // 标题距离左侧位置
            top: 5, // 标题距离顶部位置
          },
          // 鼠标移入饼图占比
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          // 图例
          legend: {
            x: 'center',
            y: 'bottom',
            icon: 'circle',
          },
          // 图表操作
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              restore: {show: true},
              saveAsImage: {show: true}
            },
            right: 20
          },
          // 数据
          series: [],
        },
        // 折现图例
        optionLine: {
          // 标题
          title: {
            text: '设备告警级别实时数据',
            textStyle: {
              color: 'blue'
            },
            subtextStyle: {
              color: 'red'
            },
            left: 20, // 标题 距左侧 位置
            top: 5 // 标题 距顶部位置
          },
          // x轴 横轴
          xAxis: {
            boundaryGap: false, // 点从头开始
            data: ['2019-01-12 2h', '2019-01-13 3h', '2019-01-14 4h', '2019-01-15 5h', '2019-01-16 6h', '2019-01-17 7h', '2019-01-18 8h']
          },
          // y轴 纵轴
          yAxis: {
            type: 'value',
            boundaryGap: false, // 点从头开始
            splitLine: {show: false}
          },
          // 图例
          legend: {
            x: 'center',
            y: 'bottom',
            icon: 'circle',
          },
          // 压缩折线图
          grid: {
            bottom: 85
          },
          dataZoom: {
            orient: "horizontal",
            show: true,
            start: 0,
            end: 100,
            height: 20,
            bottom: 30,
            borderColor: 'red'
          },
          // 鼠标移入显示内容
          tooltip: {
            trigger: 'axis'
          },
          // 数据
          series: [
            {
              name: '正常',
              type: 'line',
              formatter: "{b}", // 指示线
              smooth: true, // 平滑
              data: [1, 2, 3, 4, 5, 6, 7],
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            },
            {
              name: '紧急',
              type: 'line',
              smooth: true,
              data: [3, 4, 5, 25, 7, 9, 2],
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            }
          ]
        }
      }
    },
    methods: {
      // 请求数据
      getData() {
        var _t = this;
        _t.$nextTick(function () {
          _t.alertPuff();
          _t.alarmLine();
        });
      },
      // 绘制 千层饼图
      alertPuff() {
        var _t = this;
        var myChart = this.$echarts.init(document.getElementById('alarmPuff'));
        var option = {
          name: '设备发现进度', //
          type: 'pie', // 图表类型
          radius: '50%',
          data: [
            {value: 50, name: '正常'},
            {value: 50, name: '紧急'},
            {value: 50, name: '告警'},
            {value: 50, name: '忽略'},
            {value: 50, name: '禁止'},
          ]
        };
        var legendData = new Array();
        option.data.forEach(function (item) {
          legendData.push(item);
        });
        // 动态设置图例
        _t.optionsPuff.legend.data = legendData;
        _t.optionsPuff.series[0] = option;
        myChart.setOption(_t.optionsPuff, true);
      },
      // 绘制实时折现图
      alarmLine() {
        var _t = this;
        var myChart = this.$echarts.init(document.getElementById('alarmLine'));
        myChart.setOption(_t.optionLine, true);
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style scoped>

</style>
