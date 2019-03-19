<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataBaseManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.backUpTimer')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item :label="$t('backUpTimer.createTime') + '：'">
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
      <el-form-item :label="$t('backUpTimer.backUpType') + '：'">
        <el-select>
          <el-option value="0" :label="$t('backUpTimer.singleTable')" />
          <el-option value="1" :label="$t('backUpTimer.wholeLibrary')" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('backUpTimer.backUpStatus') + '：'">
        <el-select>
          <el-option value="0" :label="$t('backUpTimer.running')" />
          <el-option value="1" :label="$t('backUpTimer.stopped')" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">{{$t('public.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button @click="addTimer">{{$t('backUpTimer.addTimer')}}</el-button>
      <el-button @click="editTimer">{{$t('backUpTimer.editTimer')}}</el-button>
      <el-button @click="runTimer">{{$t('backUpTimer.runTimer')}}</el-button>
      <el-button @click="deleteTimer">{{$t('backUpTimer.deleteTimer')}}</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
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
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "backUpTimer",
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
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      },
      // 新增定时器
      addTimer(){

      },
      // 编辑定时器
      editTimer(){

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
