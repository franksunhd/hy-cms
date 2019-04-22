<template>
  <div class="administration-box">
    <!--设备信息-->
    <div class="equipmentDetail-info-box">
      <div class="grayBg administration-title"><strong>设备基本信息</strong></div>
      <el-form :model="equipmentInfoList" label-width="96px" label-position="right" class="administration-info-box">
        <el-form-item label="设备名称：">{{equipmentInfoList.deviceName}}</el-form-item>
        <el-form-item label="设备IP：">{{equipmentInfoList.ip}}</el-form-item>
        <el-form-item label="型号：">{{equipmentInfoList.model}}</el-form-item>
        <el-form-item label="设备厂商：">{{equipmentInfoList.manufacturer}}</el-form-item>
        <el-form-item label="序列号：">{{equipmentInfoList.servicetag}}</el-form-item>
      </el-form>
      <div class="grayBg administration-title"><strong>设备整体状态</strong></div>
      <el-form label-width="96px" label-position="right" class="administration-info-box">
        <el-form-item v-for="(item,index) in equipmentAllStatus" :key="index" :label="item.name + '：'">{{item.status}}</el-form-item>
      </el-form>
    </div>
    <!--标签页-->
    <el-tabs v-model="activeName" @tab-click="clickTabs" class="monitoringDetails-header" type="card">
      <el-tab-pane label="监测详情" name="one">
        <el-table :data="monitoringDetailsData" ref="table" stripe :row-class-name="getClassName">
          <el-table-column type="expand" header-align="left" align="left">
            <!--展开行-->
            <template slot-scope="scope">
              <el-table :data="scope.row.deviceMonitorList" stripe>
                <el-table-column label="状态" header-align="left" align="left">
                  <template slot-scope="scopeInset">
                    <el-tooltip v-if="scopeInset.row.status == 11" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontError">&#xe60b;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 22" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontWarn">&#xe60a;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 33" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontSuccess">&#xe618;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 66" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontWarn">&#xe608;</span>
                    </el-tooltip>
                    <el-tooltip v-if="scopeInset.row.status == 99" effect="dark"
                                :content="AlarmSeverity[scopeInset.row.status]" placement="top-start">
                      <span class="iconfont iconfontError">&#xe609;</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="资源名称" header-align="left" align="left"/>
                <el-table-column prop="statusText" label="最新状态" header-align="left" align="left"/>
                <el-table-column label="更新时间" header-align="left" align="left">
                  <template slot-scope="scopeInset">
                    <span>{{scopeInset.row.monitorTime | dateFilter}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="selection" header-align="left" align="left"/>
          <el-table-column label="状态" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.status == 11" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe60b;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 22" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe60a;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 33" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontSuccess">&#xe618;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 66" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe608;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status == 99" effect="dark" :content="AlarmSeverity[scope.row.status]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe609;</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="资源名称" header-align="left" align="left"/>
          <el-table-column prop="statusText" label="最新状态" header-align="left" align="left"/>
          <el-table-column label="更新时间" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.monitorTime | dateFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="left" align="left">
            <template slot-scope="scope">
              <el-button type="text">阈值</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="告警事件" name="two">
        <el-table :data="alarmListData" stripe class="indexTableBox">
          <el-table-column label="级别" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.alarmLevel == 11" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe60b;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 22" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe60a;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontSuccess">&#xe618;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontWarn">&#xe608;</span>
              </el-tooltip>
              <el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark" :content="AlarmSeverity[scope.row.alarmLevel]"
                          placement="top-start">
                <span class="iconfont iconfontError">&#xe609;</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="告警状态" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{AlarmHandleStatus[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发生时间" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.occurrenceTime | dateFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="part" label="告警对象" header-align="left" align="left"/>
          <el-table-column prop="currentStatus" label="最新状态" header-align="left" align="left"/>
          <el-table-column label="操作" header-align="left" align="left">
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
      <el-tab-pane label="硬件配置" name="three">硬件配置</el-tab-pane>
      <el-tab-pane label="网络配置" name="four">网络配置</el-tab-pane>
      <el-tab-pane label="管理信息" name="five">管理信息</el-tab-pane>
      <el-tab-pane label="位置信息" name="six">位置信息</el-tab-pane>
      <el-tab-pane label="维保信息" name="seven">维保信息</el-tab-pane>
      <el-tab-pane label="变更信息" name="eight">变更信息</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Box from '../components/Box';
  import {dateFilter} from "../assets/js/filters";

  export default {
    name: "AdministrationTabs",
    components: {Box},
    data() {
      return {
        // 当前激活标签页序号
        activeName: 'one',
        equipmentInfoList:{}, // 设备基本信息
        equipmentAllStatus:[], // 设备整体状态
        monitoringDetailsData: [], // 监测管理表格数据
        alarmListData: [], // 告警事件列表数据
        AlarmHandleStatus: {}, // 处理状态
        AlarmSeverity: {}, // 告警状态
        AssetType: {}, // 设备类型
        optionsAlarm: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        }
      }
    },
    props: {
      // 页面Id 用于接口请求数据
      pageDeviceId: {
        type: String
      }
    },
    methods: {
      // 控制某些状态下的表格不展开行
      getClassName({row, rowIndex}) {
        return row.status == 1 ? 'expendTable' : '';
      },
      // 请求设备基本信息
      getEquipmentInfoData() {
        var _t = this;
        _t.$api.get('monitor/deviceMonitorAttr/baseinfo/' + _t.pageDeviceId,{},function (res) {
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
        _t.$api.get('monitor/deviceMonitorAttr/overallstatus/' + _t.pageDeviceId,{},function (res) {
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
        _t.$api.get('monitor/deviceMonitor/all', {
          jsonString: JSON.stringify({
            deviceMonitor: {
              parentId: '0',
              deviceId: _t.pageDeviceId,
            }
          })
        }, function (res) {
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
        _t.$api.post('system/basedata/map', {
          dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity"],
          languageMark: localStorage.getItem("hy-language")
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.AlarmHandleStatus = res.data.AlarmHandleStatus;
              _t.AssetType = res.data.AssetType;
              _t.AlarmSeverity = res.data.AlarmSeverity;
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
    },
    created() {
      this.getStatusDataBase();
      this.getEquipmentInfoData();
      this.getEquipmentAllStatusData();
      this.getMonitorData();
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

  #administration-tabs-title {
    padding: 5px 10px 0;
    margin-bottom: 16px;
  }

  #administration-tabs-title li {
    width: 100px;
    text-align: center;
    height: 34px;
    line-height: 34px;
    float: left;
    cursor: pointer;
  }

  #administration-tabs-title li > span {
    width: 100%;
    display: inline-block;
    line-height: 20px;
    height: 20px;
    border-right: 1px solid #ddd;
  }

  #administration-tabs-title li.active > span {
    border-right: 0;
  }

  #administration-tabs-title li.active {
    color: #409EFF;
    background-color: #fff;
    border-radius: 10px 10px 0 0;
    position: relative;
  }

  #administration-tabs-title li.active::before,
  #administration-tabs-title li.active::after {
    display: inline-block;
    width: 10px;
    height: 10px;
    content: '';
    position: absolute;
    bottom: 0;
    overflow: hidden;
  }

  #administration-tabs-title li.active::before {
    left: -10px;
    overflow: hidden;
    border-radius: 0 0 10px 0;
  }

  #administration-tabs-title li.active::after {
    right: -10px;
    border-radius: 0 0 0 10px;
  }
</style>
<style>
  .administration-box .box-wrap {
    padding: 30px 10px 0 10px;
    position: absolute;
  }

  .administration-box {
    position: absolute;
    top: 30px;
    left: 20px;
    right: 20px;
    bottom: 0;
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
    background-color: #f0f0f0;
    position: absolute;
    top: 0;
    left: 310px;
    right: 0;
  }

  .monitoringDetails-header.el-tabs--card > .el-tabs__content {
    position: absolute;
    top: 50px;
    bottom: 10px;
    left: 310px;
    right: 0;
    overflow-y: auto;
  }
</style>
