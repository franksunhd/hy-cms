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
        <el-button @click="editTimer">
          <i class="el-icon-edit-outline"></i>
          {{$t('backUpTimer.editTimer')}}
        </el-button>
        <el-button @click="runTimer">
          <i class="el-icon-circle-check-outline"></i>
          {{$t('backUpTimer.runTimer')}}
        </el-button>
        <el-button @click="deleteTimer" class="queryBtn">
          <i class="el-icon-delete"></i>
          {{$t('backUpTimer.deleteTimer')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" stripe>
        <el-table-column type="selection" fixed />
        <el-table-column :label="$t('public.index')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.taskName')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.createTime')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.backUpObject')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.ruleDescription')" header-align="center" align="center" />
        <el-table-column :label="$t('backUpTimer.status')" header-align="center" align="center" />
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
        startTime:'',
        endTime:'',
        backUpType:'',
        backUpStatus:'',
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
        dialogVisibleAlert:false,
      }
    },
    methods: {
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
