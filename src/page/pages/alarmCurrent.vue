<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmCurrent')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmCurrent')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <!--表单-->
      <el-form :model="formItem" inline label-width="150px">
        <el-form-item label="设备分类/类型:" style="width: 30%">
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
        <el-form-item label="设备名称/资产信息:" style="width: 30%">
          <el-input v-model="formItem.equipmentName" class="width200" />
        </el-form-item>
        <el-form-item label="序列号:" style="width: 30%">
          <el-input v-model="formItem.serialNumber" class="width200" />
        </el-form-item>
        <el-form-item label="机房:" style="width: 30%">
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
        <el-form-item label="机架/机柜:" style="width: 30%">
          <el-select v-model="formItem.rackName" class="width200">
            <el-option v-for="(item,index) in rackNameList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务:" style="width: 30%">
          <el-input v-model="formItem.business" />
        </el-form-item>
        <el-form-item label="设备状态:" style="width: 30%">
          <el-select v-model="formItem.equipmentStatus" class="width200">
            <el-option v-for="(item,index) in equipmentStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态:" style="width: 30%;">
          <el-select v-model="formItem.dealWithStatus" class="width200">
            <el-option v-for="(item,index) in dealWithStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
          <el-button type="primary" @click="downloadData">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <!--表格-->
      <el-table :data="tableData" stripe @cell-click="cellClickColumn">
        <el-table-column :label="$t('public.index')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarmCurrent.status')" header-align="center" align="center">
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
        <el-table-column :label="$t('alarmCurrent.equipmentName')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.equipmentName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarmCurrent.alarmContent')" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="left-start">
              <div slot="content" style="width: 150px">{{scope.row.alarmContent}}</div>
              <span>{{scope.row.alarmContent}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarmCurrent.lastAlarmTime')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lastModifiedTime | dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarmCurrent.statusAll')" header-align="center" align="center">
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
        <el-table-column prop="computerRoomName" :label="$t('alarmCurrent.computerRoomName')" header-align="center" align="center"/>
        <el-table-column prop="rackName" :label="$t('alarmCurrent.rackName')" header-align="center" align="center"/>
        <el-table-column prop="location" :label="$t('alarmCurrent.location')" header-align="center" align="center"/>
        <el-table-column prop="ip" :label="$t('alarmCurrent.Ip')" header-align="center" align="center"/>
        <el-table-column prop="equipmentType" :label="$t('alarmCurrent.equipmentType')" header-align="center" align="center"/>
        <el-table-column prop="equipmentOwner" :label="$t('alarmCurrent.equipmentOwner')" header-align="center" align="center"/>
        <el-table-column prop="processStatus" :label="$t('alarmCurrent.processStatus')" header-align="center" align="center"/>
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
      <div class="dialogTitle">设备基本信息</div>
      <el-form :model="equipmentData" inline label-position="right" label-width="76px">
        <el-form-item style="width: 33%;" label="设备名称:"></el-form-item>
        <el-form-item style="width: 33%;" label="产品名称:"></el-form-item>
        <el-form-item style="width: 33%;" label="设备IP:"></el-form-item>
        <el-form-item style="width: 33%;" label="UUID:"></el-form-item>
        <el-form-item style="width: 33%;" label="设备厂商:"></el-form-item>
        <el-form-item style="width: 33%;" label="序列号:"></el-form-item>
        <el-form-item style="width: 33%;" label="对象类型:"></el-form-item>
        <el-form-item style="width: 33%;" label="严重级别:"></el-form-item>
        <el-form-item style="width: 33%;" label="告警次数:"></el-form-item>
        <el-form-item style="width: 33%;" label="事件类别:"></el-form-item>
        <el-form-item style="width: 33%;" label="起始时间:"></el-form-item>
        <el-form-item style="width: 33%;" label="最新时间:"></el-form-item>
      </el-form>
      <div class="dialogTitle">告警信息</div>
      <el-form inline label-position="right" label-width="76px">
        <p class="paddingLeft-10"><strong>告警字段</strong></p>
        <el-form-item label="状态:">Down != Up</el-form-item>
        <p class="paddingLeft-10"><strong>当前状态</strong></p>
        <el-form-item style="width: 50%;" label="MAC地址:">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item label="状态:">Down</el-form-item>
        <p class="paddingLeft-10"><strong>附加字段</strong></p>
        <el-form-item label="状态:">Down != Up</el-form-item>
        <p class="paddingLeft-10"><strong>附加信息</strong></p>
        <el-form-item style="width: 60%;" label="产品名称:">Intel(R) Gigabit 4P I350-t rNDC - EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item style="width: 30%;" label="名称:">NIC.Integrated.1-3-1</el-form-item>
        <br>
        <el-form-item style="width: 30%;" label="自动协商:">Enabled</el-form-item>
        <el-form-item style="width: 30%;" label="链路速度:">Unknown</el-form-item>
        <el-form-item style="width: 30%;" label="MAC地址:">EC:F4:BB:C1:0C:CA</el-form-item>
        <el-form-item label="告警评注:">
          <el-input type="textarea" style="width: 734px;" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary">忽略告警</el-button>
        <el-button class="queryBtn" type="primary">确认告警</el-button>
        <el-button class="queryBtn" type="primary">转保修</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--设备责任人弹出层-->
    <el-dialog
      :title="$t('alarmCurrent.ownerInfo')"
      append-to-body
      :visible.sync="dialogVisibleOwnerInfo"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item label="姓名:"></el-form-item>
        <el-form-item label="所属组织/部门:"></el-form-item>
        <el-form-item label="负责业务:"></el-form-item>
        <el-form-item label="电子邮箱:"></el-form-item>
        <el-form-item label="联系电话:"></el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary">确认</el-button>
        <el-button class="queryBtn" @click="dialogVisibleOwnerInfo = false">取消</el-button>
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
  import Box from '../../components/Box';
  import AdministrationTags from '../../components/AdministrationTabs';
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
        tableData:[
          {
            id:'1',
            status: 1,
            equipmentName: '惠普1',
            alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
            lastModifiedTime: '2019-02-10 12:22:11',
            equipmentOwner:'张三'
          },
        ],
        // 处理状态
        dealWithStatusList:[],
        isShowTypePopover:false, // 控制设备类型下拉框的显示隐藏
        isShowComputerPopover:false, // 控制机房下拉框的显示隐藏
        isShowTabBox:true, // 控制标签页内容是否显示
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
        editableTabsValue:'', // 当前页签
        editableTabs:[], // 页面集合
        tabIndex: 0, // 页签序号
      }
    },
    methods: {
      // 点击设备类型下拉框节点
      clickTypeNode(val){},
      // 点击机房下拉框的节点
      clickRoomNode(val){},
      // 查询表格数据
      getData(){},
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
        /*
         * 点击表格的单元格
         *    row 当前行绑定的 数据
         *    column 当前 单元格的 属性
         */
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
    }
  }
</script>

<style>
  .alarmCurrentBox .el-dialog {
    width: 880px;
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
    overflow: visible;
  }

  .alarmCurrent-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
