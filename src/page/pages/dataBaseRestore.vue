<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataBaseManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataBaseRestore')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item :label="$t('dataBaseRestore.backUpObject') + '：'">
        <el-input />
      </el-form-item>
      <el-form-item :label="$t('dataBaseRestore.backUpTime') + '：'">
        <el-date-picker
          v-model="startTime"
          type="date"
          :placeholder="$t('public.selectDate')" />
        <span>~</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          :placeholder="$t('public.selectDate')" />
      </el-form-item>
      <el-form-item :label="$t('dataBaseRestore.backUpType') + '：'">
        <el-select>
          <el-option value="0" :label="$t('dataBaseRestore.singleTable')" />
          <el-option value="1" :label="$t('dataBaseRestore.wholeLibrary')" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">{{$t('public.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button @click="runRestore">{{$t('dataBaseRestore.runRestore')}}</el-button>
      <el-button @click="deleteRestore">{{$t('dataBaseRestore.deleteRestore')}}</el-button>
      <el-button @click="restoreHistory">{{$t('dataBaseRestore.restoreHistory')}}</el-button>
      <el-button @click="backUpRole">{{$t('dataBaseRestore.backUpRole')}}</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column :label="$t('public.index')" header-align="center" align="center" />
      <el-table-column :label="$t('dataBaseRestore.backUpObject')" header-align="center" align="center" />
      <el-table-column :label="$t('dataBaseRestore.backUpTime')" header-align="center" align="center" />
      <el-table-column :label="$t('dataBaseRestore.storageLocation')" header-align="center" align="center" />
      <el-table-column :label="$t('dataBaseRestore.dataSize')" header-align="center" align="center" />
      <el-table-column :label="$t('dataBaseRestore.note')" header-align="center" align="center" />
    </el-table>
    <!--分页-->
    <pages
      :total='options.total'
      :currentPage='options.currentPage'
      :pageSize='options.pageSize'
      :firstPage='options.firstPage'
      :lastPage='options.lastPage'
      @handleCurrentChangeSub="handleCurrentChange" />
    <!--还原的执行史-->
    <el-dialog
      :title="$t('dataBaseRestore.restoreHistory')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="timeLineBox">
        <el-timeline>
          <template v-for="(item,index) in timelineData">
            <el-timeline-item
              class="timeLine-title"
              v-if="item.level === 1"
              :timestamp="item.label"
              placement="top"
              size="large"
              icon="el-icon-more" />
            <el-timeline-item v-else :timestamp="item.label" placement="top" size="normal">
              <p>{{item.des}}</p>
            </el-timeline-item>
          </template>
        </el-timeline>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('dataBaseRestore.showMore')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--备份文件的清理规则-->
    <el-dialog
      :title="$t('dataBaseRestore.backUpRole')"
      class="dataBaseClear-box"
      :visible.sync="dialogVisibleAlert"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="100px">
        <el-form-item :label="$t('dataBaseRestore.keepTime') + '：'">
          <el-radio-group v-model="radio">
            <el-radio :label="0">1{{$t('public.month')}}</el-radio>
            <el-radio :label="1">3{{$t('public.months')}}</el-radio>
            <el-radio :label="2">6{{$t('public.months')}}</el-radio>
            <el-radio :label="3">9{{$t('public.months')}}</el-radio>
            <el-radio :label="4">1{{$t('public.year')}}</el-radio>
            <el-radio :label="5">2{{$t('public.years')}}</el-radio>
            <el-radio :label="6">3{{$t('public.years')}}</el-radio>
            <el-radio :label="7">{{$t('public.permanent')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <cron />
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleAlert = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisibleAlert = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import cron from '../../components/cron';
  export default {
    name: "dataBaseRestore",
    components:{Box,cron},
    data() {
      return {
        radio:'',
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
        dialogVisible:false,
        dialogVisibleAlert:true,
        timelineData:[
          {label:'2019年2月1日', level:1, des:null},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019年1月31日', level:1, des:null},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019年1月30日', level:1, des:null},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',},
          {label:'2019-02-01 23:16:18', level:2, des:'用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',}
        ]
      }
    },
    methods: {
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      },
      // 执行还原
      runRestore(){

      },
      // 删除
      deleteRestore(){

      },
      // 还原的执行历史
      restoreHistory(){

      },
      // 备份文件的清理规则
      backUpRole(){

      }
    },
    created() {
    }
  }
</script>

<style>
  .timeLineBox {
    height: 300px;
    overflow-y: scroll;
  }

  .timeLine-title .el-timeline-item__timestamp {
    font-size: 20px;
  }

  .dataBaseClear-box .el-radio {
    margin-right: 15px;
  }
</style>
