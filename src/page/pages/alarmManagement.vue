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
    <el-row style="margin-bottom: 50px;">
      <el-col :span="24" style="padding: 10px">
        <div class="whiteBg">
          <!--标题-->
          <div class="clearfix alarmTitleBox">
            <span class="title">{{$t('alarmManagement.lastAlarmList')}}</span>
            <el-select class="fr selectArr" v-model="addEdit.sortValue" @change="options.pageSize = addEdit.sortValue">
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
          <el-table :data="tableData" stripe @cell-click="cellClickColumn">
            <el-table-column :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.status')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.status == 1" effect="dark" content="紧急" placement="top-start">
                  <span class="iconfont iconfontError">&#xe609;</span>
                </el-tooltip>
                <el-tooltip v-if="scope.row.status == 2" effect="dark" content="警告" placement="top-start">
                  <span class="iconfont iconfontWarn">&#xe608;</span>
                </el-tooltip>
                <el-tooltip v-if="scope.row.status == 3" effect="dark" content="忽略" placement="top-start">
                  <span class="iconfont iconfontDisable">&#xe60a;</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.equipmentName')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.equipmentName}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.alarmContent')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" placement="left-start">
                  <div slot="content" style="width: 150px">{{scope.row.alarmContent}}</div>
                  <span>{{scope.row.alarmContent}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.lastAlarmTime')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.lastModifiedTime | dateFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmManagement.statusAll')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>
                  <span class="iconfont iconfontError">&#xe609;</span>
                  <span>22</span>
                </span>
                <span>
                  <span class="iconfont iconfontWarn">&#xe608;</span>
                  <span>222</span>
                </span>
                <span>
                  <span class="iconfont iconfontDisable">&#xe60a;</span>
                  <span>12</span>
                </span>
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
            v-if="tableData.length > 10"
            :total='options.total'
            :currentPage='options.currentPage'
            :page-size="options.pageSize"
            @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
    <!--设备告警详情弹出层-->
    <el-dialog
      class="alarmMessageBox"
      :title="$t('alarmManagement.addUpdateAlarm')"
      append-to-body
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="dialogTitle">{{$t('alarmManagement.equipmentInfo')}}</div>
      <el-form :model="equipmentData" inline label-position="right" label-width="76px">
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.equipmentName') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.productName') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.equipmentIp') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.UUID') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.equipmentVendor') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.serialNumber') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.objectType') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.severityLevel') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.alarmNumber') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.eventType') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.createTime') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmManagement.lastTime') + ':'"></el-form-item>
      </el-form>
      <div class="dialogTitle">{{$t('alarmManagement.alarmInfo')}}</div>
      <el-form inline label-position="right" label-width="76px">
        <p class="paddingLeft-10"><strong>{{$t('alarmManagement.alarmField')}}</strong></p>
        <el-form-item :label="$t('alarmManagement.status') + ':'">Down != Up</el-form-item>
        <p class="paddingLeft-10"><strong>{{$t('alarmManagement.currentStatus')}}</strong></p>
        <el-form-item style="width: 50%;" :label="$t('alarmManagement.macLocation') + ':'">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmManagement.status') + ':'">Down</el-form-item>
        <p class="paddingLeft-10"><strong>{{$t('alarmManagement.addField')}}</strong></p>
        <el-form-item :label="$t('alarmManagement.status') + ':'">Down != Up</el-form-item>
        <p class="paddingLeft-10"><strong>{{$t('alarmManagement.addInfo')}}</strong></p>
        <el-form-item style="width: 60%;" :label="$t('alarmManagement.productName') + ':'">Intel(R) Gigabit 4P I350-t rNDC - EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item style="width: 30%;" :label="$t('alarmManagement.name') + ':'">NIC.Integrated.1-3-1</el-form-item>
        <br>
        <el-form-item style="width: 30%;" :label="$t('alarmManagement.AutoNegotiation') + ':'">Enabled</el-form-item>
        <el-form-item style="width: 30%;" :label="$t('alarmManagement.linkSpeed') + ':'">Unknown</el-form-item>
        <el-form-item style="width: 30%;" :label="$t('alarmManagement.macLocation') + ':'">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmManagement.alarmDescription') + ':'">
          <el-input type="textarea" style="width: 734px;" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary">{{$t('public.ignoreAlarm')}}</el-button>
        <el-button type="primary">{{$t('public.confirmAlarm')}}</el-button>
        <el-button type="primary">{{$t('public.toWarranty')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--标签页-->
    <el-tabs
      v-if="isShowTabBox_tab"
      v-model="editableTabsValue"
      type="card"
      class="whiteBg"
      id="alarmManagement-tabs"
      tab-position="bottom"
      closable
      @tab-click="clickTabs"
      @tab-remove="removeTab">
      <el-tab-pane
        :key="index"
        stretch
        v-for="(item, index) in editableTabs"
        :name="item.name"
        :label="item.title">
        <div class="alarmManagement-btn">
          <!--收起-->
          <span @click="packUp" class="iconfont" style="cursor: pointer;">&#xe61d;</span>
          <!--关闭弹出层-->
          <span @click="closeTab" class="iconfont" style="cursor: pointer;">&#xe615;</span>
        </div>
        <AdministrationTags v-if="isShowTabBox" :pages-id="item.content" />
      </el-tab-pane>
    </el-tabs>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {dateFilterSeconds, dateFilter} from "../../assets/js/filters";
  import AdministrationTags from '../../components/AdministrationTabs';

  export default {
    name: "alarmManagement",
    components: {Box,AdministrationTags},
    data() {
      return {
        editableTabsValue:'', // 当前页签
        editableTabs:[], // 页面集合
        tabIndex: 0, // 页签序号
        sortArr: [
          {label: 'Top10', value: 10},
          {label: 'Top15', value: 15},
          {label: 'Top20', value: 20},
          {label: 'Top30', value: 30},
        ], // 排序
        addEdit: {
          id:'',
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
        dialogVisible:false, // 设备告警详情弹出层
        isShowTabBox:true, // 控制标签页内容是否显示
        isShowTabBox_tab:false,
        organizationList: [], // 树形下拉框的数据
        equipmentData:{}, // 设备告警详情
        tableData: [
          {
            id:'1',
            status: 1,
            equipmentName: '惠普1',
            alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',

          },
          {
            id:'2',
            status: 2,
            equipmentName: '惠普2',
            alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',
          },
          {
            id:'3',
            status: 3,
            equipmentName: '惠普3',
            alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',
          },
          {
            id:'4',
            status: 1,
            equipmentName: '惠普4',
            alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',
          },
          {
            id:'5',
            status: 2,
            equipmentName: '惠普5',
            alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',
          },
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
      /*
       * 点击表格的单元格
       *    row 当前行绑定的 数据
       *    column 当前 单元格的 属性
       *    cell 当前单元格 的 dom节点
       *    event 事件
       */
      cellClickColumn(row, column){
        var _t = this;
        // 点击状态列
        if (column.label == _t.$t('alarmManagement.status')) {
          _t.dialogVisible = true;
          _t.addEdit.id = row.id;
        }
        // 点击设备名称列
        if (column.label == _t.$t('alarmManagement.equipmentName')) {
          _t.addTab(row.equipmentName,row.id);
        }
        // 点击告警内容列
        if (column.label == _t.$t('alarmManagement.alarmContent')) {
          _t.dialogVisible = true;
          _t.addEdit.id = row.id;
        }
        // 点击最新告警时间列
        if (column.label == _t.$t('alarmManagement.lastAlarmTime')) {
          _t.addTab(row.equipmentName,row.id);
        }
      },
      // 点击下拉框的节点
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.organizationName = val.nodeName;
        _t.addEdit.organizationId = val.id;
        _t.getData();
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
      },
      // 删除页签
      removeTab(targetName){
        var _t = this;
        // 获取页面集合
        var tabs = _t.editableTabs;
        // 获取当前选中的页签
        var activeName = _t.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              var nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              } else {
                _t.isShowTabBox_tab = false;
              }
            }
          });
        }
        // 删除之后的页签
        _t.editableTabsValue = activeName;
        _t.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      // 添加页签
      addTab(title,id) {
        var _t = this;
        var newTabName = ++_t.tabIndex + '';
        _t.editableTabs.push({
          title: title,
          name:newTabName,
          content: id
        });
        _t.editableTabsValue = newTabName;
        _t.isShowTabBox = true;
        _t.isShowTabBox_tab = true;
        if (_t.editableTabs.length > 1) {
          document.getElementById('alarmManagement-tabs').style.top = '118px';
        }
      },
      // 收起
      packUp(){
        var _t = this;
        _t.isShowTabBox = false;
        document.getElementById('alarmManagement-tabs').style.top = 'initial';
        _t.editableTabsValue = '';
      },
      // 关闭标签页
      closeTab(){
        var _t = this;
        _t.editableTabsValue = '';
        _t.editableTabs = [];
        _t.tabIndex = 0;
        _t.isShowTabBox_tab = false;
        _t.isShowTabBox = false;
      },
      // 点击标签页
      clickTabs(){
        var _t = this;
        _t.isShowTabBox = true;
        document.getElementById('alarmManagement-tabs').style.top = '118px';
      }
    },
    created() {
      // this.$store.commit('setLoading',true);
      this.getData();
    }
  }
</script>

<style scoped>
  .alarmTitleBox {
    padding: 10px;
  }

  .alarmTitleBox .title {
    font-size: 16px;
    line-height: 30px;
  }

  .alarmTitleBox .selectArr {
    margin-left: 20px;
  }

  .alarmManagement-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
<style>
  .alarmMessageBox .el-dialog {
    width: 880px;
  }

  .alarmMessageBox .el-dialog__body {
    padding-top: 10px;
  }

  .alarmMessageBox .el-form--inline .el-form-item {
    margin: 0;
  }

  #alarmManagement-tabs {
    position: fixed;
    bottom: 0;
    right: 20px;
    left: 80px;
    top: 118px;
    z-index: 1100;
  }

  #alarmManagement-tabs .el-tabs__header.is-bottom {
    margin-top: 0;
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -20px;
    background-color: gray;
  }

  #alarmManagement-tabs .el-tabs__content {
    overflow: visible;
  }
</style>
