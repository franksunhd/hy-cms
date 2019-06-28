<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.SystemMonitoring')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.CollectorApplication')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col :span="24">
        <div id="echart" style="width: 100%; height: 430px; border: #CCCCCC solid 1px; padding:20px 100px 0 50px"></div>
      </el-col>
    </el-row>
    <el-row v-show="WEB">
      <el-col>
        <div class="col-title">
          <div class="col-title-l">A01（192.168.0.101</div>
          <div class="col-title-r">【正常】</div>
        </div>
      </el-col>
      <el-col>
        <div class="col-tab">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="java虚拟机内存实用情况" name="first">
              <div class="java-virtual">
                <ul>
                  <li><span>已用堆内存：</span><span>337 MB</span></li>
                  <li><span>已用峰值堆内存：</span><span>999 MB</span></li>
                  <li><span>最大堆内存：</span><span>1495MB</span></li>
                  <li><span>堆内存使用率：</span><span>22.5%</span></li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="数据库连接池状态" name="second">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item class="aaaa" title="ManageDS 数据源" name="1">
                  <div class="dataSource">
                    <ul>
                      <li><span>正在实用的连接数：</span><span>0</span></li>
                      <li><span>空闲连接数：</span><span>1</span></li>
                      <li><span>空闲连接数：</span><span>50</span></li>
                    </ul>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="HistoryDS 数据源" name="2">
                  <div class="dataSource">
                    <ul>
                      <li><span>正在实用的连接数：</span><span>0</span></li>
                      <li><span>空闲连接数：</span><span>1</span></li>
                      <li><span>空闲连接数：</span><span>50</span></li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="资源实用情况" name="third">
              <div class="Resources">
                <div class="Resources-left">
                  <ul>
                    <li><span>CPU总体使用率：</span><span>35%</span></li>
                    <li><span>当前应用CPU使用率：</span><span>20%</span></li>
                    <li><span>当前出流量：</span><span>25MB/s</span></li>
                    <li><span>平均出流量：</span><span>22.5 MB/s</span></li>
                    <li><span>峰值出流量：</span><span>37 MB/s</span></li>
                  </ul>
                </div>
                <div class="Resources-right">
                  <ul>
                    <li><span>内存总体使用率：</span><span>30%</span></li>
                    <li><span>当前应用内存使用率：</span><span>10%</span></li>
                    <li><span>当前入流量：</span><span>25 MB/s</span></li>
                    <li><span>平均入流量：</span><span>22.5 MB/s</span></li>
                    <li><span>峰值入流量：</span><span>37 MB/s</span></li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </Box>
</template>

