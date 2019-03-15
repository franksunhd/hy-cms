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
      <el-button @click="dialogVisible = true">新增</el-button>
      <el-button @click="enableData">启用</el-button>
      <el-button @click="disableData">禁用</el-button>
      <el-button @click="deleteData">删除</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column type="index" label="序号" width="60" header-align="center" align="center" />
      <el-table-column label="用户名" width="100" header-align="center" align="center" />
      <el-table-column label="登录账号" width="100" header-align="center" align="center" />
      <el-table-column label="所属组织" width="100" header-align="center" align="center" />
      <el-table-column label="用户角色" width="100" header-align="center" align="center" />
      <el-table-column label="手机" width="100" header-align="center" align="center" />
      <el-table-column label="邮箱" width="100" header-align="center" align="center" />
      <el-table-column label="状态" width="100" header-align="center" align="center" />
      <el-table-column label="创建人" width="200" header-align="center" align="center" />
      <el-table-column label="创建时间" width="200" header-align="center" align="center" />
      <el-table-column label="操作" width="120" header-align="center" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogVisible = true">编辑</el-button>
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
    <!--新增编辑-->
    <el-dialog
      title="新增/编辑管理用户信息"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item label="所属组织：">
          <el-select v-model="organization">
            <el-option
              v-for="item in organizationList"
              :label="item.label"
              :value="item.value"
              :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input />
        </el-form-item>
        <el-form-item label="登录账号：">
          <el-input />
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-input type="password" />
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input />
        </el-form-item>
        <el-form-item label="电子邮箱：">
          <el-input />
        </el-form-item>
        <el-form-item label="启用状态：">
          <el-radio-group v-model="status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分配角色：">
          <el-checkbox-group v-model="checkListValue">
            <template v-for="(item,index) in checkList">
              <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
              <br>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "user-maintenance",
    components:{Box},
    data(){
      return {
        dialogVisible:false,
        organizationList:[],
        tableData:[
          {},{}
        ],
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
        organization:'',
        checkListValue:[],
        checkList:[
          {label:'系统管理员', value:1},
          {label:'区域经理',value:2}
        ],
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
      },
      // 启用
      enableData() {
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
      }
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
