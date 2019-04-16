<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmHistory')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <!--表单-->
      <el-form :model="formItem" inline label-width="150px">
        <el-form-item :label="$t('alarmHistory.equipmentTypeInfo') + ':'" style="width: 30%">
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
        <el-form-item :label="$t('alarmHistory.equipmentNameInfo') + ':'" style="width: 30%">
          <el-input v-model="formItem.equipmentName" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.serialNumber') + ':'" style="width: 30%">
          <el-input v-model="formItem.serialNumber" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.computerRoomName') + ':'" style="width: 30%">
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
        <el-form-item :label="$t('alarmHistory.rackNameInfo') + ':'" style="width: 30%">
          <el-select v-model="formItem.rackName" class="width200">
            <el-option v-for="(item,index) in rackNameList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.relateBusiness') + ':'" style="width: 30%">
          <el-input v-model="formItem.business" />
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.equipmentStatus') + ':'" style="width: 30%">
          <el-select v-model="formItem.equipmentStatus" class="width200">
            <el-option v-for="(item,index) in equipmentStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarmHistory.processStatus') + ':'" style="width: 30%;">
          <el-select v-model="formItem.dealWithStatus" class="width200">
            <el-option v-for="(item,index) in dealWithStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
          <el-button type="primary" @click="downloadData">{{$t('alarmHistory.exportExcel')}}</el-button>
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
            <!--<el-tooltip v-if="scope.row.alarmLevel == 1" effect="dark" content="紧急" placement="top-start">-->
            <!--<span class="iconfont iconfontError">&#xe609;</span>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip v-if="scope.row.alarmLevel == 2" effect="dark" content="警告" placement="top-start">-->
            <!--<span class="iconfont iconfontWarn">&#xe608;</span>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip v-if="scope.row.alarmLevel == 3" effect="dark" content="忽略" placement="top-start">-->
            <!--<span class="iconfont iconfontDisable">&#xe60a;</span>-->
            <!--</el-tooltip>-->
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
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  export default {
    name: "alarmHistory",
    components:{Box},
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
              console.log(res.data)
              _t.tableData = res.data.list;
              _t.options.currentPage = res.data.currentPage;
              _t.options.total = res.data.count;
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
        if (column.label == _t.$t('alarmHistory.status')) {
          _t.dialogVisible = true;
          _t.addEdit.id = row.id;
        }
        // 点击设备名称列
        if (column.label == _t.$t('alarmHistory.equipmentName')) {
          _t.addTab(row.equipmentName,row.id);
        }
        // 点击告警内容列
        if (column.label == _t.$t('alarmHistory.alarmContent')) {
          _t.dialogVisible = true;
          _t.addEdit.id = row.id;
        }
        // 点击最新告警时间列
        if (column.label == _t.$t('alarmHistory.lastAlarmTime')) {
          _t.addTab(row.equipmentName,row.id);
        }
        // 点击设备责任人列
        if (column.label == _t.$t('alarmHistory.equipmentOwner')) {
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
          document.getElementById('alarmHistory-tabs').style.top = '118px';
        }
      },
      // 收起
      packUp(){
        var _t = this;
        _t.isShowTabBox = false;
        document.getElementById('alarmHistory-tabs').style.top = 'initial';
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
        document.getElementById('alarmHistory-tabs').style.top = '118px';
      }
    },
    created() {
      this.$store.commit('setLoading',true);
      this.getData();
    }
  }
</script>

<style scoped>

</style>
