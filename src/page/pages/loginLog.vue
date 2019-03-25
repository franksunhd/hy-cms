<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.loginLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('loginLog.userName') + '：'">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('loginLog.loginDate') + '：'">
          <el-date-picker
            class="width120"
            v-model="startTime"
            type="date"
            :placeholder="$t('public.selectDate')" />
          <span>—</span>
          <el-date-picker
            class="width120"
            v-model="endTime"
            type="date"
            :placeholder="$t('public.selectDate')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--表格-->
      <el-table :data="tableData" stripe>
        <el-table-column :label="$t('public.index')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.name')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.account')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.loginType')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.loginIpAddress')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.logInTime')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.logOutTime')" header-align="center" align="center" />
        <el-table-column :label="$t('loginLog.timeLength')" header-align="center" align="center" />
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
    name: "loginLog",
    components:{Box},
    data() {
      return {
        startTime:'',
        endTime:'',
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
      }
    },
    methods: {
      // 外层 改变当前页码
      handleCurrentChange(val){
        console.log(val);
      },
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
