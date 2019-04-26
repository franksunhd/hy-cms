<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmHistory')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="borderBottomFormItem">
      <!--表单-->
      <el-form :model="formItem" inline label-width="120px">
        <el-form-item :label="$t('alarmHistory.equipmentTypeInfo') + '：'">
          <el-popover
            trigger="click"
            placement="bottom-start"
            v-model="isShowTypePopover"
            ref="popover">
            <el-tree
              :data="equipmentTypeList"
              highlight-current
              :expand-on-click-node="false"
              @node-click="clickTypeNode"
              :props="defaultProps"/>
            <el-input
              v-model="formItem.equipmentType"
              style="width: 200px;"
              suffix-icon="el-icon-arrow-down"
              readonly
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.equipmentName') + '：'">
          <el-input v-model="formItem.equipmentName" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.equipmentIp') + '：'">
          <el-input v-model="formItem.equipmentIp" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.computerRoomName') + '：'">
          <el-select
            v-model="formItem.computerRoomId"
            @change="changeRoom(formItem.computerRoomId)"
            class="width200">
            <el-option
              v-for="(item,index) in computerRoomList"
              :key="index"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.rackNameInfo') + '：'">
          <el-select v-model="formItem.rackNameId" class="width200" clearable>
            <el-option
              v-for="(item,index) in rackNameList"
              :key="index"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.relateBusiness') + '：'">
          <el-popover
            trigger="click"
            placement="bottom-start"
            v-model="isShowBusinessPopover"
            ref="popover">
            <el-tree
              :data="businessTreeData"
              highlight-current
              :expand-on-click-node="false"
              @node-click="clickBusinessNode"
              :props="defaultPropsBusiness"/>
            <el-input
              v-model="formItem.businessName"
              readonly
              style="width: 200px;"
              suffix-icon="el-icon-arrow-down"
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.alarmLevelText') + '：'">
          <el-select v-model="formItem.equipmentStatus" class="width200" clearable>
            <el-option
              v-for="(item,index) in formBaseData.AlarmSeverity"
              :key="index"
              v-if="item.type == 66 || item.type == 99"
              :label="item.name"
              :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.processStatus') + '：'">
          <el-select v-model="formItem.dealWithStatus" class="width200" clearable>
            <el-option v-for="(item,index) in formBaseData.AlarmHandleStatus" :key="index" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('public.happenTime') + '：'">
          <el-date-picker
            v-model="formItem.dateTime"
            type="daterange"
            :range-separator="$t('public.to')"
            :start-placeholder="$t('public.startTime')"
            :end-placeholder="$t('public.endTime')"/>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20 clearfix">
      <div class="fr">
        <el-button @click="downloadData" :disabled="disableBtn.more">
          <span class="iconfont">&#xe64a;</span>
          {{$t('alarmHistory.exportExcel')}}
        </el-button>
      </div>
      <div class="fl">
        <el-form inline :model="formItem">
          <el-form-item label="筛选：">
            <el-select v-model="formItem.operation" clearable @change="changeOperation(formItem.operation)">
              <el-option v-for="(item,index) in optionsList" :key="index" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!--表格-->
      <el-table
        :data="tableData"
        ref="table"
        class="indexTableBox"
        stripe
        @cell-click="cellClickColumn"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave">
        <el-table-column width="90px" :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="70px" :label="$t('alarmHistory.alarmLevelText')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
              <span class="iconfont iconfontSuccess">&#xe648;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
              <span class="iconfont iconfontWarn">&#xe649;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
              <span class="iconfont iconfontError">&#xe64a;</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="100px" :label="$t('alarmHistory.equipmentName')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
              <span>{{scope.row.deviceName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarmHistory.alarmContent')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="left-start">
              <div slot="content" style="width: 150px">
                {{scope.row.currentStatus}}
              </div>
              <span>{{scope.row.currentStatus}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="160px" :label="$t('alarmHistory.alarmThisTime')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.occurrenceTime | dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" prop="roomName" :label="$t('alarmHistory.computerRoomName')" header-align="left" align="left"/>
        <el-table-column width="100px" prop="frameName" :label="$t('alarmHistory.rackName')" header-align="left" align="left"/>
        <el-table-column width="110px" prop="framePosition" :label="$t('alarmHistory.location')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.framePosition == null ? '' : (scope.row.framePosition == '' ? '' : scope.row.framePosition + 'U')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" prop="ip" :label="$t('alarmHistory.equipmentIp')" header-align="left" align="left"/>
        <el-table-column width="120px" :label="$t('alarmHistory.equipmentType')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{tableDataBase.AssetType[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" :label="$t('alarmHistory.equipmentOwner')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="light" class="alarmHistory-tooltip" placement="top-start">
              <div slot="content" :manual="true" v-model="scope.row.statusMenu">
                <el-form class="alarmHistoryBox-chargeBy" label-width="120px">
                  <el-form-item :label="$t('alarmHistory.userName') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmHistory.organizationName') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmHistory.businessCode') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmHistory.email') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmHistory.phoneNumber') + '：'"></el-form-item>
                </el-form>
              </div>
              <span>{{scope.row.chargeBy}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="160px" :label="$t('alarmHistory.closeTime')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.closeTime | dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" :label="$t('alarmHistory.closeBy')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="light" :content="scope.row.closeBy" placement="left-start">
              <span>{{scope.row.closeBy}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :page-size="options.pageSize"
        @handleSizeChangeSub="handleSizeChangeSub"
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--设备告警详情弹出层-->
    <equipmentAlarmDetails
      ref="alarmDialog"
      :dialogVisible="dialogVisible"
      :AssetType="tableDataBase.AssetType"
      :AlarmSeverity="tableDataBase.AlarmSeverity"
      :AlarmHandleStatus="tableDataBase.AlarmHandleStatus"
      @dialogVisibleStatus="dialogVisibleStatus" />
    <!--标签页-->
    <el-tabs
      v-if="isShowTabBox_tab"
      v-model="editableTabsValue"
      type="card"
      ref="alarmHistoryTabs"
      class="whiteBg"
      id="alarmHistory-tabs"
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
        <div class="alarmHistory-btn">
          <!--收起-->
          <span @click="packUp" class="iconfont cursorPointer">&#xe64a;</span>
          <!--关闭弹出层-->
          <span @click="closeTab" class="iconfont cursorPointer">&#xe64e;</span>
        </div>
        <AdministrationTags v-if="isShowTabBox" :page-device-id="item.content"/>
      </el-tab-pane>
    </el-tabs>
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  import AdministrationTags from '../../../components/AdministrationTabs';
  import equipmentAlarmDetails from '../../../components/equipmentAlarmDetails';
  import {dateFilterDay,dateFilter,dateFilterDayCN} from "../../../assets/js/filters";
  export default {
    name: "alarmHistory",
    components:{Box,AdministrationTags,equipmentAlarmDetails},
    data() {
      return {
        // 查询表单
        formItem:{
          equipmentType:this.$t('public.all'),
          equipmentTypeId:null,
          computerRoomId:null,
          rackNameId:null,
          equipmentIp:null,
          equipmentName:null,
          businessId:null,
          businessName:null,
          equipmentStatus:null,
          dealWithStatus:null,
          dateTime:null,
          status:0,
          checked:false,
          operation:null,
          statusTip:this.$t('alarmHistory.confirmOpinions')
        },
        statusMenu:true,
        // 设备告警详情提交字段
        addEdit:{
          id:''
        },
        // 全局按钮启用禁用判断
        disableBtn:{
          more:true
        },
        // 设备类型树形下拉框数据
        equipmentTypeList:[],
        // 机房树形下拉框的数据
        computerRoomList:[
          {name:'所有纳管的设备',id:null}
        ],
        // 机架下拉框数据
        rackNameList:[],
        framesData:[],
        // 筛选下拉列表
        optionsList:[],
        // 设备状态下拉框
        equipmentStatusList:[],
        // 关联业务树形下拉框集合
        businessTreeData:[],
        // 表格数据
        tableData:[],
        // 缓存表格数据用于纯前端筛选
        tableDataAll:[],
        // 表格数据字典
        tableDataBase:{
          AlarmHandleStatus:{},
          AlarmSeverity:{},
          AssetType:{}
        },
        // 表单数据字典
        formBaseData:{
          AlarmHandleStatus:[],
          AlarmSeverity:[],
          AssetType:[]
        },
        // 设备告警详情弹出层信息
        alarmDetailDataAlarm:{},
        alarmDetailDataComment:[],
        // 处理状态
        dealWithStatusList:[],
        // 控制设备类型下拉框的显示隐藏
        isShowTypePopover:false,
        // 关联业务树形下拉框显示隐藏
        isShowBusinessPopover:false,
        // 控制标签页内容是否显示
        isShowTabBox:false,
        // 控制标签页区域是否显示
        isShowTabBox_tab:false,
        // 设备详情信息弹出层
        dialogVisible:false,
        defaultProps:{
          label:'nodeName',
          children:'children'
        },
        defaultPropsBusiness:{
          label:'nodeName',
          children:'children'
        },
        // 分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        },
        editableTabsValue:'', // 当前页签
        editableTabs:[], // 页面集合
        tabIndex: 0, // 页签序号
      }
    },
    methods:{
      // 接受弹出层关闭的参数
      dialogVisibleStatus(val){
        this.dialogVisible = val;
      },
      // 改变筛选值
      changeOperation(val) {
        var _t = this;
        var tableData = new Array();
        if (val !== '') {
          _t.tableDataAll.forEach((item)=>{
            if (item.id === val.id) {
              tableData.push(item);
            }
          });
        } else {
          tableData = _t.tableDataAll;
        }
        _t.tableData = tableData;
      },
      // 获取数据
      getData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('alarm/alarmHistory/pagelist',{
          jsonString:JSON.stringify({
            alarm:{
              type:_t.formItem.equipmentTypeId == null ? null : _t.formItem.equipmentTypeId,
              deviceName:_t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
              ip:_t.formItem.equipmentIp == null ? null : (_t.formItem.equipmentIp.trim() == '' ? null : _t.formItem.equipmentIp.trim()),
              roomId:_t.formItem.computerRoomId == null ? null : (_t.formItem.computerRoomId.trim() == '' ? null : _t.formItem.computerRoomId.trim()),
              frameId:_t.formItem.rackNameId == null ? null : (_t.formItem.rackNameId.trim() == '' ? null : _t.formItem.rackNameId.trim()),
              business:_t.formItem.businessId == null ? null : (_t.formItem.businessId.trim() == '' ? null : _t.formItem.businessId.trim()),
              alarmLevel:_t.formItem.equipmentStatus == null ? null : (_t.formItem.equipmentStatus.trim() == '' ? null : _t.formItem.equipmentStatus.trim()),
              status:_t.formItem.dealWithStatus == null ? null : (_t.formItem.dealWithStatus.trim() == '' ? null : _t.formItem.dealWithStatus.trim()),
              ocrStartTime:_t.formItem.dateTime == null ? null : dateFilterDay(_t.formItem.dateTime[0].getTime()),
              ocrEndTime:_t.formItem.dateTime == null ? null : dateFilterDay(_t.formItem.dateTime[1].getTime()),
            },
            page:{
              currentPage:_t.options.currentPage,
              pageSize: _t.options.pageSize
            }
          })
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.getTableDataValue(res.data);
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
      // 查询表格中状态对应的数据值
      getTableDataValue(resData){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/map',{
          dictionaryTypes:["AlarmHandleStatus","AssetType","AlarmSeverity"],
          languageMark:localStorage.getItem("hy-language")
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              // 获取表格对应的状态值
              _t.tableDataBase = res.data;
              _t.tableData = resData.list;
              _t.options.currentPage = resData.page.currentPage;
              _t.options.total = resData.page.totalResultSize;
              // 用于判断鼠标是否移入设备责任人列 默认为false
              _t.tableData.forEach(function (item) {
                item.statusMenu = false;
              });
              _t.tableDataAll = _t.tableData;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.tableDataBase = [];
              _t.tableData = [];
              _t.options.currentPage = 1;
              _t.options.total = 0;
              break;
          }
        });
      },
      // 点击设备类型下拉框
      clickTypeNode(val){
        var _t = this;
        _t.formItem.equipmentType = val.nodeName;
        _t.formItem.equipmentTypeId = val.nodeCode;
        _t.isShowTypePopover = false;
      },
      // 点击关联业务下拉框节点
      clickBusinessNode(val){
        var _t = this;
        _t.formItem.businessId = val.nodeId;
        _t.formItem.businessName = val.nodeName;
        _t.isShowBusinessPopover = false;
      },
      // 导出excel数据
      downloadData(){},
      // 单元格点击
      cellClickColumn(row,column) {
        var _t = this;
        // 点击状态列 点击告警内容列
        if (column.label === _t.$t('alarmHistory.status') || column.label === _t.$t('alarmHistory.alarmContent')) {
          if (row.id !== null) {
            _t.addEdit.id = row.id;
            _t.dialogVisible = true;
            // 父组件调用 子组件 获取数据的方法
            _t.$refs.alarmDialog.getData(_t.addEdit.id,true);
          }
        }
        // 点击设备名称列 点击最新告警时间列
        if (column.label === _t.$t('alarmHistory.equipmentName') || column.label === _t.$t('alarmHistory.alarmThisTime')) {
          if (row.deviceId !== null) {
            _t.addTab(row.deviceName,row.deviceId);
          }
        }
      },
      // 改变当前页码
      handleCurrentChange(val) {
        var _t = this;
        _t.options.currentPage = val;
        _t.getData();
      },
      // 改变每页显示条数
      handleSizeChangeSub(val){
        var _t = this;
        _t.options.pageSize = val;
        _t.getData();
      },
      // 单元格鼠标移入事件
      cellMouseEnter(row,column){
        var _t = this;
        // 设备责任人列
        if (column.label == _t.$t('alarmHistory.equipmentOwner')) {
          row.statusMenu = true;
        }
      },
      // 单元格移出事件
      cellMouseLeave(row,column){
        var _t = this;
        // 设备责任人列
        if (column.label == _t.$t('alarmHistory.equipmentOwner')) {
          row.statusMenu = false;
        }
      },
      // 表单部分机房机架下拉框数据
      getFormData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('asset/assetEngineroom/maplist',{},function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              var computerRoomList = res.data.rooms;
              _t.framesData = res.data.frames;
              computerRoomList.unshift({name:'所有纳管的设备',id:null});
              _t.computerRoomList = computerRoomList;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.computerRoomList = [{name:'所有纳管的设备',id:null}];
              break;
          }
        });
      },
      // 改变表单的机房时加载机柜的数据
      changeRoom(val){
        var _t = this;
        if (_t.formItem.computerRoomId !== null) {
          _t.framesData.forEach(function (item) {
            if (item.roomId == val) {
              _t.rackNameList = item.frame;
            }
          });
        } else {
          _t.rackNameList = [];
        }
        _t.formItem.rackNameId = '';
      },
      // 查询设备类型
      getBaseData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('system/basedata/all',{
          jsonString: JSON.stringify({
            systemBasedata:{
              dictionaryType:'AssetType',
              languageMark: localStorage.getItem('hy-language')
            }
          })
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              var equipmentTypeList = res.data.treeNode.children[0].children;
              equipmentTypeList.unshift({nodeName:'全部',level:1,children:null,nodeCode:null,parentId:'0'})
              _t.equipmentTypeList = equipmentTypeList;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.equipmentTypeList = [];
              break;
          }
        });
      },
      // 查找关联业务树形列表
      getBusinessTreeData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('asset/assetBusiness/all',{
          jsonString:JSON.stringify({
            isTree:true
          })
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.businessTreeData = res.data.children;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.businessTreeData = [];
              break;
          }
        });
      },
      // 查询字典集合
      getBaseDataList(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/maplist',{
          languageMark:localStorage.getItem('hy-language'),
          dictionaryTypes:['AlarmHandleStatus','AssetType','AlarmSeverity']
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.formBaseData.AlarmSeverity = res.data.AlarmSeverity;
              _t.formBaseData.AlarmHandleStatus = res.data.AlarmHandleStatus;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.formBaseData.AlarmSeverity = [];
              _t.formBaseData.AlarmHandleStatus = [];
              break;
          }
        });
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
          document.getElementById('alarmHistory-tabs').style.top = '118px';
        }
      },
      // 收起
      packUp(){
        var _t = this;
        _t.isShowTabBox = false;
        document.getElementById('alarmHistory-tabs').style.top = 'initial';
      },
      // 关闭标签页
      closeTab(){
        var _t = this;
        _t.isShowTabBox_tab = false;
        document.getElementById('alarmHistory-tabs').style.top = 'initial';
        _t.editableTabsValue = '';
        _t.editableTabs = [];
        _t.tabIndex = 0;
      },
      // 点击标签页
      clickTabs(){
        var _t = this;
        _t.isShowTabBox = true;
        document.getElementById('alarmHistory-tabs').style.top = '118px';
      },
    },
    created() {
      this.$store.commit('setLoading',true);
      this.getData();
      this.getFormData();
      this.getBaseData();
      this.getBusinessTreeData();
      this.getBaseDataList();
    }
  }
