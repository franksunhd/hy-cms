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
      <el-form inline>
        <el-form-item :label="$t('acquisitionNodeState.nodeName') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.nodeIp') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.nodePort') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200'" />
        </el-form-item>
        <br>
        <el-form-item :label="$t('acquisitionNodeState.groupName') + '：'">
          <el-select class="width200">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.nodeType') + '：'">
          <el-select class="width200">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeState.status') + '：'">
          <el-select class="width200">
            <el-option></el-option>
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
        <el-button @click="runMonitoring">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.runMonitoring')}}
        </el-button>
        <el-button @click="stopMonitoring">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.stopMonitoring')}}
        </el-button>
        <el-button @click="banMonitoring">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.banMonitoring')}}
        </el-button>
        <el-button @click="temporarilyIgnore">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.temporarilyIgnore')}}
        </el-button>
        <el-button @click="cancelIgnore">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.cancelIgnore')}}
        </el-button>
        <el-button @click="offLine">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('acquisitionNodeState.offLine')}}
        </el-button>
        <el-select class="fr width200">
          <el-option></el-option>
        </el-select>
      </div>
      <!--表格-->
      <el-table :data="tableData" stripe>
        <el-table-column type="selection" fixed header-align="center" align="center" />
        <el-table-column :label="$t('public.index')" header-align="center" align="center">
          <template scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('acquisitionNodeState.nodeName')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.ip')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.port')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.nodeGroup')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.nodeType')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.equipmentNumber')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.description')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.status')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.executionStatus')" header-align="center" align="center" />
        <el-table-column :label="$t('acquisitionNodeState.lastExecutionTime')" header-align="center" align="center" />
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
  import Box from '../../components/Box';
  export default {
    name: "acquisitionNodeState",
    components:{Box},
    data() {
      return {
        tableData:[
          {},{}
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
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      },
      // 执行监测
      runMonitoring(){
        this.$confirm('请问是否确认立即开始执行监测?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning',
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 停止监测
      stopMonitoring(){
        this.$confirm('请问是否确认要停止正在执行的监测?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
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
