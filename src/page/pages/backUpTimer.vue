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
            :placeholder="$t('public.selectDate')" />
          <span>—</span>
          <el-date-picker
            class="width120"
            v-model="endTime"
            type="date"
            :placeholder="$t('public.selectDate')" />
        </el-form-item>
        <el-form-item :label="$t('backUpTimer.backUpType') + '：'">
          <el-select v-model="backUpType" class="width200">
            <el-option value="0" :label="$t('backUpTimer.singleTable')" />
            <el-option value="1" :label="$t('backUpTimer.wholeLibrary')" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('backUpTimer.backUpStatus') + '：'">
          <el-select v-model="backUpStatus" class="width200">
            <el-option value="0" :label="$t('backUpTimer.running')" />
            <el-option value="1" :label="$t('backUpTimer.stopped')" />
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
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('backUpTimer.addTimer')}}
        </el-button>
        <el-button @click="editTimer" :disabled="disableBtn.edit">
          <i class="el-icon-edit-outline"></i>
          {{$t('backUpTimer.editTimer')}}
        </el-button>
        <el-button @click="runTimer" :disabled="disableBtn.enable">
          <i class="el-icon-circle-check-outline"></i>
          {{$t('backUpTimer.runTimer')}}
        </el-button>
        <el-button @click="deleteTimer" :disabled="disableBtn.more" class="queryBtn">
          <i class="el-icon-delete"></i>
          {{$t('backUpTimer.deleteTimer')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
        <el-table-column type="selection" fixed header-align="center" align="center" />
        <el-table-column :label="$t('public.index')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.taskName')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.createTime')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.backUpObject')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.ruleDescription')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.status')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('backUpTimer.note')" header-align="center" align="center" />
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
          <el-input type="textarea" :autosize="{ minRows: 3}" />
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
    name: "backUpTimer",
    components:{Box,myCron},
    data() {
      return {
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        startTime:'',
        endTime:'',
        backUpType:'',
        backUpStatus:'',
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
        dialogVisibleAlert:false,
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
      handleCurrentChange(val){
        console.log(val)
      },
      // 新增定时器
      addTimer(){
        this.dialogVisibleAlert = true;
      },
      // 编辑定时器
      editTimer(){
        this.dialogVisibleAlert = true;
      },
      // 运行定时器
      runTimer(){

      },
      // 删除
      deleteTimer(){

      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
