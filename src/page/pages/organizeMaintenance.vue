<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.organizeMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item label="组织名称：">
        <el-input />
      </el-form-item>
      <el-form-item label="创建/更新日期：">
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="选择日期" />
        <span>~</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button @click="dialogVisible = true">新增</el-button>
      <el-button @click="enableData">启用</el-button>
      <el-button @click="disableData">禁用</el-button>
      <el-button @click="deleteData">删除</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column label="组织名称" width="120" header-align="center" align="center" />
      <el-table-column label="角色数量" width="120" header-align="center" align="center" />
      <el-table-column label="用户数量" width="120" header-align="center" align="center" />
      <el-table-column label="状态" width="120" header-align="center" align="center" />
      <el-table-column label="创建人" width="120" header-align="center" align="center" />
      <el-table-column label="创建时间" width="120" header-align="center" align="center" />
      <el-table-column label="更新人" width="120" header-align="center" align="center" />
      <el-table-column label="更新时间" width="120" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogVisible = true">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pages
      :total='options.total'
      :currentPage='options.currentPage'
      :pageSize='options.pageSize'
      :firstPage='options.firstPage'
      :lastPage='options.lastPage'
      @handleCurrentChangeSub="handleCurrentChange" />
    <!--新增、编辑-->
    <el-dialog
      title="新增/修改组织"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item label="父级组织：">
          <el-select v-model="organization">
            <el-option
              v-for="item in organizationList"
              :label="item.label"
              :value="item.value"
              :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="组织名称：">
          <el-input />
        </el-form-item>
        <el-form-item label="显示顺序：">
          <el-input />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组织描述：">
          <el-input type="textarea" :autosize="{ minRows: 3 }" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "organize-maintenance",
    components:{Box},
    data(){
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
        dialogVisible:false,
        organizationList:[],
        organization:'',
        status:''
      }
    },
    methods:{
// 启用
      enableData(){
        this.$confirm('请问是否确认启用当前的记录?','确认提示',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        this.$confirm('请问是否确认禁用当前的记录?','确认提示',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        this.$confirm('请问是否确认删除当前的记录?','确认提示',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
