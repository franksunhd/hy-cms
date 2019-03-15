<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.roleMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item label="角色名称：">
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

      <el-button @click="authorizationData">用户授权</el-button>
      <el-button @click="functionData">功能权限</el-button>
      <el-button @click="infoData">数据权限</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column label="角色名称" width="120" header-align="center" align="center" />
      <el-table-column label="所属组织" width="120" header-align="center" align="center" />
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
    <!--新增/编辑-->
    <el-dialog
      title="新增/修改角色"
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
        <el-form-item label="角色名称：">
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
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--用户授权-->
    <el-dialog
      title="设置授权用户"
      :visible.sync="outerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item label="角色所属组织：">
          <span>集团亚洲总部-->上海分部</span>
        </el-form-item>
        <el-form-item label="请选择用户：">
          <el-button @click="innerVisible = true">选择</el-button>
          <div style="height: 20px;"></div>
          <el-tag
            v-for="(tag,index) in tags"
            :key="tag.id"
            @close="handleClose(tag)"
            :disable-transitions="true"
            style="margin-right: 20px;"
            closable>
            {{tag.label}}
          </el-tag>
        </el-form-item>
      </el-form>
      <el-dialog
        title="选择用户"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form inline>
          <el-form-item label="姓名：">
            <el-input />
          </el-form-item>
          <el-form-item>
            <el-button>查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="innerTableData" border>
          <el-table-column type="selection" />
          <el-table-column label="姓名" header-align="center" align="center" />
          <el-table-column label="账号" header-align="center" align="center" />
          <el-table-column label="性别" header-align="center" align="center" />
          <el-table-column label="登记日期" header-align="center" align="center" />
        </el-table>
        <!--分页-->
        <pages
          :total='innerOptions.total'
          :currentPage='innerOptions.currentPage'
          :pageSize='innerOptions.pageSize'
          :firstPage='innerOptions.firstPage'
          :lastPage='innerOptions.lastPage'
          @handleCurrentChangeSub="innerOptionsHandleCurrentChange" />
        <div slot="footer">
          <el-button type="primary" @click="innerVisible = false">确 认</el-button>
          <el-button @click="innerVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button type="primary" @click="outerVisible = false">确 认</el-button>
        <el-button @click="outerVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--功能权限-->
    <el-dialog
      title="设置角色权限"
      :visible.sync="dialogVisibleFunction"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="100px">
        <el-form-item label="角色权限：">
          <el-tree
            :data="treeDatas"
            show-checkbox
            ref="tree" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleFunction = false">确 定</el-button>
        <el-button @click="dialogVisibleFunction = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--数据权限-->
    <el-dialog
      title="设置数据权限"
      :visible.sync="dialogVisibleData"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item label="设置数据权限：">
          <el-tree
            :data="treeDatas"
            show-checkbox
            ref="tree" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleData = false">确 定</el-button>
        <el-button @click="dialogVisibleData = false">取 消</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "role-maintenance",
    components:{Box},
    data(){
      return {
        startTime:'',
        endTime:'',
        dialogVisible:false,
        outerVisible:false,
        innerVisible:false,
        dialogVisibleFunction:false,
        dialogVisibleData:false,
        tableData:[
          {},{}
        ],
        innerTableData:[
          {},{}
        ],
        options:{
          total:1000, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
          firstPage:1, // 首页
          lastPage:100 // 末页
        },
        innerOptions:{
          total:1000, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
          firstPage:1, // 首页
          lastPage:100 // 末页
        },
        status:'',
        organizationList:[],
        organization:'',
        tags:[
          {id:1,label:'张思'},
          {id:2,label:'李四'},
          {id:3,label:'王五'},
          {id:4,label:'赵六'},
        ],
        treeDatas:[
          {
            id:1,
            label:'集团亚洲总部',
            type:'branch',
            parentId:null,
            level:1,
            children:[
              {
                id:2,
                label:'上海分部',
                type:'branch',
                parentId:1,
                level:2,
                children:[
                  {
                    id:4,
                    label:'张三',
                    type:'user',
                    parentId:2,
                    level:3,
                  },
                  {
                    id:5,
                    label:'李四',
                    type:'user',
                    parentId:2,
                    level:3,
                  },
                  {
                    id:6,
                    label:'王五',
                    type:'user',
                    parentId:2,
                    level:3,
                  },
                ]
              },
              {
                id:3,
                label:'北京分部',
                type:'branch',
                parentId:1,
                level:2,
                children:[
                  {
                    id:7,
                    label:'赵六',
                    type:'user',
                    parentId:3,
                    level:3,
                  }
                ]
              },
              {
                id:10,
                label:'孙强',
                type:'user',
                parentId:1,
                level:2,
              },
              {
                id:13,
                label:'金流福',
                type:'user',
                parentId:1,
                level:2,
              }
            ]
          },
          {
            id:8,
            label:'集团欧洲总部',
            type:'branch',
            parentId:null,
            level:1,
            children:[
              {
                id:11,
                label:'雅玛',
                type:'user',
                parentId:8,
                level:2,
              },
              {
                id:14,
                label:'罗马分部',
                type:'branch',
                parentId:8,
                level:2,
                children:[]
              },
              {
                id:15,
                label:'英国分部',
                type:'branch',
                parentId:8,
                level:2,
                children:[
                  {
                    id:16,
                    label:'伦敦',
                    type:'user',
                    parentId:15,
                    level:3
                  }
                ]
              }
            ]
          },
          {
            id:9,
            label:'集团美洲总部',
            type:'branch',
            parentId:null,
            level:1,
            children:[
              {
                id:12,
                label:'三丝',
                type:'user',
                parentId:9,
                level:2
              },
              {
                id:17,
                label:'美国分部',
                type:'branch',
                parentId:9,
                level:2,
                children:[]
              },
              {
                id:18,
                label:'墨西哥分部',
                type:'branch',
                parentId:9,
                level:2,
                children:[
                  {
                    id:19,
                    label:'摩卡',
                    type:'user',
                    parentId:18,
                    level:3
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    methods:{
      // 外层 改变当前页码
      handleCurrentChange(val){
        console.log(val);
      },
      // 内层 改变当前页码
      innerOptionsHandleCurrentChange(val){
        console.log(val);
      },
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
      // 用户授权
      authorizationData(){
        this.outerVisible = true;
      },
      // 功能权限
      functionData(){
        this.dialogVisibleFunction = true;
      },
      // 数据权限
      infoData(){
        this.dialogVisibleData = true;
      },
      // 关闭标签
      handleClose(tag){
        for (var i = 0;i < this.tags.length;i++){
          if (tag.id === this.tags[i].id) {
            this.tags.splice(i,1);
          }
        }
        console.log(this.tags);
      }
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
