<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmCurrent')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="borderBottomFormItem">
      <!--表单-->
      <el-form :model="formItem" inline label-width="120px">
        <el-form-item :label="$t('alarmCurrent.equipmentTypeInfo') + '：'">
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
        <el-form-item :label="$t('alarmCurrent.equipmentName') + '：'">
          <el-input v-model="formItem.equipmentName" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.equipmentIp') + '：'">
          <el-input v-model="formItem.equipmentIp" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">
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
        <el-form-item :label="$t('alarmCurrent.rackNameInfo') + '：'">
          <el-select v-model="formItem.rackNameId" class="width200" clearable>
            <el-option
              v-for="(item,index) in rackNameList"
              :key="index"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.relateBusiness') + '：'">
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
        <el-form-item :label="$t('alarmCurrent.equipmentStatus') + '：'">
          <el-select v-model="formItem.equipmentStatus" class="width200" clearable>
            <el-option v-for="(item,index) in formBaseData.AlarmSeverity" :key="index" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.processStatus') + '：'">
          <el-select v-model="formItem.dealWithStatus" class="width200" clearable>
            <el-option v-for="(item,index) in formBaseData.AlarmHandleStatus" :key="index" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生日期：">
          <el-date-picker
            v-model="formItem.dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <div class="marBottom16">
        <el-button @click="downloadData" :disabled="disableBtn.more">
          <span class="iconfont">&#xe617;</span>
          {{$t('alarmCurrent.exportExcel')}}
        </el-button>
        <el-button :disabled="disableBtn.more">
          <span class="iconfont">&#xe618;</span>
          {{$t('alarmCurrent.batchOpenAlarm')}}
        </el-button>
        <el-button :disabled="disableBtn.more">
          <span class="iconfont">&#xe619;</span>
          {{$t('alarmCurrent.batchCloseAlarm')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table
        :data="tableData"
        ref="table"
        stripe
        @cell-click="cellClickColumn"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave">
        <el-table-column type="selection" fixed header-align="left" align="left" />
        <el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="50px" :label="$t('alarmCurrent.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
              <span class="iconfont iconfontSuccess">&#xe618;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
              <span class="iconfont iconfontWarn">&#xe608;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
              <span class="iconfont iconfontError">&#xe609;</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="100px" :label="$t('alarmCurrent.equipmentName')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
              <span>{{scope.row.deviceName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="150px" :label="$t('alarmCurrent.alarmContent')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="left-start">
              <div slot="content" style="width: 150px">
                {{scope.row.currentStatus}}
              </div>
              <span>{{scope.row.currentStatus}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="160px" :label="$t('alarmCurrent.lastAlarmTime')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" prop="roomName" :label="$t('alarmCurrent.computerRoomName')" header-align="left" align="left"/>
        <el-table-column width="100px" prop="frameName" :label="$t('alarmCurrent.rackName')" header-align="left" align="left"/>
        <el-table-column width="120px" prop="framePosition" :label="$t('alarmCurrent.location')" header-align="left" align="left"/>
        <el-table-column width="120px" prop="ip" :label="$t('alarmCurrent.Ip')" header-align="left" align="left"/>
        <el-table-column width="120px" :label="$t('alarmCurrent.equipmentType')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{tableDataBase.AssetType[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" :label="$t('alarmCurrent.equipmentOwner')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="light" class="alarmCurrent-tooltip" placement="top-start">
              <div slot="content" :manual="true" v-model="scope.row.statusMenu">
                <el-form class="alarmCurrentBox-chargeBy" label-width="120px">
                  <el-form-item :label="$t('alarmCurrent.userName') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmCurrent.organizationName') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmCurrent.businessCode') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmCurrent.email') + '：'"></el-form-item>
                  <el-form-item :label="$t('alarmCurrent.phoneNumber') + '：'"></el-form-item>
                </el-form>
              </div>
              <span>{{scope.row.chargeBy}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="100px" :label="$t('alarmCurrent.processStatus')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{tableDataBase.AlarmHandleStatus[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" :label="$t('public.operation')">
          <template slot-scope="scope">
            <el-button type="text">{{$t('alarmCurrent.turnWarranty')}}</el-button>
            <el-button type="text">{{$t('alarmCurrent.dealWithAlarm')}}</el-button>
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
    <el-dialog
      class="alarmCurrentBox-dialog"
      :title="$t('alarmCurrent.addUpdateAlarm')"
      append-to-body
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <!--设备基本信息-->
      <div class="dialogTitle">{{$t('alarmCurrent.equipmentInfo')}}</div>
      <el-form class="alarmMessageBox-formItem" :model="alarmDetailDataAlarm" label-position="right" label-width="76px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('alarmCurrent.equipmentName') + '：'">{{alarmDetailDataAlarm.deviceName || ''}}</el-form-item>
            <el-form-item :label="$t('alarmCurrent.equipmentIp') + '：'">{{alarmDetailDataAlarm.ip}}</el-form-item>
            <el-form-item :label="$t('alarmCurrent.serialNumber') + '：'">{{alarmDetailDataAlarm.servicetag}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('alarmCurrent.equipmentType') + '：'">{{tableDataBase.AssetType[alarmDetailDataAlarm.type]}}</el-form-item>
            <el-form-item :label="$t('alarmCurrent.equipmentVendor') + '：'">{{alarmDetailDataAlarm.manufacturer}}</el-form-item>
            <el-form-item :label="$t('alarmCurrent.equipmentModel') + '：'">{{alarmDetailDataAlarm.model}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">{{alarmDetailDataAlarm.roomName}}</el-form-item>
            <el-form-item :label="$t('alarmCurrent.location') + '：'">{{alarmDetailDataAlarm.frameName}},{{alarmDetailDataAlarm.framePosition}}U</el-form-item>
          </el-col>
        </el-row>
        <!--告警信息字段-->
        <div class="dialogTitle">{{$t('alarmCurrent.alarmInfo')}}</div>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('alarmCurrent.severityLevel') + '：'">
              <span v-if="alarmDetailDataAlarm.alarmLevel == 33" class="iconfontSuccess">{{tableDataBase.AlarmSeverity[alarmDetailDataAlarm.alarmLevel]}}</span>
              <span v-if="alarmDetailDataAlarm.alarmLevel == 66" class="iconfontWarn">{{tableDataBase.AlarmSeverity[alarmDetailDataAlarm.alarmLevel]}}</span>
              <span v-if="alarmDetailDataAlarm.alarmLevel == 99" class="iconfontError">{{tableDataBase.AlarmSeverity[alarmDetailDataAlarm.alarmLevel]}}</span>
            </el-form-item>
            <el-form-item :label="$t('alarmCurrent.alarmNumber') + '：'">
              <span class="iconfontError">{{alarmDetailDataAlarm.alarmTimes}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('alarmCurrent.createTime') + '：'">{{alarmDetailDataAlarm.occurrenceTime | dateFilter}}</el-form-item>
            <el-form-item :label="$t('alarmCurrent.lastTime') + '：'">{{alarmDetailDataAlarm.updateTime | dateFilter}}</el-form-item>
          </el-col>
        </el-row>
        <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.processStatus')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.status') + '：'">
          <span v-if="alarmDetailDataAlarm.status == 0" class="iconfontError">{{tableDataBase.AlarmHandleStatus[alarmDetailDataAlarm.status]}}</span>
          <span v-else>{{tableDataBase.AlarmHandleStatus[alarmDetailDataAlarm.status]}}</span>
        </el-form-item>
        <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.alarmContent')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.part') + '：'">
          {{alarmDetailDataAlarm.part}}
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.alarmInfo') + '：'">
          {{alarmDetailDataAlarm.currentStatus}}
        </el-form-item>
        <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.alarmDescription')}}</strong></p>
        <el-form-item label=" ">
          <el-timeline class="alarmDetailDataComment">
            <el-timeline-item
              :size="item.titleStatus == true ? 'large' : 'normal'"
              v-for="(item,index) in alarmDetailDataComment"
              :key="index">
              <div dot="timestamp" v-if="item.titleStatus == true">
                <span class="fsBold14">{{item.title}}</span>
              </div>
              <div dot="timestamp" class="fs12" v-if="item.titleStatus == false">
                <span class="col666">{{$t('alarmCurrent.descriptionUser')}}</span>
                <span class="col666 marginRight20">{{item.commUser}}</span>
                <span class="col666">{{item.createTime | dateFilter}}</span>
                <p>{{item.commContent}}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
        <el-form-item class="marginTop10" :label="$t('alarmCurrent.dealWithWays') + '：'">
          <el-radio-group v-model="formItem.status">
            <el-radio :label="0">{{$t('public.confirmAlarm')}}</el-radio>
            <el-radio :label="1">{{$t('alarmCurrent.alarmDescription')}}</el-radio>
            <el-radio :label="2">{{$t('alarmCurrent.alarmWarranty')}}</el-radio>
            <el-radio :label="3">{{$t('alarmCurrent.alarmClose')}}</el-radio>
            <el-radio :label="4">{{$t('alarmCurrent.alarmCloseIgnore')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="marginTop10" :label="$t('alarmCurrent.alarmDescription') + '：'">
          <el-input type="textarea" :autosize="{minRows: 3}" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button v-if="formItem.status == 0" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button v-if="formItem.status == 1" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button v-if="formItem.status == 2" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button v-if="formItem.status == 3" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button type="default" class="alertBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--标签页-->
    <el-tabs
      v-if="isShowTabBox_tab"
      v-model="editableTabsValue"
      type="card"
      class="whiteBg"
      id="alarmCurrent-tabs"
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
        <div class="alarmCurrent-btn">
          <!--收起-->
          <span @click="packUp" class="iconfont cursorPointer">&#xe61d;</span>
          <!--关闭弹出层-->
          <span @click="closeTab" class="iconfont cursorPointer">&#xe615;</span>
        </div>
        <AdministrationTags v-if="isShowTabBox" :pages-id="item.content" />
      </el-tab-pane>
    </el-tabs>
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  import AdministrationTags from '../../../components/AdministrationTabs';
  import {dateFilterDay,dateFilter,dateFilterDayCN} from "../../../assets/js/filters";

  export default {
    name: "alarmCurrent",
    components:{Box,AdministrationTags},
    data() {
      return {
        // 查询表单
        formItem:{
          equipmentType:'全部',
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
          status:0
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
        // 设备状态下拉框
        equipmentStatusList:[],
        // 关联业务树形下拉框集合
        businessTreeData:[],
        // 表格数据
        tableData:[],
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
        isShowTabBox:true,
        // 控制标签页区域是否显示
        isShowTabBox_tab:true,
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
        editableTabsValue:'1', // 当前页签
        editableTabs:[
          {
            title: '标题1',
            name:'1',
            content: '1'
          }
        ], // 页面集合
        tabIndex: 1, // 页签序号
      }
    },
    methods: {
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
      // 点击设备类型下拉框节点
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
      // 查询表格数据
      getData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('alarm/alarm/pagelist',{
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
              _t.tableData.forEach(function (item) {
                item.statusMenu = false;
              });
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
      // 导出excel数据
      downloadData(){},
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
        if (column.label == _t.$t('alarmCurrent.equipmentOwner')) {
          row.statusMenu = true;
        }
      },
      // 单元格移出事件
      cellMouseLeave(row,column){
        var _t = this;
        // 设备责任人列
        if (column.label == _t.$t('alarmCurrent.equipmentOwner')) {
          row.statusMenu = false;
        }
      },
      // 单元格点击
      cellClickColumn(row,column) {
        var _t = this;
        // 点击状态列 点击告警内容列
        if (column.label === _t.$t('alarmCurrent.status') || column.label === _t.$t('alarmCurrent.alarmContent')) {
          _t.addEdit.id = row.id;
          _t.getAlarmDetailData(_t.addEdit.id);
        }
        // 点击设备名称列 点击最新告警时间列
        if (column.label === _t.$t('alarmCurrent.equipmentName') || column.label === _t.$t('alarmCurrent.lastAlarmTime')) {
          _t.addTab(row.deviceName,row.id);
        }
      },
      // 获取设备告警详情弹出层
      getAlarmDetailData(val){
        var _t = this;
        _t.$api.get('alarm/alarm/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              _t.alarmDetailDataAlarm = res.data.alarm;
              var resData = res.data.commentList;
              // 处理之后的评注列表数据
              var alarmDetailData = new Array();
              // 需要对比的时间
              var timeLine = '';
              if (resData.length == 0) {
                _t.alarmDetailData = [];
              } else {
                resData.forEach(function (item) {
                  var time = new Date(item.createTime);
                  var timeNew = time.getFullYear().toString() + (time.getMonth() + 1).toString() + time.getDate().toString();
                  if (timeNew !== timeLine) {
                    // 没有本日数据
                    timeLine = timeNew;
                    var obj = new Object();
                    obj.titleStatus = true;
                    obj.title = dateFilterDayCN(item.createTime);
                    alarmDetailData.push(obj);
                    alarmDetailData.push(item);
                  } else {
                    // 有本日的数据
                    alarmDetailData.push(item);
                  }
                  item.titleStatus = false;
                  item.title = '';
                });
              }
              _t.alarmDetailDataComment = alarmDetailData;
              _t.dialogVisible = true;
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
          document.getElementById('alarmCurrent-tabs').style.top = '118px';
        }
      },
      // 收起
      packUp(){
        var _t = this;
      },
      // 关闭标签页
      closeTab(){
        var _t = this;
      },
      // 点击标签页
      clickTabs(){
        var _t = this;
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
              var equipmentTypeList = res.data.treeNode.children;
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
      }
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
  .alarmCurrentBox-dialog .el-dialog {
    width: 930px;
    height: 560px;
  }

  #alarmCurrent-tabs {
    position: fixed;
    bottom: 0;
    right: 20px;
    left: 80px;
    top: 118px;
    z-index: 1100;
    border: 1px solid #000;
  }

  #alarmCurrent-tabs .el-tabs__header.is-bottom {
    margin-top: 0;
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -20px;
    background-color: gray;
  }

  #alarmCurrent-tabs .el-tabs__content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 40px;
    top: 0;
  }

  .alarmCurrent-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
  }
</style>
