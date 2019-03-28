<template>
  <Box>
    <div class="con-main">
      <el-row>
        <el-col :span="24">
          <div class="con-main-top">
            <span>{{$t('breadcrumb.ComputerRoomEquipment')}}</span></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content">
            <div class="bg-purple">179</div>
            <div class="bg-purple-dark">设备总数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="bg-purple">10</div>
            <div class="bg-purple-dark">告警设备数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="bg-purple">2</div>
            <div class="bg-purple-dark">今日新增告警数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="bg-purple">3</div>
            <div class="bg-purple-dark">今日告警恢复数</div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div id='echart' style="width: 100%;height:500px; border:1px solid #ccc;" v-show="echart"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div>当前告警设备列表</div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="serialNumber" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="alarmTime" label="告警时间" width="180">
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.latestState.emergency !== null"><i title="紧急" class="el-icon-error"></i></span>
                <span v-if="scope.row.latestState.warning !== null"><i title="警告" class="el-icon-warning"></i></span>
                <span v-if="scope.row.latestState.ignore !== null"><i title="忽略" class="el-icon-info"></i></span>
                <span v-if="scope.row.latestState.ban !== null"><i title="禁止" class="el-icon-remove"></i></span>
              </template>
            </el-table-column>
            <el-table-column prop="DeviceName" label="设备名称" width="180">
            </el-table-column>
            <el-table-column prop="latestState" label="最新状态" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.latestState.emergency !== null"><i title="紧急" class="el-icon-error"></i> {{scope.row.latestState.emergency}}</span>
                <span v-if="scope.row.latestState.warning !== null"><i title="警告" class="el-icon-warning"></i>{{scope.row.latestState.warning}}</span>
                <span v-if="scope.row.latestState.ignore !== null"><i title="忽略" class="el-icon-info"></i>{{scope.row.latestState.ignore}}</span>
                <span v-if="scope.row.latestState.ban !== null"><i title="禁止" class="el-icon-remove"></i> {{scope.row.latestState.ban}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ComputerRoom" label="机房" width="180">
            </el-table-column>
            <el-table-column prop="rack" label="机架" width="180">
            </el-table-column>
            <el-table-column prop="locations" label="位置" width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "home",
    components: {
      Box
    },
    data() {
      return {
        echart: true,
        tableData: [{
          serialNumber: '1',
          alarmTime: '2016-05-02',
          DeviceName: '1',
          latestState: {
            emergency:'11',
            warning:'3',
            ignore:'7',
            ban:'10',
          },
          ComputerRoom: '温州机房',
          rack: 'A8-3',
          locations: 'U22',

        },{
          serialNumber: '1',
          alarmTime: '2016-05-04',
          DeviceName: '1',
          latestState: {
            emergency:'3',
            warning:null,
            ignore:'10',
            ban:'9',
          },
          ComputerRoom: '温州机房',
          rack: 'A8-3',
          locations: 'U22',

        },{
          serialNumber: '1',
          alarmTime: '2016-05-02',
          DeviceName: '1',
          latestState: {
            emergency:'1',
            warning:'3',
            ignore:null,
            ban:'5',
          },
          ComputerRoom: '温州机房',
          rack: 'A8-3',
          locations: 'U22',

        },{
          serialNumber: '1',
          alarmTime: '2016-05-02',
          DeviceName: '1',
          latestState: {
            emergency:null,
            warning:'10',
            ignore:'5',
            ban:'10',
          },
          ComputerRoom: '温州机房',
          rack: 'A8-3',
          locations: 'U22',

        },{
          serialNumber: '1',
          alarmTime: '2016-05-02',
          DeviceName: '1',
          latestState: {
            emergency:'10',
            warning:'5',
            ignore:'4',
            ban:null,
          },
          ComputerRoom: '温州机房',
          rack: 'A8-3',
          locations: 'U22',

        },]
      }
    },
    created() {

      /*this.$store.commit('setLoading',true);*/
    },
    mounted() {
      this.drawLine();
    },
    methods: {
      drawLine() {
        let myChart = this.$echarts.init(document.getElementById("echart"))
        
        myChart.setOption({
        	
          title: {
            text: '监测概览',
            subtext: '2019年3月25日 09:02',
            top:5,
            left:20,
            textStyle:{
              fontSize:18,
              color:'#333'
            },
            subtextStyle:{
              fontSize:14,
              color:'#ccc'
            },
            itemGap:10
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid:{
            top:'100',
          },
          legend: {
            data: ['正常', '紧急', '主要', '次要', '警告', '忽略', '禁止', '设备总数']
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: ['x86服务器', '小型机', '存储', '备份', '网络设备', '环境动力', '其他']
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '正常',
            type: 'bar',
            stack: '正常',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
            {
              name: '紧急',
              type: 'bar',
              stack: '紧急',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '主要',
              type: 'bar',
              stack: '搜索引擎',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '次要',
              type: 'bar',
              stack: '搜索引擎',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '警告',
              type: 'bar',
              stack: '搜索引擎',
              data: [862, 1018, 964, 1026, 1679, 1600, 1570],
              /*markLine: {
                                itemStyle: {
                                    normal: {

                                        lineStyle: {

                                            type: 'dashed'
                                        }
                                    }
                                },*/
              /*data: [
                                [{
                                    type: 'min'
                                }, {
                                    type: 'max'
                                }]
                            ]*/
              /*}*/
            },
            {
              name: '忽略',
              type: 'bar',
              barWidth: 5,
              stack: '搜索引擎',
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
              name: '禁止',
              type: 'bar',
              stack: '搜索引擎',
              data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
              name: '设备总数',
              type: 'bar',
              stack: '设备总数',
              data: [60, 72, 71, 74, 190, 130, 110]
            },

          ]
        })
      },

    }
  }
</script>

<style scoped>
  .con-main {
    padding: 0 60px;
  }

  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    color: #333;
    text-align: center;
    font-size: 25px;
    /*line-height: 50px;*/
  }

  .bg-purple {
    color: #f22;
    font-size: 25px;
    text-align: center;
    line-height: 100px;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    height: 150px;
    border: 1px solid #ccc;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .con-main-top {
    line-height: 30px;
    border-bottom: 1px solid #ccc;
  }

  .con-main-top span {
    display: inline-block;
    border-bottom: 4px solid #99A9BF;
  }




  .el-icon-error{
    color: #f22;
  }
  .el-icon-warning{
    color: #FFFF00;
  }
  .el-icon-info{
    color: #FF9500;
  }
  .el-icon-remove{
    color: #C0C0C0;
  }
</style>
