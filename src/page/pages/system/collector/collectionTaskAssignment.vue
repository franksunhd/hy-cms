<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.deviceAcquisitionSettings')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.collectionTaskAssignment')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline label-width="80px">
        <el-form-item :label="$t('collectionTaskAssignment.nodeName') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('collectionTaskAssignment.nodeIp') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('collectionTaskAssignment.nodePort') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('collectionTaskAssignment.groupName') + '：'">
          <el-select class="width200">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('collectionTaskAssignment.nodeType') + '：'">
          <el-select class="width200">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('collectionTaskAssignment.status') + '：'">
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
      <div class="marBottom16">
        <el-button @click="runMonitoring" :disabled="disableBtn.enable">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('collectionTaskAssignment.runMonitoring')}}
        </el-button>
        <el-button @click="stopMonitoring" :disabled="disableBtn.disable">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('collectionTaskAssignment.stopMonitoring')}}
        </el-button>
        <el-button @click="assignedTasks" :disabled="disableBtn.edit">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('collectionTaskAssignment.equipmentMonitoring')}}
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
        <el-table-column :label="$t('collectionTaskAssignment.nodeName')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.ip')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.port')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.nodeGroup')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.nodeType')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.equipmentNumber')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.description')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('collectionTaskAssignment.createName')" header-align="left" align="left"/>
        <el-table-column :label="$t('collectionTaskAssignment.createTime')" header-align="left" align="left"/>
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
    <!--分配设备监测任务-->
    <el-dialog
      append-to-body
      :title="$t('collectionTaskAssignment.createUpdateNode')"
      :visible.sync="dialogVisibleAlert"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('collectionTaskAssignment.nodeGroup') + '：'">
              温州机房
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('collectionTaskAssignment.nodeName') + '：'">
              A01
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('collectionTaskAssignment.nodeIp') + '：'">
              192.168.0.1
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('collectionTaskAssignment.nodePort') + '：'">
              8080
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <p>{{$t('collectionTaskAssignment.monitoringTask') + '：'}}</p>
          <p>穿梭框插件</p>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleAlert = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisibleAlert = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';

  export default {
    name: "collectionTaskAssignment",
    components: {Box},
    data() {
      return {
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
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
        dialogVisibleAlert: false
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
      // 执行监测
      runMonitoring() {
        this.$confirm('请问是否确认立即开始执行监测?', this.$t('public.confirmTip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning',
        }).then(() => {

        }).catch(() => {
          return;
        });
      },
      // 停止监测
      stopMonitoring() {
        this.$confirm('请问是否确认要停止正在执行的监测?', this.$t('public.confirmTip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning',

        }).then(() => {

        }).catch(() => {
          return;
        });
      },
      // 分配设备监测任务
      assignedTasks() {
        this.dialogVisibleAlert = true;
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
