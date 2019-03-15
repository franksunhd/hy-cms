<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item label="用户名/账号：">
        <el-input v-model="username" />
      </el-form-item>
      <el-form-item label="所属组织：">
        <el-select v-model="organization">
          <el-option
            v-for="item in organizationList"
            :label="item.label"
            :value="item.value"
            :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in statusList"
            :value="item.value"
            :key="item.key"
            :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button>新增</el-button>
      <el-button>启用</el-button>
      <el-button>禁用</el-button>
      <el-button>删除</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
      <el-table-column label="用户名" header-align="center" align="center" />
      <el-table-column label="登录账号" header-align="center" align="center" />
      <el-table-column label="所属组织" header-align="center" align="center" />
      <el-table-column label="用户角色" header-align="center" align="center" />
      <el-table-column label="手机" header-align="center" align="center" />
      <el-table-column label="邮箱" header-align="center" align="center" />
      <el-table-column label="状态" header-align="center" align="center" />
      <el-table-column label="创建人" width="200" header-align="center" align="center" />
      <el-table-column label="创建时间" width="200" header-align="center" align="center" />
      <el-table-column label="操作" width="120" header-align="center" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">重置密码</el-button>
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
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "user-maintenance",
    components:{Box},
    data(){
      return {
        organizationList:[],
        tableData:[
          {},{}
        ],
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
        organization:'',
        username:'',
        status:'',
        options:{
          total:1000, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
          firstPage:1, // 首页
          lastPage:100 // 末页
        }
      }
    },
    methods:{
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      }
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