</script>

<style>
  .alarmHistoryBox-dialog .el-dialog {
    width: 930px;
    height: 560px;
  }

  .alarmHistory-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
  }

  .closeCheckBox {
    margin-left: 30px;
  }

  .closeCheckBox .el-checkbox__label {
    font-size: 12px;
  }

  #alarmHistory-tabs {
    position: fixed;
    bottom: 0;
    right: 20px;
    left: 80px;
    top: 118px;
    z-index: 1100;
  }

  #alarmHistory-tabs .el-tabs__header.is-bottom {
    margin-top: 0;
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -20px;
  }

  #alarmHistory-tabs .el-tabs__header.is-bottom .el-tabs__item {
    font-size: 12px;
    position: relative;
  }

  #alarmHistory-tabs > .el-tabs__content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 40px;
    top: 0;
  }

  #alarmHistory-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:before {
    content: '';
    width: 10px;
    height: 10px;
    display: inline-block;
    position: absolute;
    top: 0;
    left: -10px;
    border-radius: 0 10px 0 0;
  }

  #alarmHistory-tabs .el-tabs__header.is-bottom .el-tabs__item:after {
    content: '';
    position: absolute;
    top: 10px;
    right: 0;
    height: 20px;
  }

  #alarmHistory-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:after {
    content: '';
    width: 10px;
    height: 10px;
    display: inline-block;
    position: absolute;
    top: 0;
    right: -10px;
    border-radius: 10px 0 0 0;
  }

  #alarmHistory-tabs .el-tabs__header.is-bottom .el-tabs__nav-scroll {
    padding: 0 20px;
  }
</style>
