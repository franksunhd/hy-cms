<template>
  <Box class="grayBg homeBox">
    <div class="home-main">
      <p class="home-main-title">{{$t('breadcrumb.ComputerRoomEquipment')}}</p>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="home-main-alert-box" style="display: flex;">
            <span class="iconfontPrimaryBg">
              <span class="iconfontPrimaryBox">
                <span class="iconfont">&#xe603;</span>
              </span>
            </span>
            <div class="displayFlex-flex home-main-title-text">
              <p class="title">设备总数</p>
              <p class="textNum">179 <span class="num">台</span> </p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-main-alert-box" style="display: flex;">
            <span class="iconfontSuccessBg">
              <span class="iconfontSuccessBox">
                <span class="iconfont ">&#xe602;</span>
              </span>
            </span>
            <div class="displayFlex-flex home-main-title-text">
              <p class="title">告警设备数</p>
              <p class="textNum">
                <span>10</span>
                <span class="num">台</span>
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-main-alert-box" style="display: flex;">
            <span class="iconfontWarnBg">
              <span class="iconfontWarnBox">
                <span class="iconfont">&#xe604;</span>
              </span>
            </span>
            <div class="displayFlex-flex home-main-title-text">
              <p class="title">今日新增告警数</p>
              <p class="textNum">
                <span>2</span>
                <span class="num">台</span>
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-main-alert-box" style="display: flex;">
            <span class="iconfontErrorBg">
              <span class="iconfontErrorBox">
                <span class="iconfont">&#xe605;</span>
              </span>
            </span>
            <div class="displayFlex-flex home-main-title-text">
              <p class="title">今日告警恢复数</p>
              <p class="textNum">
                <span>1</span>
                <span class="num">台</span>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div id="eCharts" class="whiteBg" style="height: 500px;width: 100%;" v-show="echart"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="home-main-title">当前告警设备列表</div>
          <el-table :data="tableData" class="indexTableBox" stripe border style="width: 100%">
            <el-table-column prop="serialNumber" label="序号" width="90">
            </el-table-column>
            <el-table-column prop="alarmTime" label="告警时间" width="160">
            </el-table-column>
            <el-table-column width="60px" prop="state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.latestState.emergency !== null"><i title="紧急" class="el-icon-error"></i></span>
                <!--<span v-if="scope.row.latestState.warning !== null"><i title="警告" class="el-icon-warning"></i></span>-->
                <!--<span v-if="scope.row.latestState.ignore !== null"><i title="忽略" class="el-icon-info"></i></span>-->
                <!--<span v-if="scope.row.latestState.ban !== null"><i title="禁止" class="el-icon-remove"></i></span>-->
              </template>
            </el-table-column>
            <el-table-column prop="DeviceName" label="设备名称">
            </el-table-column>
            <el-table-column prop="latestState" label="告警内容" />
            <!--<el-table-column prop="latestState" label="最新状态">-->
              <!--<template slot-scope="scope">-->
                <!--<span v-if="scope.row.latestState.emergency !== null"><i title="紧急" class="el-icon-error"></i> {{scope.row.latestState.emergency}}</span>-->
                <!--<span v-if="scope.row.latestState.warning !== null"><i title="警告" class="el-icon-warning"></i>{{scope.row.latestState.warning}}</span>-->
                <!--<span v-if="scope.row.latestState.ignore !== null"><i title="忽略" class="el-icon-info"></i>{{scope.row.latestState.ignore}}</span>-->
                <!--<span v-if="scope.row.latestState.ban !== null"><i title="禁止" class="el-icon-remove"></i> {{scope.row.latestState.ban}}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="ComputerRoom" label="机房">
            </el-table-column>
            <el-table-column prop="rack" label="机架">
            </el-table-column>
            <el-table-column prop="locations" label="位置">
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
    components: {Box},
    data() {
      return {
        echart: true,
        tableData: [
          {
            serialNumber: '1',
            alarmTime: '2019-04-22 13:01:30',
            DeviceName: 'swd77',
            latestState: 'Admin Status[Switch Port: 39]: Offline [adminStatus=Offline]',
            ComputerRoom: '温州机房',
            rack: 'A8-3',
            locations: '12U',
          },
          {
            serialNumber: '2',
            alarmTime: '2019-04-06 12:10:13',
            DeviceName: 'swd65',
            latestState: 'Admin Status[Switch Port: 39]: Offline [adminStatus=Offline]',
            ComputerRoom: '温州机房',
            rack: 'A8-3',
            locations: '20U',
          },
          {
            serialNumber: '3',
            alarmTime: '2019-04-05 15:15:33',
            DeviceName: 'swd75',
            latestState: 'Admin Status[Switch Port: 39]: Offline [adminStatus=Offline]',
            ComputerRoom: '温州机房',
            rack: 'A8-3',
            locations: '13U',
          },
          {
            serialNumber: '4',
            alarmTime: '2019-04-02 11:05:23',
            DeviceName: 'swd70',
            latestState: 'Admin Status[Switch Port: 39]: Offline [adminStatus=Offline]',
            ComputerRoom: '温州机房',
            rack: 'A8-3',
            locations: '25U',
          }
        ],
        options:{
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
          icon:['circle'], // 设置图例为圆形
          color:['#31ce32','#f1232b','#2c6bb5','#9255dc','#fce441','#37d0c7','#fe753f','#3dabfd'],
          legend: {
            data: ['正常', '紧急', '主要', '次要', '警告', '忽略', '禁止', '设备总数']
          },
          toolbox: {
            show: true,
            x: 'right',
            y: 'top',
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
        }
      }
    },
    methods: {
      drawLine() {
        var _t= this;
        var myChart = this.$echarts.init(document.getElementById("eCharts"))
        myChart.setOption(_t.options)
      },
    },
    mounted() {
     this.drawLine();
     	// 给body设置自定义属性用于登录过期 提示只执行一次
			document.body.setAttribute('data-return',false);
    }
  }
</script>

<style scoped>
  .home-main {
    padding: 0 20px;
  }

  .home-main-title {
    height: 50px;
    line-height: 50px;
  }

  .home-main-alert-box {
    background-color: #fff;
    border-radius: 4px;
    height: 110px;
    margin-bottom: 20px;
  }

  .home-main-title-text {
    margin-top: 26px;
  }

  .home-main-title-text p.title {
    font-size: 12px;
  }

  .home-main-title-text > p.textNum {
    font-size: 18px;
    font-weight: bold;
    margin-top: 22px;
  }

  .home-main-title-text > p.textNum > span.num {
    font-size: 12px;
  }
</style>
<style>
  .homeBox .box-wrap {
    padding-top: 0 !important;
  }
</style>
