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
    <el-row>
      <el-col :span="24" style="padding: 10px">
        <div class="whiteBg">
          <!--标题-->
          <div class="clearfix">
            <span>最新告警列表</span>
            <el-select class="fr" v-model="addEdit.sortValue">
              <el-option v-for="(item,index) in sortArr" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
            <el-popover
              class="fr"
              trigger="click"
              placement="bottom-start"
              v-model="isShowEditPopover"
              ref="popover">
              <el-tree
                :data="organizationList"
                highlight-current
                :expand-on-click-node="false"
                @node-click="clickNodeAlert"
                :props="defaultProps"/>
              <el-input
                v-model="addEdit.organizationName"
                style="width: 200px;"
                suffix-icon="el-icon-arrow-down"
                readonly
                slot="reference"/>
            </el-popover>
          </div>
          <!--表格-->
          <el-table :data="tableData" stripe>
            <el-table-column :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.status')" header-align="center" align="center">
              <template slot-scope="scope">
                <span @click="clickStatus(scope.row)"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.equipmentName')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.equipmentName}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.alarmContent')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.alarmContent}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.lastAlarmTime')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.lastModifiedTime | dateFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.statusAll')" header-align="center" align="center">
              <template slot-scope="scope">

              </template>
            </el-table-column>
            <el-table-column prop="computerRoomName" :label="$t('alarmManagement.computerRoomName')"
                             header-align="center" align="center"/>
            <el-table-column prop="rackName" :label="$t('alarmManagement.rackName')" header-align="center"
                             align="center"/>
            <el-table-column prop="location" :label="$t('alarmManagement.location')" header-align="center"
                             align="center"/>
            <el-table-column prop="ip" :label="$t('alarmManagement.Ip')" header-align="center" align="center"/>
            <el-table-column prop="equipmentType" :label="$t('alarmManagement.equipmentType')" header-align="center"
                             align="center"/>
            <el-table-column prop="processStatus" :label="$t('alarmManagement.processStatus')" header-align="center"
                             align="center"/>
          </el-table>
          <!--分页-->
          <pages
            :total='options.total'
            :currentPage='options.currentPage'
            :page-size="options.pageSize"
            @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {dateFilterSeconds, dateFilter} from "../../assets/js/filters";

  export default {
    name: "alarmManagement",
    components: {Box},
    data() {
      return {
        sortArr: [
          {label: 'Top10', value: 10},
          {label: 'Top15', value: 15},
          {label: 'Top20', value: 20},
          {label: 'Top30', value: 30},
        ], // 排序
        addEdit: {
          sortValue: 10, // 绑定的pageSize值
          organizationName: '', // 树形下拉框绑定的值
          organizationId: '', // 树形下拉框的绑定的id
        },
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        // 分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        },
        isShowEditPopover: false, // 控制树形下拉框的显示隐藏
        organizationList: [], // 树形下拉框的数据
        tableData: [
          {
            status: 1,
            equipmentName: '惠普',
            alarmContent: '告警内容告警内容告警内容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',

          },
          {}
        ], // 最新告警列表表格数据
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
      // 点击表格状态显示设备告警详情
      clickStatus(data) {

      },
      // 点击下拉框的节点
      clickNodeAlert() {

      },
      // 改变当前页码
      handleCurrentChange(val) {
        var _t = this;
        _t.options.currentPage = val;
        _t.getData();
      },
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
