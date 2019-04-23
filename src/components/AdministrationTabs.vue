<template>
  <div class="administration-box">
    <!--设备信息-->
    <div class="equipmentDetail-info-box">
      <div class="grayBg administration-title"><strong>{{$t('administrationTabs.equipmentInfo')}}</strong></div>
      <el-form :model="equipmentInfoList" label-width="96px" label-position="right" class="administration-info-box">
        <el-form-item :label="$t('administrationTabs.equipmentName') + '：'">{{equipmentInfoList.deviceName}}</el-form-item>
        <el-form-item :label="$t('administrationTabs.equipmentIp') + '：'">{{equipmentInfoList.ip}}</el-form-item>
        <el-form-item :label="$t('administrationTabs.equipmentModel') + '：'">{{equipmentInfoList.model}}</el-form-item>
        <el-form-item :label="$t('administrationTabs.equipmentMonitoring') + '：'">{{equipmentInfoList.manufacturer}}</el-form-item>
        <el-form-item :label="$t('administrationTabs.serialNumber') + '：'">{{equipmentInfoList.servicetag}}</el-form-item>
      </el-form>
      <div class="grayBg administration-title"><strong>{{$t('administrationTabs.equipmentAllStatus')}}</strong></div>
      <el-form label-width="96px" label-position="right" class="administration-info-box">
        <el-form-item v-for="(item,index) in equipmentAllStatus" :key="index" :label="item.name + '：'">{{item.status}}</el-form-item>
      </el-form>
    </div>
    <!--标签页-->
    <el-tabs v-model="activeName" @tab-click="clickTabs" class="monitoringDetails-header" type="card">
      <el-tab-pane :label="$t('administrationTabs.monitorDetail')" name="one">
        <div class="clearfix">
          <el-form :model="formItem" inline class="fr">
            <el-form-item>
              <el-checkbox class="monitoringDetails-checkedBox" v-model="formItem.checked" @change="changeChecked(formItem.checked)">单内容展开</el-checkbox>
            </el-form-item>
            <el-form-item style="margin-bottom: 10px;margin-right: 5px;">
              <el-select v-model="formItem.operation" @change="changeOperation(formItem.operation)">
                <el-option v-for="(item,index) in operationList" :key="index" :label="item.name" :value="item.type" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="monitoringDetailsData" :row-key="getMonitoringDetailsRowKey" :expand-row-keys="expandChange" @expand-change="expandChangeKeys" ref="table" stripe :row-class-name="getClassName" @selection-change="monitoringChange">
          <el-table-column type="expand" header-align="left" align="left">
            <!--展开行-->
            <template slot-scope="scope">
              <el-table :data="scope.row.deviceMonitorList" stripe class="monitoringDetails-innerTable" @cell-click="cellClickColumn">
                <el-table-column width="100px" :label="$t('administrationTabs.status')" header-align="left" align="left">
                  <template slot-scope="scopeInset">
                    <el-tooltip v-if="scopeInset.row.status == 11" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontError">&#xe64b;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 22" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontWarn">&#xe64f;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 33" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontSuccess">&#xe648;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 66" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontWarn">&#xe649;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 99" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontError">&#xe64a;</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column min-width="70px" prop="name" :label="$t('administrationTabs.resourceName')" header-align="left" align="left"/>
                <el-table-column min-width="150px" prop="statusText" :label="$t('administrationTabs.latestState')" header-align="left" align="left">
                  <template slot-scope="scopeInset">
                    <el-tooltip effect="dark" placement="left-start">
                      <div slot="content" style="max-width: 200px">{{scopeInset.row.statusText}}</div>
                      <span>{{scopeInset.row.statusText}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column width="160px" :label="$t('administrationTabs.updateTime')" header-align="left" align="left">
                  <template slot-scope="scopeInset">
                    <span>{{scopeInset.row.monitorTime | dateFilter}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administrationTabs.status')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.status == 11" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe64b;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 22" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe64f;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 33" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontSuccess">&#xe648;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 66" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe649;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 99" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe64a;</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('administrationTabs.resourceName')" header-align="left" align="left"/>
          <el-table-column prop="statusText" :label="$t('administrationTabs.latestState')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="left-start">
                <div slot="content" style="max-width: 200px">{{scope.row.statusText}}</div>
                <span>{{scope.row.statusText}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administrationTabs.updateTime')" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.monitorTime | dateFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column width="60px" :label="$t('public.operation')" fixed="right" header-align="left" align="left">
            <template slot-scope="scope">
              <el-button type="text">{{$t('administrationTabs.threshold')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column type="selection" fixed="right" header-align="left" align="left"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.alarmEvent')" name="two">
        <el-table :data="alarmListData" stripe class="indexTableBox" @row-click="alarmEventTableRow">
          <el-table-column width="90px" :label="$t('administrationTabs.level')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.alarmLevel == 11" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe64b;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 22" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe64f;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontSuccess">&#xe648;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe649;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe64a;</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administrationTabs.alarmStatus')" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{AlarmHandleStatus[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administrationTabs.happenTime')" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.occurrenceTime | dateFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="part" :label="$t('administrationTabs.alarmObject')" header-align="left" align="left"/>
          <el-table-column :label="$t('administrationTabs.latestState')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="left-start">
                <div slot="content" style="max-width: 200px;">{{scope.row.currentStatus}}</div>
                <span>{{scope.row.currentStatus}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.operation')" header-align="left" align="left">
            <template slot-scope="scope">
              <span>-</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <pages
          :total='optionsAlarm.total'
          :currentPage='optionsAlarm.currentPage'
          :page-size="optionsAlarm.pageSize"
          @handleSizeChangeSub="handleSizeChangeSubAlarm"
          @handleCurrentChangeSub="handleCurrentChangeAlarm"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.hardware')" name="three">硬件配置</el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.network')" name="four">网络配置</el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.manageInformation')" name="five">管理信息</el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.locationInformation')" name="six">位置信息</el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.maintenanceInformation')" name="seven">维保信息</el-tab-pane>
      <el-tab-pane :label="$t('administrationTabs.changeInformation')" name="eight">变更信息</el-tab-pane>
    </el-tabs>
    <!--设备告警详情弹出层-->
    <equipmentAlarmDetail
      ref="alarmDialog"
      :dialogVisible="dialogVisible"
      :AssetType="AssetType"
      :AlarmSeverity="AlarmSeverity"
      :AlarmHandleStatus="AlarmHandleStatus"
      @dialogVisibleStatus="dialogVisibleStatus" />
  </div>
</template>

<script>
  import Box from '../components/Box';
  import {dateFilter} from "../assets/js/filters";
  import equipmentAlarmDetail from './equipmentAlarmDetails';

  export default {
    name: "AdministrationTabs",
    components: {Box,equipmentAlarmDetail},
    data() {
      return {
        // 当前激活标签页序号
        activeName: 'one',
        equipmentInfoList:{}, // 设备基本信息
        equipmentAllStatus:[], // 设备整体状态
        monitoringDetailsData: [], // 监测管理表格数据
        monitoringDetailsCheckList:[], // 监测详情表格选中数据
        alarmListData: [], // 告警事件列表数据
        expandChange:[], // 监测详情表格手风琴默认展开单行
        AlarmHandleStatus: {}, // 处理状态
        AlarmSeverity: {}, // 告警状态
        AssetType: {}, // 设备类型
        optionsAlarm: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        },
        dialogVisible:false, // 点击告警事件行弹出蒙版层
        // 监测详情表单
        formItem:{
          status:'',
          operation:null,
          checked:true
        },
        statusList:[], // 监测详情表单筛选下拉框数据
        operationList:[], // 监测详情 表单筛选 操作下拉框数据
      }
    },
    props: {
      // 页面Id 用于接口请求数据
      pageDeviceId: {
        type: String
      }
    },
    methods: {
      // 监测详情最细一级单元格的点击
      cellClickColumn(row,column){
        var _t = this;
        if (column.label === _t.$t('administrationTabs.status')) {
          console.log(row);
          // if (row.id !== null) {
          //   _t.addEdit.id = row.id;
          //   _t.dialogVisible = true;
          //   // 父组件调用 子组件 获取数据的方法
          //   _t.$refs.alarmDialog.getData(_t.addEdit.id);
          // }
        }
      },
      changeChecked(val){
        var _t = this;
        if (val === true) {
          _t.expandChange = [];
        }
      },
      // 监测详情列表设置 行id
      getMonitoringDetailsRowKey(row){
        return row.id;
      },
      // 控制监测详情是否单行展开
      expandChangeKeys(row){
        var _t = this;
        if (_t.formItem.checked) {
          _t.expandChange = [];
          _t.expandChange[0] = row.id;
        }
      },
      // 监测详情批量操作提交
      changeOperation(val){
        var _t = this;
        if (val !== null) {
          _t.$api.post('monitor/deviceMonitorAttr/execute',{
            option:val,
            isDevice:false,
            ids:_t.monitoringDetailsCheckList
          },function (res) {
            switch (res.status) {
              case 200:
                _t.getMonitorData();
                _t.formItem.operation = null;
                _t.$message({
                  dangerouslyUseHTMLString: true,
                  message: "<span class='iconfont iconfontSuccess'>&#xe648;</span> 提交成功",
                  customClass:'messageBoxSuccess',
                  duration:2000
                });
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              default:
                _t.formItem.operation = null;
                _t.$message({
                  dangerouslyUseHTMLString: true,
                  message: "<span class='iconfont iconfontError'>&#xe64e;</span> 提交失败",
                  customClass:'messageBoxError',
                  duration:2000
                });
                break;
            }
          });
        }
      },
      // 获取监测详情表格选中的数据
      monitoringChange(data){
        var _t = this;
        var dataList = new Array();
        data.forEach((item)=>{
          if (item.deviceId !== null) {
            dataList.push(item.id);
          }
        });
        _t.monitoringDetailsCheckList = dataList;
      },
      // 点击告警事件 行
      alarmEventTableRow(row){
        var _t = this;
        _t.dialogVisible = true;
        // 父组件调用 子组件 获取数据的方法
        _t.$refs.alarmDialog.getData(row.id);
      },
      // 接受设备信息蒙版层返回的状态
      dialogVisibleStatus(val){
        this.dialogVisible = val;
      },
      // 控制某些状态下的表格不展开行
      getClassName({row, rowIndex}) {
        return row.deviceMonitorList.length == 0 ? 'expendTable' : '';
      },
      // 请求设备基本信息
      getEquipmentInfoData() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('monitor/deviceMonitorAttr/baseinfo/' + _t.pageDeviceId,{},function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.equipmentInfoList = res.data;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.equipmentInfoList = {};
              break;
          }
        });
      },
      // 获取设备整体状态列表
      getEquipmentAllStatusData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('monitor/deviceMonitorAttr/overallstatus/' + _t.pageDeviceId,{},function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.equipmentAllStatus = res.data;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.equipmentAllStatus = {};
              break;
          }
        });
      },
      // 获取监测详情的接口数据
      getMonitorData() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('monitor/deviceMonitor/all', {
          jsonString: JSON.stringify({
            deviceMonitor: {
              parentId: '0',
              deviceId: _t.pageDeviceId,
            }
          })
        }, function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.monitoringDetailsData = res.data;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.monitoringDetailsData = [];
              break;
          }
        });
      },
      // 获取告警事件列表的接口数据
      getAlarmListData() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('alarm/alarm/pagelist', {
          jsonString: JSON.stringify({
            alarm: {
              deviceId: _t.pageDeviceId
            },
            page: {
              currentPage: _t.optionsAlarm.currentPage,
              pageSize: _t.optionsAlarm.pageSize
            }
          })
        }, function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.alarmListData = res.data.list;
              _t.optionsAlarm.total = res.data.page.totalResultSize;
              _t.optionsAlarm.currentPage = res.data.currentPage;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.alarmListData = [];
              break;
          }
        });
      },
      // 获取状态字典
      getStatusDataBase() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/map', {
          dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity"],
          languageMark: localStorage.getItem("hy-language")
        }, function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.AlarmHandleStatus = res.data.AlarmHandleStatus;
              _t.AssetType = res.data.AssetType;
              _t.AlarmSeverity = res.data.AlarmSeverity;
              console.log(_t.AlarmSeverity)
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.AlarmHandleStatus = {};
              _t.AssetType = {};
              _t.AlarmSeverity = {};
              break;
          }
        });
      },
      // 点击页签时
      clickTabs(tab) {
        var _t = this;
        if (tab.name === 'one') {
          // 点击监测详情 获取表格数据
          _t.getMonitorData();
        } else if (tab.name === 'two') {
          // 点击告警事件 获取表格数据
          _t.getAlarmListData();
        } else {

        }
      },
      // 改变当前页码
      handleCurrentChangeAlarm(val) {
        var _t = this;
        _t.optionsAlarm.currentPage = val;
        _t.getAlarmListData();
      },
      // 改变每页显示条数
      handleSizeChangeSubAlarm(val) {
        var _t = this;
        _t.optionsAlarm.pageSize = val;
        _t.getAlarmListData();
      },
      // 获取监测管理批量操作数据接口
      getOperationList(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/maplist',{
          dictionaryTypes:['WorkStatus'],
          languageMark: localStorage.getItem('hy-language')
        },function (res) {
          _t.$store.commit('setLoading',true);
          switch (res.status) {
            case 200:
              var operationList = new Array();
              res.data.WorkStatus.forEach((item)=>{
                // 过滤 数据
                if (item.type === '47') {} else if (item.type === '48') {}
                else {
                  operationList.push(item);
                }
              });
              operationList.unshift({name:'批量操作',type:null});
              _t.operationList = operationList;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              break;
          }
        });
      }
    },
    created() {
      this.getStatusDataBase();
      this.getEquipmentInfoData();
      this.getEquipmentAllStatusData();
      this.getMonitorData();
      this.getOperationList();
    }
  }
