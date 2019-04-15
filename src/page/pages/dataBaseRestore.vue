<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataBaseManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataBaseRestore')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('dataBaseRestore.backUpObject') + '：'">
          <el-input class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('dataBaseRestore.backUpTime') + '：'">
          <el-date-picker
            class="width120"
            v-model="startTime"
            type="date"
            :placeholder="$t('public.selectDate')"/>
          <span>—</span>
          <el-date-picker
            class="width120"
            v-model="endTime"
            type="date"
            :placeholder="$t('public.selectDate')"/>
        </el-form-item>
        <el-form-item :label="$t('dataBaseRestore.backUpType') + '：'">
          <el-select v-model="status" class="width200">
            <el-option value="0" :label="$t('dataBaseRestore.singleTable')"/>
            <el-option value="1" :label="$t('dataBaseRestore.wholeLibrary')"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button @click="runRestore" :disabled="disableBtn.enable">
          <i class="el-icon-circle-check-outline"></i>
          {{$t('dataBaseRestore.runRestore')}}
        </el-button>
        <el-button class="queryBtn" @click="deleteRestore" :disabled="disableBtn.more">
          <i class="el-icon-delete"></i>
          {{$t('dataBaseRestore.deleteRestore')}}
        </el-button>
        <el-button @click="restoreHistory" :disabled="disableBtn.edit">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('dataBaseRestore.restoreHistory')}}
        </el-button>
        <el-button @click="backUpRole" :disabled="disableBtn.edit">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('dataBaseRestore.backUpRole')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
        <el-table-column type="selection" fixed header-align="left" align="left"/>
        <el-table-column :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('dataBaseRestore.backUpObject')" header-align="left" align="left"/>
        <el-table-column :label="$t('dataBaseRestore.backUpTime')" header-align="left" align="left"/>
        <el-table-column :label="$t('dataBaseRestore.storageLocation')" header-align="left" align="left"/>
        <el-table-column :label="$t('dataBaseRestore.dataSize')" header-align="left" align="left"/>
        <el-table-column :label="$t('dataBaseRestore.note')" header-align="left" align="left"/>
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :pageSize='options.pageSize'
        :firstPage='options.firstPage'
        :lastPage='options.lastPage'
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--还原的执行史-->
    <el-dialog
      class="dataBaseRestore-history-dialog"
      append-to-body
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
              icon="el-icon-more"/>
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
      append-to-body
      :title="$t('dataBaseRestore.backUpRole')"
      class="dataBaseClear-box dataBaseRestore-history-dialog"
      :visible.sync="dialogVisibleAlert"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <my-cron>
        <el-form-item slot="header" :label="$t('dataBaseRestore.keepTime') + '：'">
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
      </my-cron>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleAlert = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisibleAlert = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import myCron from '../../components/cron';

  export default {
    name: "dataBaseRestore",
    components: {Box, myCron},
    data() {
      return {
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        status: '',
        radio: '',
        startTime: '',
        endTime: '',
        tableData: [
          {status: 1}, {status: 0}, {status: 1}, {status: 0}, {status: 1}, {status: 1}
        ],
        options: {
          total: 1000, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
          firstPage: 1, // 首页
          lastPage: 100 // 末页
        },
        dialogVisible: true,
        dialogVisibleAlert: false,
        timelineData: [
          {label: '2019年2月1日', level: 1, des: null},
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {label: '2019年1月31日', level: 1, des: null},
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {label: '2019年1月30日', level: 1, des: null},
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          },
          {
            label: '2019-02-01 23:16:18',
            level: 2,
            des: '用户admin 利用 /mysql-5.7.12-winx64/backup/20190306/bsmdb_20190306230345.sql 进行了 bsmdb整库 还原',
          }
        ]
      }
    },
    methods: {
      // 当前选中条数
      selectTableNum(data) {
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
            for (var i = 0; i < data.length; i++) {
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
      handleCurrentChange(val) {
        console.log(val)
      },
      // 执行还原
      runRestore() {

      },
      // 删除
      deleteRestore() {

      },
      // 还原的执行历史
      restoreHistory() {
        this.dialogVisible = true;
      },
      // 备份文件的清理规则
      backUpRole() {
        this.dialogVisibleAlert = true;
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

  .dataBaseRestore-history-dialog .el-dialog {
    width: 500px;
    height: 500px;
  }
</style>
