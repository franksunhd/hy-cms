<template>
  <div class="administration-box">
    <!--设备信息-->
    <div class="equipmentDetail-info-box">
      <div class="grayBg administration-title"><strong>{{$t('administrationTabs.equipmentInfo')}}</strong></div>
      <el-form label-width="96px" label-position="right" class="administration-info-box">
        <el-form-item v-for="(item,index) in equipmentInfoList" :key="index" :label="item.label + '：'" :title="item.value">{{item.value}}</el-form-item>
      </el-form>
      <div class="grayBg administration-title"><strong>{{$t('administrationTabs.equipmentAllStatus')}}</strong></div>
      <el-form label-width="96px" label-position="right" class="administration-info-box">
        <el-form-item v-for="(item,index) in equipmentAllStatus" :key="index" :label="item.name + '：'" :title="item.status">{{item.status}}</el-form-item>
      </el-form>
    </div>
    <!--标签页-->
    <el-tabs v-model="activeNameTabs" @tab-click="clickTabs" class="monitoringDetails-header" type="card">
      <!--监测详情-->
      <el-tab-pane :label="$t('administrationTabs.monitorDetail')" name="one">
        <div class="clearfix" style="padding-top: 10px;">
          <el-form inline class="fl marginBottom10">
            <el-form-item v-if="AlarmSeverity[item.key] !== undefined" v-for="(item,index) in monitorStatusArr" :key="index">
              <el-tooltip effect="dark" :content="AlarmSeverity[item.key]" placement="top-start">
                <el-button type="text" style="color: #666;" @click="screenAlarmStatus(item.key)">
                  <span v-if="item.key == 11" class="iconfont iconfontError">&#xe64b;</span>
                  <span v-if="item.key == 22" class="iconfont iconfontDisable">&#xe64f;</span>
                  <span v-if="item.key == 66" class="iconfont iconfontWarn">&#xe649;</span>
                  <span v-if="item.key == 99" class="iconfont iconfontError">&#xe64a;</span>
                  <span>{{item.value}}</span>
                </el-button>
              </el-tooltip>
            </el-form-item>
            <!--字典没有返回 从批量操作中获取-->
            <el-form-item v-if="item.key == 38" v-for="(item,index) in monitorStatusArr" :key="index">
              <el-tooltip effect="dark" :content="WorkStatus['38']" placement="top-start">
                <el-button type="text" style="color: #666;" @click="screenAlarmStatus('38')">
                  <span class="iconfont iconfontDisable">&#xe644;</span>
                  <span>{{item.value}}</span>
                </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
          <el-form :model="formItem" inline class="fr marginBottom10">
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
        <el-table
          :data="monitoringDetailsData"
          :row-key="getMonitoringDetailsRowKey"
          :expand-row-keys="expandChange"
          @expand-change="expandChangeKeys"
          ref="table"
          @cell-click="cellClickColumnTable"
          stripe
					border
          :row-class-name="getClassName"
          @selection-change="monitoringChange">
          <el-table-column type="expand" header-align="left" align="left">
            <!--展开行-->
            <template slot-scope="scope">
              <el-table :data="scope.row.deviceMonitorListArr" border stripe class="monitoringDetails-innerTable" @cell-click="cellClickColumn">
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
          <el-table-column :label="$t('administrationTabs.latestState')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="left-start">
                <div slot="content" style="max-width: 200px">
                  <span v-if="scope.row.resultConcentStatus == 1">{{scope.row.resultConcent}}</span>
                  <span v-else-if="scope.row.resultConcentStatus == 2">
                  <span v-for="(x,y) in scope.row.resultConcent" :key="y">
                    <span v-if="x.key == null">{{x.value}}</span>
                    <span v-else-if="x.key !== '33'">{{x.value}}个</span>
                    <span v-if="x.key == null">个对象</span>
                    <span v-else-if="x.key !== '33'">{{AlarmSeverity[x.key]}}</span>
                    &nbsp;
                  </span>
                </span>
                  <span v-else>{{scope.row.statusText}}</span>
                </div>
                <span v-if="scope.row.resultConcentStatus == 1" class="iconfontSuccess">{{scope.row.resultConcent}}</span>
                <span v-else-if="scope.row.resultConcentStatus == 2">
                  <span v-for="(x,y) in scope.row.resultConcent" :key="y">
                    <span class="iconfontSuccess" v-if="x.key == null">{{x.value}}</span>
                    <span class="iconfontError" v-else-if="x.key !== '33'">{{x.value}}个</span>
                    <span class="iconfontSuccess" v-if="x.key == null">个对象</span>
                    <span class="iconfontError" v-else-if="x.key !== '33'">{{AlarmSeverity[x.key]}}</span>
                    &nbsp;
                  </span>
                </span>
                <span v-else>{{scope.row.statusText}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administrationTabs.updateTime')" header-align="left" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.monitorTime | dateFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column width="60px" :label="$t('public.operation')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-button type="text">{{$t('administrationTabs.threshold')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column type="selection" header-align="left" align="left"/>
        </el-table>
      </el-tab-pane>
      <!--告警事件-->
      <el-tab-pane :label="$t('administrationTabs.alarmEvent')" name="two">
        <el-form :model="alarmEvent" inline style="padding-top: 10px;">
          <el-form-item style="margin-right: 40px;">
            <el-radio-group v-model="alarmEvent.alarmIsHistory">
              <el-radio :label="false">当前告警</el-radio>
              <el-radio :label="true">历史告警</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('alarmCurrent.alarmLevelText') + '：'">
            <el-select v-model="alarmEvent.status" class="width200">
              <el-option v-for="(item,index) in alarmEventList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('public.happenTime') + '：'">
            <el-date-picker
              v-model="alarmEvent.dateTime"
              type="daterange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTime')"
              :end-placeholder="$t('public.endTime')"
              :placeholder="$t('public.selectDate')"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="queryBtn" @click="getAlarmListData">{{$t('public.query')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="alarmListData" border stripe class="indexTableBox" @row-click="alarmEventTableRow">
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
      <!--硬件配置-->
      <el-tab-pane :label="$t('administrationTabs.hardware')" name="three">硬件配置</el-tab-pane>
      <!--网络配置-->
      <el-tab-pane :label="$t('administrationTabs.network')" name="four">网络配置</el-tab-pane>
      <!--管理信息-->
      <el-tab-pane :label="$t('administrationTabs.manageInformation')" name="five">管理信息</el-tab-pane>
      <!--位置信息-->
      <el-tab-pane :label="$t('administrationTabs.locationInformation')" name="six">位置信息</el-tab-pane>
      <!--维保信息-->
      <el-tab-pane :label="$t('administrationTabs.maintenanceInformation')" name="seven">维保信息</el-tab-pane>
      <!--变更信息-->
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
    <el-dialog
      class="alarmAdministrationTabs-dialog"
      title="设备状态信息"
      append-to-body
      :visible.sync="dialogVisible_info"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table :data="informationInfoList" border stripe :show-header="false">
        <el-table-column prop="key" />
        <el-table-column prop="value" />
      </el-table>
      <span slot="footer">
        <el-button type="primary" class="alertBtn" @click="dialogVisible_info = false">{{$t('public.confirm')}}</el-button>
        <el-button type="default" class="alertBtn" @click="dialogVisible_info = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Box from '../components/Box';
  import {dateFilter,dateFilterDay} from "../assets/js/filters";
  import equipmentAlarmDetail from './equipmentAlarmDetails';

  export default {
    name: "AdministrationTabs",
    components: {Box,equipmentAlarmDetail},
    data() {
      return {
        activeNameTabs:this.activeName, // 用于接收标签页序号 默认从组建接收 切换时进行数据绑定
        equipmentInfoList:{}, // 设备基本信息
        equipmentAllStatus:[], // 设备整体状态
        monitoringDetailsData: [], // 监测管理表格数据
        monitoringDetailsDataCache:[], // 缓存的监测管理的原始数据
        monitoringDetailsCacheData:[], // 缓存的监测管理的过滤数据 用于状态筛选的数据回显
        monitoringDetailsCheckList:[], // 监测详情表格选中数据
        monitorStatusArr:[],// 监测详情状态统计集合
        alarmListData: [], // 告警事件列表数据
        expandChange:[], // 监测详情表格手风琴默认展开单行
        informationInfoList:[], // 设备信息详情
        AlarmHandleStatus: {}, // 处理状态
        AlarmSeverity: {}, // 告警状态
        AssetType: {}, // 设备类型
        WorkStatus:{}, // 监测筛选状态集合
        optionsAlarm: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        },
        dialogVisible:false, // 点击告警事件行弹出蒙版层
        dialogVisible_info:false, // 控制设备状态信息弹出层的显示隐藏
        // 监测详情表单
        formItem:{
          status:'',
          operation:null, // 批量操作
          checked:true, // 单内容是否展开
        },
        // 告警事件表单
        alarmEvent:{
          alarmIsHistory:false, // 区分当前告警和历史告警单选按钮
          status:null, // 告警级别筛选
          dateTime:null, // 告警发生日期
        },
        statusList:[], // 监测详情表单筛选下拉框数据
        operationList:[], // 监测详情 表单筛选 操作下拉框数据
        monitorChecked:{ // 监测详情筛选按钮 选中与否
          pauseBtn:false, // 暂停是否点击过
          ignoreBtn:false, // 忽略是否点击过
          warnBtn:false, // 警告是否点击过
          emergencyBtn:false, // 紧急是否点击过
          notShowBtn:false, // 页面不显示是否点击过
        },
        alarmEventList:[], // 告警事件 告警级别下拉框
      }
    },
    props: {
      // 接收设备Id 用于接口请求数据
      pageDeviceId: {
        type: String
      },
      // 接收标签页激活序号
      activeName:{
        type:String,
        default:'one'
      }
    },
    methods: {
      // 点击监测详情状态筛选
      screenAlarmStatus(status) {
        var _t = this;
        // 判断筛选按钮是否点过
        if (status == 11) { // 暂停
          _t.monitorChecked.pauseBtn = !_t.monitorChecked.pauseBtn;
          _t.monitorChecked.ignoreBtn = false;
          _t.monitorChecked.warnBtn = false;
          _t.monitorChecked.emergencyBtn = false;
          _t.monitorChecked.notShowBtn = false;
          if (_t.monitorChecked.pauseBtn) {
            // 选中 需要过滤数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'status',status);
          } else {
            // 取消选中 加载全部数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'isAlone',true);
          }
        } else if (status == 22) { // 忽略
          _t.monitorChecked.ignoreBtn = !_t.monitorChecked.ignoreBtn;
          _t.monitorChecked.pauseBtn = false;
          _t.monitorChecked.warnBtn = false;
          _t.monitorChecked.emergencyBtn = false;
          _t.monitorChecked.notShowBtn = false;
          if (_t.monitorChecked.ignoreBtn) {
            // 选中 需要过滤数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'status',status);
          } else {
            // 取消选中 加载全部数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'isAlone',true);
          }
        } else if (status == 66) { // 警告
          _t.monitorChecked.warnBtn = !_t.monitorChecked.warnBtn;
          _t.monitorChecked.pauseBtn = false;
          _t.monitorChecked.ignoreBtn = false;
          _t.monitorChecked.emergencyBtn = false;
          _t.monitorChecked.notShowBtn = false;
          if (_t.monitorChecked.warnBtn) {
            // 选中 需要过滤数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'status',status);
          } else {
            // 取消选中 加载全部数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'isAlone',true);
          }
        } else if (status == 99) { // 紧急
          _t.monitorChecked.emergencyBtn = !_t.monitorChecked.emergencyBtn;
          _t.monitorChecked.pauseBtn = false;
          _t.monitorChecked.ignoreBtn = false;
          _t.monitorChecked.warnBtn = false;
          _t.monitorChecked.notShowBtn = false;
          if (_t.monitorChecked.emergencyBtn) {
            // 选中 需要过滤数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'status',status);
          } else {
            // 取消选中 加载全部数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'isAlone',true);
          }
        } else if (status == 38) { // 页面不显示
          _t.monitorChecked.notShowBtn = !_t.monitorChecked.notShowBtn;
          _t.monitorChecked.pauseBtn = false;
          _t.monitorChecked.ignoreBtn = false;
          _t.monitorChecked.warnBtn = false;
          _t.monitorChecked.emergencyBtn = false;
          if (_t.monitorChecked.notShowBtn) {
            // 选中 需要过滤数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'isAlone',false);
          } else {
            // 取消选中 加载全部数据
            _t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache,'isAlone',true);
          }
        }
      },
      // 过滤监测数据
      filterMonitorTableData(treeData,valField,val){
        var _t = this;
        var monitorArr = new Array();
        // 遍历一级
        treeData.forEach((item)=>{
          // nodeType = 1 最细一级 符合条件就添加进数组
          if (item.nodeType === 1) {
            if (item[valField] == val) {
              monitorArr.push(item);
            }
          } else {
            // nodeType = 0 目录级别 一级符合条件 先记录一级 然后遍历二级
            if (item[valField] == val) {
              // 先记录一下一级 同时查看二级有没有 符合条件的数据
              var monitorLevelFirst = item;
              var monitorLevelFirstArr = new Array();
              monitorLevelFirst.deviceMonitorList.forEach((innerData)=>{
                if (innerData[valField] == val) {
                  monitorLevelFirstArr.push(innerData);
                }
              });
              item.deviceMonitorListArrStart = monitorLevelFirstArr;
              monitorArr.push(item);
            } else {
              // 一级不符合条件 遍历二级 二级没有 不加 二级有符合数据 拿到二级数据集合 拿到一级 把一级存到 monitorArr
              var monitorLevelFirst = item;
              var monitorLevelFirstArr = new Array();
              monitorLevelFirst.deviceMonitorList.forEach((innerData)=>{
                if (innerData[valField] == val) {
                  monitorLevelFirstArr.push(innerData);
                }
              });
              item.deviceMonitorListArrStart = monitorLevelFirstArr;
              if (item.deviceMonitorListArrStart.length !== 0) {
                monitorArr.push(item);
              }
            }
          }
        });
        return _t.switchMonitoringDetailsData(monitorArr);
      },
      // 转换监测详情接口json字符串 treeData 需要转换的数据
      switchMonitoringDetailsData(treeData){
        treeData.forEach((item)=>{
          // 转换一级可展开的最新状态 nodeType 0 目录 可展开
          if (item.nodeType === 0) {
            var monitorArr = new Array();
            var monitorList = JSON.parse(item.statusText);
            for (var key in monitorList) {
              var objArr = new Object();
              objArr.key = key;
              objArr.value = monitorList[key];
              monitorArr.push(objArr);
            }
            if (monitorArr.length === 1 && monitorArr[0].key === '33') {
              // 全部正常 状态为1
              item.resultConcentStatus = 1;
              item.resultConcent = monitorArr[0].value + '个对象全部正常';
            } else {
              // 多种状态 为2
              item.resultConcentStatus = 2;
              var monitorArrNumber = 0;
              monitorArr.forEach((val)=>{
                monitorArrNumber += val.value;
              });
              monitorArr.unshift({key:null,value:monitorArrNumber});
              item.resultConcent = monitorArr;
            }
          } else {
            // nodeType == 1 最细一级 转换 result
            item.resultConcentArr = JSON.parse(item.result);
            var listArr = new Array();
            for (var key in item.resultConcentArr) {
              var obj = new Object();
              obj.key = key;
              obj.value = item.resultConcentArr[key];
              listArr.push(obj);
            }
            item.resultConcentParse = listArr;
          }
          // 转换二级 最新状态参数
          if (item.nodeType === 0) {
            // 子集循环 (二级)
            item.deviceMonitorListArrStart.forEach((val)=>{
              // json串
              val.resultConcent = JSON.parse(val.result);
              var listArr = new Array();
              for (var key in val.resultConcent) {
                var obj = new Object();
                obj.key = key;
                obj.value = val.resultConcent[key];
                listArr.push(obj);
              }
              val.resultConcentParse = listArr;
            });
          }
          item.deviceMonitorListArr = item.deviceMonitorListArrStart;
        });
        return treeData;
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
              // 缓存接口全部数据 用于前端筛选
              _t.monitoringDetailsDataCache = res.data;
              // 过滤不显示的数据 返回显示的数据
              _t.monitoringDetailsData = _t.filterMonitorTableData(res.data,'isAlone',true);
              _t.monitoringDetailsCacheData = _t.monitoringDetailsData;
              // 状态统计
              _t.getMonitoringDetail(_t.pageDeviceId);
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
      // 监测详情最细一级单元格的点击 第一层
      cellClickColumnTable(row,column){
        var _t = this;
        // 点击状态
        // if (column.label === _t.$t('administrationTabs.status') || column.label === _t.$t('administrationTabs.latestState')) {
        //   // 第一层 id不为空 非正常状态 !33 nodeType:1 非目录不可展开
        //   if (row.id !== null && row.status != '33' && row.nodeType === 1) {
        //     _t.dialogVisible = true;
        //     // 父组件调用 子组件 获取数据的方法
        //     _t.$refs.alarmDialog.getData(row.id,false);
        //   }
        // }
        // 点击资源名称
        if (column.label === _t.$t('administrationTabs.resourceName')) {
          // 最细一级 nodeType 不能展开
          if (row.nodeType === 1)  {
            _t.dialogVisible_info = true;
            _t.informationInfoList = row.resultConcentParse;
          }
        }
      },
      // 监测详情最细一级单元格的点击 第二层
      cellClickColumn(row,column){
        var _t = this;
        // 点击状态 或 最新状态
        // if (column.label === _t.$t('administrationTabs.status') || column.label === _t.$t('administrationTabs.latestState')) {
        //   // 第二层 id不为空 非正常状态 !33 nodeType:1 非目录不可展开
        //   if (row.id !== null && row.status != '33' && row.nodeType === 1) {
        //     _t.dialogVisible = true;
        //     // 父组件调用 子组件 获取数据的方法
        //     _t.$refs.alarmDialog.getData(row.id,false);
        //   }
        // }
        // 点击资源名称
        if (column.label === _t.$t('administrationTabs.resourceName')) {
          // 最细一级 nodeType 不能展开
          if (row.nodeType === 1) {
            _t.dialogVisible_info = true;
            _t.informationInfoList = row.resultConcentParse;
          }
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
          if (_t.expandChange.length === 0) {
            // 展开
            _t.expandChange = [];
            _t.expandChange[0] = row.id;
          } else if (_t.expandChange.length !== 0 && row.id === _t.expandChange[0]) {
            // 关闭 当前
            _t.expandChange = [];
          } else {
            // 关闭其他 展开当前
            _t.expandChange = [];
            _t.expandChange[0] = row.id;
          }
        }
      },
      // 单内容展开 改为true 清空展开的
      changeChecked(val){
        var _t = this;
        if (val === true) {
          _t.expandChange = [];
        }
      },
      // 监测详情批量操作提交
      changeOperation(val){
        var _t = this;
        // 选中非 批量操作的 项
        if (val !== null && _t.monitoringDetailsCheckList.length !== 0) {
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
        } else {
					_t.$alert('请勾选需要操作的行!', _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass: 'alertBtn'
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
        _t.$refs.alarmDialog.getData(row.id,_t.alarmEvent.alarmIsHistory);
      },
      // 接受设备信息蒙版层返回的状态
      dialogVisibleStatus(val){
        var _t = this;
        _t.dialogVisible = val;
        // 告警关闭 当前告警重新 调取表格数据
        if (_t.alarmEvent.alarmIsHistory === false) {
          // 当前告警
          _t.getAlarmListData();
        }
      },
      // 控制某些状态下的表格不展开行
      getClassName({row, rowIndex}) {
        return row.nodeType === 1 ? 'expendTable' : '';
      },
      // 请求设备基本信息
      getEquipmentInfoData() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('monitor/deviceMonitorAttr/baseinfo/' + _t.pageDeviceId,{},function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              var result = new Array();
              for (var key in res.data) {
                var obj = new Object();
                obj.label = key;
                obj.value = res.data[key];
                result.push(obj);
              }
              _t.equipmentInfoList = result;
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
      // 获取监测详情状态统计
      getMonitoringDetail(val){
        var _t = this;
        _t.$api.get('monitor/deviceMonitor/countStatus/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              var monitorStatusArr = new Array();
              for (var key in res.data) {
                if (key != '33') {
                  var obj = new Object();
                  obj.key = key;
                  obj.value = res.data[key];
                  monitorStatusArr.push(obj);
                }
              }
              _t.monitorStatusArr = monitorStatusArr;
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
      },
      // 获取告警事件列表的接口数据
      getAlarmListData() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        var url = 'alarm/alarmHistory/pagelist';
        if (_t.alarmEvent.alarmIsHistory) {
          // 历史告警
          url = 'alarm/alarmHistory/pagelist';
        } else {
          // 当前告警
          url = 'alarm/alarm/pagelist'
        }
        _t.$api.get(url, {
          jsonString: JSON.stringify({
            alarm: {
              deviceId: _t.pageDeviceId,
              alarmLevel:_t.alarmEvent.status,
              ocrStartTime:_t.alarmEvent.dateTime == null ? null : dateFilterDay(_t.formItem.dateTime[0].getTime()),
              ocrEndTime:_t.alarmEvent.dateTime == null ? null : dateFilterDay(_t.formItem.dateTime[1].getTime()),
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
              _t.optionsAlarm.currentPage = res.data.page.currentPage;
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
              // 给告警事件中告警级别下拉框加数据
              _t.alarmEventList.unshift({
                value:null,
                label:_t.$t('public.all')
              });
              for (var key in _t.AlarmSeverity){
                if (key == '66' || key == '99') {
                  _t.alarmEventList.push({
                    value:key,
                    label:_t.AlarmSeverity[key]
                  });
                }
              }

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
      // 获取监测管理批量操作数据接口 map
      getOperationMap(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/map',{
          dictionaryTypes:['WorkStatus'],
          languageMark: localStorage.getItem('hy-language')
        },function (res) {
          _t.$store.commit('setLoading',true);
          switch (res.status) {
            case 200:
              // 转换 list map
              var WorkStatus = new Array();
              for (var key in res.data.WorkStatus){
                if (key == '47' || key == '48') {} else {
                  WorkStatus.push({name:res.data.WorkStatus[key],type:key})
                }
              }
              WorkStatus.unshift({name:'批量操作',type:null});
              _t.operationList = WorkStatus;
              // 字典key:value
              _t.WorkStatus = res.data.WorkStatus;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.WorkStatus = {};
              _t.operationList = [{name:'批量操作',type:null}];
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
      this.getOperationMap();
    }
  }
</script>

<style scoped>
  .equipmentDetail-info-box {
    width: 250px;
    position: absolute;
    top: 0;
    overflow-y: auto;
    bottom: 0;
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
    left: 260px;
    right: 0;
    padding-top: 5px;
    margin-bottom: 0 !important;
  }

  .monitoringDetails-header.el-tabs--card > .el-tabs__content {
    position: absolute;
    top: 40px;
    bottom: 10px;
    left: 260px;
    right: 0;
    overflow-y: auto;
    padding: 0 10px;
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

  .alarmAdministrationTabs-dialog .el-dialog {
    width: 700px;
    height: 500px;
  }

  .administration-info-box .el-form-item .el-form-item__content {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
