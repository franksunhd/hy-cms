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
        <el-form-item :label="$t('alarmCurrent.equipmentNameInfo') + '：'">
          <el-input v-model="formItem.equipmentName" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.serialNumber') + '：'">
          <el-input v-model="formItem.serialNumber" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">
          <el-popover
            trigger="click"
            placement="bottom-start"
            v-model="isShowComputerPopover"
            ref="popover">
            <el-tree
              :data="computerRoomList"
              highlight-current
              :expand-on-click-node="false"
              @node-click="clickRoomNode"
              :props="defaultProps"/>
            <el-input
              v-model="formItem.computerRoom"
              style="width: 200px;"
              suffix-icon="el-icon-arrow-down"
              readonly
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.rackNameInfo') + '：'">
          <el-select v-model="formItem.rackNameId" class="width200" clearable>
            <el-option v-for="(item,index) in rackNameList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.relateBusiness') + '：'">
          <el-input v-model="formItem.business" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.equipmentStatus') + '：'">
          <el-select v-model="formItem.equipmentStatus" class="width200" clearable>
            <el-option v-for="(item,index) in equipmentStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.processStatus') + '：'">
          <el-select v-model="formItem.dealWithStatus" class="width200" clearable>
            <el-option v-for="(item,index) in dealWithStatusList" :key="index" :label="item.label" :value="item.value" />
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
          批量确认告警
        </el-button>
        <el-button :disabled="disableBtn.more">
          <span class="iconfont">&#xe619;</span>
          批量关闭告警
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" @row-click="rowClick" ref="table" stripe @cell-click="cellClickColumn" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave">
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
            <el-tooltip effect="dark" class="alarmCurrent-tooltip" placement="top-start">
              <div slot="content" class="aaa">
                {{scope.row.chargeBy}}
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
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button type="text">转保修</el-button>
            <el-button type="text">处理告警</el-button>
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
      <div class="dialogTitle">{{$t('alarmCurrent.equipmentInfo')}}</div>
      <el-form class="alarmMessageBox-formItem" :model="equipmentData" label-position="right" label-width="76px">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('alarmCurrent.equipmentName') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.UUID') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.objectType') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.eventType') + '：'"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('alarmCurrent.productName') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.equipmentVendor') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.severityLevel') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.createTime') + '：'"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('alarmCurrent.equipmentIp') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.serialNumber') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.alarmNumber') + '：'"></el-form-item>
            <el-form-item :label="$t('alarmCurrent.lastTime') + '：'"></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialogTitle">{{$t('alarmCurrent.alarmInfo')}}</div>
      <el-form inline label-position="right" label-width="76px">
        <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.alarmField')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.status') + '：'">Down != Up</el-form-item>
        <p class="paddingLeft-10 fsBold12"><strong>{{$t('alarmCurrent.currentStatus')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.macLocation') + '：'">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmCurrent.status') + '：'">Down</el-form-item>
        <p class="paddingLeft-10 fsBold12"><strong>{{$t('alarmCurrent.addField')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.status') + '：'">Down != Up</el-form-item>
        <p class="paddingLeft-10 fsBold12"><strong>{{$t('alarmCurrent.addInfo')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.productName') + '：'">Intel(R) Gigabit 4P I350-t rNDC - EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmCurrent.name') + '：'">NIC.Integrated.1-3-1</el-form-item>
        <br>
        <el-form-item :label="$t('alarmCurrent.AutoNegotiation') + '：'">Enabled</el-form-item>
        <el-form-item :label="$t('alarmCurrent.linkSpeed') + '：'">Unknown</el-form-item>
        <el-form-item :label="$t('alarmCurrent.macLocation') + '：'">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmCurrent.alarmDescription') + '：'">
          <el-input type="textarea" :autosize="{minRows: 3}" style="width: 734px;" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" class="alertBtn">{{$t('public.ignoreAlarm')}}</el-button>
        <el-button type="primary" class="alertBtn">{{$t('public.confirmAlarm')}}</el-button>
        <el-button type="primary" class="alertBtn">{{$t('public.toWarranty')}}</el-button>
        <el-button type="default" class="alertBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--设备责任人弹出层-->
    <el-dialog
      class="alarmCurrent-dialog"
      :title="$t('alarmCurrent.ownerInfo')"
      append-to-body
      :visible.sync="dialogVisibleOwnerInfo"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('alarmCurrent.userName') + '：'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.organizationName') + '：'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.businessCode') + '：'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.email') + '：'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.phoneNumber') + '：'"></el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisibleOwnerInfo = false">{{$t('public.cancel')}}</el-button>
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
  import Box from '../../../components/Box';
  import AdministrationTags from '../../../components/AdministrationTabs';
  import {dateFilterDay,dateFilter} from "../../../assets/js/filters";

  export default {
    name: "alarmCurrent",
    components:{Box,AdministrationTags},
    data() {
      return {
        // 查询表单
        formItem:{
          equipmentType:null,
          equipmentTypeId:null,
          computerRoom:null,
          computerRoomId:null,
          rackNameId:null,
          serialNumber:null,
          equipmentName:null,
          business:null,
          equipmentStatus:null,
          dealWithStatus:null,
          dateTime:null
        },
        statusMenu:false,
        // 设备告警详情提交字段
        addEdit:{
          id:''
        },
        // 全局按钮启用禁用判断
        disableBtn:{
          more:true
        },
        // 设备告警详情数据
        equipmentData:{},
        // 设备类型树形下拉框数据
        equipmentTypeList:[],
        // 机房树形下拉框的数据
        computerRoomList:[],
        // 机架下拉框数据
        rackNameList:[],
        // 设备状态下拉框
        equipmentStatusList:[],
        // 表格数据
        tableData:[
          {
            chargeBy:'账单账单账单账单账单'
          }
        ],
        // 表格数据字典
        tableDataBase:{
          AlarmHandleStatus:{},
          AlarmSeverity:{},
          AssetType:{}
        },
        // 处理状态
        dealWithStatusList:[],
        isShowTypePopover:false, // 控制设备类型下拉框的显示隐藏
        isShowComputerPopover:false, // 控制机房下拉框的显示隐藏
        isShowTabBox:false, // 控制标签页内容是否显示
        isShowTabBox_tab:false, // 控制标签页区域是否显示
        dialogVisible:false, // 设备详情信息弹出层
        dialogVisibleOwnerInfo:false, // 业务责任人信息弹出层
        defaultProps:{},
        // 分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        },
        editableTabsValue:'1', // 当前页签
        editableTabs:[
          {
            name:'1',
            title:'标题1',
            content:'1'
          }
        ], // 页面集合
        tabIndex: 1, // 页签序号
      }
    },
    methods: {
      rowClick(row,column,event){
        this.$refs.table.toggleRowSelection(row);
        console.log(row);
        console.log(column);
        column.filterOpened = true;
        console.log(event)
      },
      // 点击设备类型下拉框节点
      clickTypeNode(val){},
      // 点击机房下拉框的节点
      clickRoomNode(val){},
      // 查询表格数据
      getData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('alarm/alarm/pagelist',{
          jsonString:JSON.stringify({
            alarm:{
              type:_t.formItem.equipmentType == null ? null : (_t.formItem.equipmentType == 0 ? null : _t.formItem.equipmentType),
              deviceName:_t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
              ip:_t.formItem.serialNumber == null ? null : (_t.formItem.serialNumber.trim() == '' ? null : _t.formItem.serialNumber.trim()),
              roomId:_t.formItem.computerRoomId == null ? null : _t.formItem.computerRoomId,
              frameId:_t.formItem.rackNameId == null ? null : _t.formItem.rackNameId,
              status:_t.formItem.dealWithStatus == null ? null : _t.formItem.dealWithStatus,
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
          _t.statusMenu = true;
        }
      },
      // 单元格移出事件
      cellMouseLeave(row,column){
        var _t = this;
        // 设备责任人列
        if (column.label == _t.$t('alarmCurrent.equipmentOwner')) {
          _t.statusMenu = false;
        }
      },
      // 单元格点击
      cellClickColumn(row,column) {
        var _t = this;
        // 点击状态列
        if (column.label == _t.$t('alarmCurrent.status')) {
          _t.dialogVisible = true;
          _t.addEdit.id = row.id;
        }
        // 点击设备名称列
        if (column.label == _t.$t('alarmCurrent.equipmentName')) {
          _t.addTab(row.equipmentName,row.id);
        }
        // 点击告警内容列
        if (column.label == _t.$t('alarmCurrent.alarmContent')) {
          _t.dialogVisible = true;
          _t.addEdit.id = row.id;
        }
        // 点击最新告警时间列
        if (column.label == _t.$t('alarmCurrent.lastAlarmTime')) {
          _t.addTab(row.equipmentName,row.id);
        }
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
        _t.isShowTabBox = false;
        document.getElementById('alarmCurrent-tabs').style.top = 'initial';
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
        document.getElementById('alarmCurrent-tabs').style.top = '118px';
      },
      // 表单部分下拉框数据
      getFormData(){
        var _t = this;
        _t.$api.get('asset/assetEngineroom/maplist',{},function (res) {
          switch (res.status) {
            case 200:
              console.log(res.data);
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
      this.$store.commit('setLoading',true);
      this.getData();
      this.getFormData();
    }
  }
</script>

<style>
  .alarmCurrentBox-dialog .el-dialog {
    width: 880px;
    height: 494px;
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
    position: fixed;
    left: 100px;
    right: 40px;
    bottom: 50px;
    top: 150px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .alarmCurrent-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
  }
</style>
