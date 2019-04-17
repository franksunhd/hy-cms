<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmCurrent')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <!--表单-->
      <el-form :model="formItem" inline label-width="150px">
        <el-form-item :label="$t('alarmCurrent.equipmentTypeInfo') + ':'" style="width: 30%">
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
        <el-form-item :label="$t('alarmCurrent.equipmentNameInfo') + ':'" style="width: 30%">
          <el-input v-model="formItem.equipmentName" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.serialNumber') + ':'" style="width: 30%">
          <el-input v-model="formItem.serialNumber" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.computerRoomName') + ':'" style="width: 30%">
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
        <el-form-item :label="$t('alarmCurrent.rackNameInfo') + ':'" style="width: 30%">
          <el-select v-model="formItem.rackName" class="width200">
            <el-option v-for="(item,index) in rackNameList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.relateBusiness') + ':'" style="width: 30%">
          <el-input v-model="formItem.business" />
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.equipmentStatus') + ':'" style="width: 30%">
          <el-select v-model="formItem.equipmentStatus" class="width200">
            <el-option v-for="(item,index) in equipmentStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmCurrent.processStatus') + ':'" style="width: 30%;">
          <el-select v-model="formItem.dealWithStatus" class="width200">
            <el-option v-for="(item,index) in dealWithStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
          <el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>
        </el-form-item>
      </el-form>
      <!--表格-->
      <el-table :data="tableData" class="indexTableBox" ref="table" stripe @cell-click="cellClickColumn">
        <el-table-column width="90px" :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="50px" :label="$t('alarmCurrent.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.alarmLevel}}</span>
            <el-tooltip v-if="scope.row.alarmLevel == 1" effect="dark" content="紧急" placement="top-start">
              <span class="iconfont iconfontError">&#xe609;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.alarmLevel == 2" effect="dark" content="警告" placement="top-start">
              <span class="iconfont iconfontWarn">&#xe608;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.alarmLevel == 3" effect="dark" content="忽略" placement="top-start">
              <span class="iconfont iconfontDisable">&#xe60a;</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="150px" :label="$t('alarmCurrent.equipmentName')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
              <span>{{scope.row.deviceName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="150px" :label="$t('alarmCurrent.alarmContent')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="left-start">
              <div slot="content" style="width: 150px">{{scope.row.currentStatus}}</div>
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
        <el-table-column width="120px" :label="$t('alarmCurrent.equipmentType')" header-align="left" align="left"/>
        <el-table-column width="120px" prop="chargeBy" :label="$t('alarmCurrent.equipmentOwner')" header-align="left" align="left"/>
        <el-table-column width="100px" prop="status" :label="$t('alarmCurrent.processStatus')" header-align="left" align="left"/>
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
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--设备告警详情弹出层-->
    <el-dialog
      class="alarmCurrentBox"
      :title="$t('alarmCurrent.addUpdateAlarm')"
      append-to-body
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="dialogTitle">{{$t('alarmCurrent.equipmentInfo')}}</div>
      <el-form :model="equipmentData" inline label-position="right" label-width="76px">
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.equipmentName') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.productName') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.equipmentIp') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.UUID') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.equipmentVendor') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.serialNumber') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.objectType') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.severityLevel') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.alarmNumber') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.eventType') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.createTime') + ':'"></el-form-item>
        <el-form-item style="width: 33%;" :label="$t('alarmCurrent.lastTime') + ':'"></el-form-item>
      </el-form>
      <div class="dialogTitle">{{$t('alarmCurrent.alarmInfo')}}</div>
      <el-form inline label-position="right" label-width="76px">
        <p class="paddingLeft-10"><strong>{{$t('alarmCurrent.alarmField')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.status') + ':'">Down != Up</el-form-item>
        <p class="paddingLeft-10"><strong>{{$t('alarmCurrent.currentStatus')}}</strong></p>
        <el-form-item style="width: 50%;" :label="$t('alarmCurrent.macLocation') + ':'">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmCurrent.status') + ':'">Down</el-form-item>
        <p class="paddingLeft-10"><strong>{{$t('alarmCurrent.addField')}}</strong></p>
        <el-form-item :label="$t('alarmCurrent.status') + ':'">Down != Up</el-form-item>
        <p class="paddingLeft-10"><strong>{{$t('alarmCurrent.addInfo')}}</strong></p>
        <el-form-item style="width: 60%;" :label="$t('alarmCurrent.productName') + ':'">Intel(R) Gigabit 4P I350-t rNDC - EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item style="width: 30%;" :label="$t('alarmCurrent.name') + ':'">NIC.Integrated.1-3-1</el-form-item>
        <br>
        <el-form-item style="width: 30%;" :label="$t('alarmCurrent.AutoNegotiation') + ':'">Enabled</el-form-item>
        <el-form-item style="width: 30%;" :label="$t('alarmCurrent.linkSpeed') + ':'">Unknown</el-form-item>
        <el-form-item style="width: 30%;" :label="$t('alarmCurrent.macLocation') + ':'">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item :label="$t('alarmCurrent.alarmDescription') + ':'">
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
    <!--设备责任人弹出层-->
    <el-dialog
      class="alarmCurrent-dialog"
      :title="$t('alarmCurrent.ownerInfo')"
      append-to-body
      :visible.sync="dialogVisibleOwnerInfo"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('alarmCurrent.userName') + ':'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.organizationName') + ':'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.businessCode') + ':'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.email') + ':'"></el-form-item>
        <el-form-item :label="$t('alarmCurrent.phoneNumber') + ':'"></el-form-item>
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
          rackName:null,
          serialNumber:null,
          equipmentName:null,
          business:null,
          equipmentStatus:null,
          dealWithStatus:null
        },
        // 设备告警详情提交字段
        addEdit:{
          id:''
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
        tableData:[],
        // 表格数据字典
        tableDataBase:[],
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
              _t.tableData = res.data.list;
              _t.options.currentPage = res.data.page.currentPage;
              _t.options.total = res.data.page.totalResultSize;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.tableData = [];
              _t.options.currentPage = 1;
              _t.options.total = 0;
              break;
          }
        });
      },
      // 查询表格中状态对应的数据值
      getTableDataValue(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/map',{
          dictionaryTypes:["AlarmHandleStatus","AssetType","AlarmSeverity"],
          languageMark:localStorage.getItem("hy-language")
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.tableDataBase = res.data;
              _t.getData();
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.tableDataBase = [];
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
        // 点击设备责任人列
        if (column.label == _t.$t('alarmCurrent.equipmentOwner')) {
          _t.dialogVisibleOwnerInfo = true;
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
      }
    },
    created() {
      this.$store.commit('setLoading',true);
      this.getData();
    }
  }
</script>

<style>
  .alarmCurrent-dialog .el-dialog {
    width: 700px;
    height: 450px;
  }

  .alarmCurrentBox .el-dialog {
    width: 880px;
    height: 500px;
  }

  .alarmCurrentBox .el-dialog__body {
    padding-top: 10px;
  }

  .alarmCurrentBox .el-form--inline .el-form-item {
    margin: 0;
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