</script>

<style scoped>
  .equipmentDetail-info-box {
    width: 300px;
  }

  .administration-title {
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    padding-left: 10px;
  }

  .administration-box {
    position: absolute;
    top: 30px;
    left: 20px;
    right: 20px;
    bottom: 0;
  }
</style>
<style>
  .administration-box .box-wrap {
    padding: 30px 10px 0 10px;
    position: absolute;
  }

  .administration-info-box .el-form-item {
    font-size: 12px;
    margin-bottom: 0;
  }

  .expendTable .el-table__expand-column .cell {
    display: none;
  }

  /*标签页头部*/
  .monitoringDetails-header.el-tabs--card > .el-tabs__header {
    position: absolute;
    top: 0;
    left: 310px;
    right: 0;
    padding-top: 5px;
  }

  .monitoringDetails-header.el-tabs--card > .el-tabs__content {
    position: absolute;
    top: 50px;
    bottom: 10px;
    left: 310px;
    right: 0;
    overflow-y: auto;
  }

  .monitoringDetails-header .el-tabs__header.is-top .el-tabs__nav-scroll {
    padding: 0 20px;
  }

  .monitoringDetails-header .el-tabs__header .el-tabs__item.is-active {
    border-radius: 10px 10px 0 0;
    position: relative;
  }

  .monitoringDetails-header .el-tabs__header .el-tabs__item.is-active:before,
  .monitoringDetails-header .el-tabs__header .el-tabs__item.is-active:after {
    position: absolute;
    content: '';
    display: inline-block;
    bottom: 2px;
    width: 10px;
    height: 10px;
  }

  .monitoringDetails-header .el-tabs__header .el-tabs__item.is-active:before {
    border-radius: 0 0 10px 0;
    left: -10px;
  }

  .monitoringDetails-header .el-tabs__header .el-tabs__item.is-active:after {
    border-radius: 0 0 0 10px;
    right: -10px;
  }

  .monitoringDetails-header .el-tabs__header.is-top .el-tabs__item {
    height: 35px;
    line-height: 35px;
    font-size: 12px;
  }
</style>
