<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataBaseManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.backUpTimer')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('backUpTimer.createTime') + '：'">
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
        <el-form-item :label="$t('backUpTimer.backUpType') + '：'">
          <el-select v-model="backUpType" class="width200">
            <el-option value="0" :label="$t('backUpTimer.singleTable')"/>
            <el-option value="1" :label="$t('backUpTimer.wholeLibrary')"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('backUpTimer.backUpStatus') + '：'">
          <el-select v-model="backUpStatus" class="width200">
            <el-option value="0" :label="$t('backUpTimer.running')"/>
            <el-option value="1" :label="$t('backUpTimer.stopped')"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button type="warning" @click="addTimer">
					<span class="iconfont fs14">&#xe689;</span>
          {{$t('backUpTimer.addTimer')}}
        </el-button>
        <el-button @click="editTimer" :disabled="disableBtn.edit">
					<span class="iconfont fs14">&#xe641;</span>
          {{$t('backUpTimer.editTimer')}}
        </el-button>
        <el-button @click="runTimer" :disabled="disableBtn.enable">
					<span class="iconfont fs14">&#xe645;</span>
          {{$t('backUpTimer.runTimer')}}
        </el-button>
        <el-button @click="deleteTimer" :disabled="disableBtn.more" class="queryBtn">
					<span class="iconfont fs14">&#xe647;</span>
          {{$t('backUpTimer.deleteTimer')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" border stripe @select="selectTableNum" @select-all="selectTableNum">
        <el-table-column type="selection" fixed header-align="left" align="left"/>
        <el-table-column :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('backUpTimer.taskName')" header-align="left" align="left"/>
        <el-table-column :label="$t('backUpTimer.createTime')" header-align="left" align="left"/>
        <el-table-column :label="$t('backUpTimer.backUpObject')" header-align="left" align="left"/>
        <el-table-column :label="$t('backUpTimer.ruleDescription')" header-align="left" align="left"/>
        <el-table-column :label="$t('backUpTimer.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{$t('public.enable')}}</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">{{$t('public.disable')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('backUpTimer.note')" header-align="left" align="left"/>
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :pageSize='options.pageSize'
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--新增编辑-->
    <el-dialog
      append-to-body
      :title="$t('backUpTimer.backUpTimerTitle')"
      class="dataBaseClear-box"
      :visible.sync="dialogVisibleAlert"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <my-cron>
        <el-form-item slot="header" :label="$t('backUpTimer.backUpObject') + '：'">
          <span>MySQL</span>
          <span> &nbsp; > &nbsp; </span>
          <el-select>
            <el-option></el-option>
          </el-select>
          <span> &nbsp; > &nbsp; </span>
          <el-select>
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="footers" :label="$t('backUpTimer.ruleDescription') + '：'">
          <el-input type="textarea" :autosize="{ minRows: 3}"/>
        </el-form-item>
      </my-cron>
      <span slot="footer">
        <el-button class="alertBtn" type="primary" @click="dialogVisibleAlert = false">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="dialogVisibleAlert = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import myCron from '../../../../components/cron';

  export default {
    name: "backUpTimer",
    components: {Box, myCron},
    data() {
      return {
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        startTime: '',
        endTime: '',
        backUpType: '',
        backUpStatus: '',
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
        dialogVisibleAlert: false,
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
      handleCurrentChange(val) {},
      // 新增定时器
      addTimer() {
        this.dialogVisibleAlert = true;
      },
      // 编辑定时器
      editTimer() {
        this.dialogVisibleAlert = true;
      },
      // 运行定时器
      runTimer() {

      },
      // 删除
      deleteTimer() {

      }
    },
    created() {
    }
  }
</script>

<style>
  .dataBaseClear-box .el-dialog {
    width: 700px;
    height: 500px;
  }
</style>