<script>
  import Box from '../../../../components/common/Box';

  export default {
    name: 'collector-application',
    components: {Box},
    data() {
      return {
        /*tabs*/
        activeName: 'second',
        /*折叠面板*/
        activeNames: ['1'],
        WEB: false,
        /*W01: false,
                W02: false,
                W03: false,*/
      }

    },
    mounted() {
      this.drawLine();
    },
    methods: {
      /*tabs*/
      handleClick(tab, event) {},
      /*折叠面板*/
      handleChange(val) {},
      drawLine() {
        /*基于准备好的DOM 初始化echarts*/
        let myChart = this.$echarts.init(document.getElementById("echart"))
        myChart.setOption({
          title: {
            text: '采集器应用状态',
            subtext: '虚构数据'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              /*dataView : {show: true, readOnly: false},*/
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          /*calculable : false,*/

          series: [{
            name: '树图',
            type: 'tree',
            orient: 'horizontal', // vertical horizontal
            rootLocation: {
              x: '100',
              y: 50
            }, // 根节点位置  {x: 100, y: 'center'}
            nodePadding: 50,
            layerPadding: 12,
            hoverable: true,
            symbolSize: 16,
            itemStyle: {
              normal: {
                color: '#4883b4',
                label: {
                  show: true,
                  position: 'right',
                  formatter: "{b}",
                  textStyle: {
                    color: '#000',
                    fontSize: 16
                  }
                },
                lineStyle: {
                  color: '#48b',
                  /*shadowColor: '#000',
                                    shadowBlur: 3,
                                    shadowOffsetX: 3,
                                    shadowOffsetY: 5,*/
                  type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

                }
              },
              emphasis: {
                color: '#4883b4',
                label: {
                  show: false
                },
                borderWidth: 0
              }
            },

            data: [{
              name: '采集器',
              value: 1,
              children: [{
                name: 'A01（192.168.0.101）【正常】',
                value: 1
              },
                {
                  name: 'A02（192.168.0.102）【正常】',
                  value: 1
                },
                {
                  name: 'A03（192.168.0.103）【已停止】',
                  value: 1
                },
                {
                  name: 'A04（15.10.0.103）【正常】',
                  value: 1
                },
                {
                  name: 'A05（192.168.0.204）【正常】',
                  value: 1
                },
              ]
            }],
            left: '12%',
            right: '40%',
            top: '10%',
            bottom: "10%"
          }]
        });
        var that = this;
        myChart.on('click', function (param) {
          var index = param.dataIndex;
          if (index == 1) {
            that.WEB = false;
          } else if (index == 2 || index == 3 || index == 4) {
            that.WEB = true;
          }
          return that.WEB;
        });
        /*this.WEB=that.WEB;*/
      },
    }
  }
</script>

<style scoped>
  .col-title {
    margin-top: 20px;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    background-color: #ccc;
  }

  .col-title-l {
    float: left;
  }

  .col-title-r {
    float: right;
  }

  .col-tab {
    overflow: hidden;
  }

  .java-virtual {
    overflow: hidden;
    padding-top: 5%;
    height: 400px;
    width: 50%;
  }

  .java-virtual ul li {
    font-size: 20px;
    line-height: 50px;
  }

  .java-virtual ul li span {
    display: inline-block;
    width: 50%;
  }

  .java-virtual ul li span:first-child {
    color: #f22;
    text-align: right;
    padding-right: 1%;
  }

  .java-virtual ul li span:nth-child(2) {
    text-align: left;
    padding-left: 1%;
  }

/*
影响到监测管理-->设备资产左侧的导航
  .el-collapse-item__header {
    background-color: #ccc;
    margin: 20px 50px;
  }
*/

  .dataSource {
    padding-top: 1%;
    width: 50%;
    overflow: hidden;
  }

  .dataSource ul li {
    font-size: 20px;
    line-height: 50px;
  }

  .dataSource ul li span {
    display: inline-block;
    width: 50%;
  }

  .dataSource ul li span:first-child {
    color: #f22;
    text-align: right;
    padding-right: 1%;
  }

  .dataSource ul li span:nth-child(2) {
    text-align: left;
    padding-left: 1%;
  }

  .Resources {
    padding-top: 5%;
    overflow: hidden;
    height: 400px;
  }

  .Resources-left {
    width: 50%;
    float: left;
  }

  .Resources-left ul li {
    font-size: 20px;
    line-height: 50px;
    text-align: center;
  }

  .Resources-left ul li span {
    display: inline-block;
    width: 50%;
  }

  .Resources-left ul li span:first-child {
    text-align: right;
    color: #f22;
    padding-right: 1%;
  }

  .Resources-left ul li span:nth-child(2) {
    text-align: left;
    padding-left: 1%;
  }

  .Resources-right {
    float: left;
    width: 50%;
    font-size: 18px;
  }

  .Resources-right ul li {
    font-size: 20px;
    line-height: 50px;
    text-align: center;
  }

  .Resources-right ul li span {
    display: inline-block;
    width: 50%;
  }

  .Resources-right ul li span:first-child {
    text-align: right;
    color: #f22;
    padding-right: 1%;
  }

  .Resources-right ul li span:nth-child(2) {
    text-align: left;
    padding-left: 1%;
  }
</style>
