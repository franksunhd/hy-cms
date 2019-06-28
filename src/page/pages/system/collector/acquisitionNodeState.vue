<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.deviceAcquisitionSettings')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.acquisitionNodeState')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline label-width="80px">
        <el-form-item :label="$t('acquisitionNodeState.nodeName') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.nodeIp') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.nodePort') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200'" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.groupName') + '：'">
          <el-select class="width200">
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.nodeType') + '：'">
          <el-select class="width200">
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.status') + '：'">
          <el-select class="width200">
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16 clearfix">
        <el-button @click="runMonitoring" :disabled="disableBtn.edit">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.runMonitoring')}}
        </el-button>
        <el-button @click="stopMonitoring" :disabled="disableBtn.edit">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.stopMonitoring')}}
        </el-button>
        <el-button @click="banMonitoring" :disabled="disableBtn.edit">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.banMonitoring')}}
        </el-button>
        <el-button @click="temporarilyIgnore" :disabled="disableBtn.edit">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.temporarilyIgnore')}}
        </el-button>
        <el-button @click="cancelIgnore" :disabled="disableBtn.edit">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.cancelIgnore')}}
        </el-button>
        <el-button @click="offLine" :disabled="disableBtn.edit">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.offLine')}}
        </el-button>
        <el-select class="fr width200">
          <el-option />
        </el-select>
      </div>
      <!--表格-->
      <el-table :data="tableData" border stripe @select="selectTableNum" @select-all="selectTableNum">
        <el-table-column type="selection" fixed header-align="left" align="left" />
        <el-table-column :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('acquisitionNodeState.nodeName')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.ip')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.port')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.nodeGroup')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.nodeType')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.equipmentNumber')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.description')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{$t('public.enable')}}</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">{{$t('public.disable')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('acquisitionNodeState.executionStatus')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeState.lastExecutionTime')" header-align="left" align="left" />
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :pageSize='options.pageSize'
        :firstPage='options.firstPage'
        :lastPage='options.lastPage'
        @handleCurrentChangeSub="handleCurrentChange" />
    </div>
  </Box>
</template>

<script>
  import Box from '../../../../components/common/Box';
  export default {
    name: "acquisitionNodeState",
    components:{Box},
    data() {
      return {
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        tableData:[
          {status:1},{status:0},{status:1},{status:0},{status:1},{status:1}
        ],
        options:{
          total:1000, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
          firstPage:1, // 首页
          lastPage:100 // 末页
        },
        dialogVisible:false,
      }
    },
    methods: {
      // 当前选中条数
      selectTableNum(data){
        var _t = this;
        switch (data.length) {
          case 0: // 未选中
            _t.disableBtn.disable = true;
            _t.disableBtn.edit = true;
            _t.disableBtn.enable = true;
            _t.disableBtn.more = true;
            break;
          case 1: // 单选
            _t.disableBtn.edit = false;
            _t.disableBtn.more = false;
            data.forEach(function (item) {
              if (item.status === 0) {
                _t.disableBtn.enable = false;
              } else if (item.status === 1) {
                _t.disableBtn.disable = false;
              }
            });
            break;
          default: // 多选
            _t.disableBtn.edit = true;
            _t.disableBtn.more = false;
            var disableFlag = 0, enableFlag = 0;
            for (var i = 0;i < data.length;i++){
              if (data[i].status === 0) {
                disableFlag++;
              } else if (data[i].status === 1) {
                enableFlag++;
              }
            }
            if (disableFlag > 0 && enableFlag > 0) {
              _t.disableBtn.enable = true;
              _t.disableBtn.disable = true;
            } else if (disableFlag === 0 && enableFlag > 0) {
              _t.disableBtn.enable = true;
              _t.disableBtn.disable = false;
            } else if (disableFlag > 0 && enableFlag === 0) {
              _t.disableBtn.enable = false;
              _t.disableBtn.disable = true;
            }
            break;
        }
      },
      // 改变当前页码
      handleCurrentChange(val){},
      // 执行监测
      runMonitoring(){
      	var _t = this;
				_t.$confirm(_t.$t('acquisitionNodeState.dialogRunningTip'),_t.$t('public.confirmTip'),{
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          cancelButtonClass: 'alertBtn',
					confirmButtonClass: 'alertBtn',
          type: 'warning',
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 停止监测
      stopMonitoring(){
      	var _t = this;
				_t.$confirm(_t.$t('acquisitionNodeState.dialogStoppedTip'),_t.$t('public.confirmTip'),{
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
					cancelButtonClass: 'alertBtn',
					confirmButtonClass: 'alertBtn',
          type: 'warning',
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁止忽略
      banMonitoring(){

      },
      // 暂时忽略
      temporarilyIgnore(){

      },
      // 取消忽略
      cancelIgnore(){

      },
      // 离线
      offLine(){

      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
