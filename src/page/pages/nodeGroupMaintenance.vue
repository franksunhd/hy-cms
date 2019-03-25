<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.deviceAcquisitionSettings')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.nodeGroupMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('nodeGroupMaintenance.groupName') + '：'">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button type="warning" class="queryBtn" @click="dialogVisible = true">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('public.add')}}
        </el-button>
        <el-button class="queryBtn" @click="dialogVisible = true">
          <i class="el-icon-edit-outline"></i>
          {{$t('public.edit')}}
        </el-button>
        <el-button class="queryBtn" @click="enableData">
          <i class="el-icon-circle-check-outline"></i>
          {{$t('public.enable')}}
        </el-button>
        <el-button class="queryBtn" @click="disableData">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('public.disable')}}
        </el-button>
        <el-button class="queryBtn" @click="deleteData">
          <i class="el-icon-delete"></i>
          {{$t('public.delete')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" stripe>
        <el-table-column type="selection" fixed />
        <el-table-column :label="$t('public.index')" header-align="center" align="center" />
        <el-table-column :label="$t('nodeGroupMaintenance.nodeGroupName')" header-align="center" align="center" />
        <el-table-column :label="$t('nodeGroupMaintenance.description')" header-align="center" align="center" />
        <el-table-column :label="$t('nodeGroupMaintenance.collectionNodesNum')" header-align="center" align="center" />
        <el-table-column :label="$t('nodeGroupMaintenance.status')" header-align="center" align="center" />
        <el-table-column :label="$t('nodeGroupMaintenance.createName')" header-align="center" align="center" />
        <el-table-column :label="$t('nodeGroupMaintenance.createTime')" header-align="center" align="center" />
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
    <!--新增编辑-->
    <el-dialog
      :title="$t('nodeGroupMaintenance.createUpdateNode')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="120px">
        <el-form-item :label="$t('nodeGroupMaintenance.nodeGroupName') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('nodeGroupMaintenance.isEnable') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('nodeGroupMaintenance.note') + '：'">
          <el-input type="textarea" :autosize="{minRows:3}" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "nodeGroupMaintenance",
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
        status:''
      }
    },
    methods: {
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      },
      // 启用
      enableData() {
        this.$confirm('请问是否确认启用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        this.$confirm('请问是否确认禁用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        this.$confirm('请问是否确认删除当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
