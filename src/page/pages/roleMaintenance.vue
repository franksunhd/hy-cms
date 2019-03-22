<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.roleMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item :label="$t('roleMaintenance.roleName') + '：'">
        <el-input />
      </el-form-item>
      <el-form-item :label="$t('roleMaintenance.roleDate') + '：'">
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
      <el-form-item>
        <el-button type="primary">{{$t('public.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button @click="dialogVisible = true">{{$t('public.add')}}</el-button>
      <el-button @click="enableData">{{$t('public.enable')}}</el-button>
      <el-button @click="disableData">{{$t('public.disable')}}</el-button>
      <el-button @click="deleteData">{{$t('public.delete')}}</el-button>

      <el-button @click="authorizationData">{{$t('roleMaintenance.userAuthorization')}}</el-button>
      <el-button @click="functionData">{{$t('roleMaintenance.functionLimit')}}</el-button>
      <el-button @click="infoData">{{$t('roleMaintenance.dataLimit')}}</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column :label="$t('roleMaintenance.roleName')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.organization')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.userNum')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.status')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.createName')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.createTime')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.updateName')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('roleMaintenance.updateTime')" width="120" header-align="center" align="center" />
      <el-table-column :label="$t('public.operation')" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogVisible = true">{{$t('public.edit')}}</el-button>
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
      :title="$t('roleMaintenance.addUpdateRole')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('roleMaintenance.organization') +'：'">
          <selectTree width="200" :options="organizationList" v-model="organization" />
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.roleName') +'：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.orderIndex') +'：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.isEnable') +'：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.organizationDes') +'：'">
          <el-input type="textarea" :autosize="{ minRows: 3 }" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--用户授权-->
    <el-dialog
      :title="$t('roleMaintenance.setUserName')"
      :visible.sync="outerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('roleMaintenance.roleOrganization') + '：'">
          <span>集团亚洲总部-->上海分部</span>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.pleaseSelectUser') + '：'">
          <el-button @click="innerVisible = true">{{$t('roleMaintenance.select')}}</el-button>
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
        :title="$t('roleMaintenance.selectUser')"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form inline>
          <el-form-item :label="$t('public.name') + '：'">
            <el-input />
          </el-form-item>
          <el-form-item>
            <el-button>{{$t('public.query')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="innerTableData" border>
          <el-table-column type="selection" />
          <el-table-column :label="$t('public.name')" header-align="center" align="center" />
          <el-table-column :label="$t('roleMaintenance.account')" header-align="center" align="center" />
          <el-table-column :label="$t('public.sex')" header-align="center" align="center" />
          <el-table-column :label="$t('roleMaintenance.registerDate')" header-align="center" align="center" />
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
          <el-button type="primary" @click="innerVisible = false">{{$t('public.confirm')}}</el-button>
          <el-button @click="innerVisible = false">{{$t('public.cancel')}}</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button type="primary" @click="outerVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="outerVisible = false">{{$t('public.close')}}</el-button>
      </div>
    </el-dialog>
    <!--功能权限-->
    <el-dialog
      :title="$t('roleMaintenance.setRoleLimit')"
      :visible.sync="dialogVisibleFunction"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="100px">
        <el-form-item :label="$t('roleMaintenance.roleLimit') + '：'">
          <el-tree
            :data="organizationList"
            show-checkbox
            ref="tree" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleFunction = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisibleFunction = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--数据权限-->
    <el-dialog
      :title="$t('roleMaintenance.setDateLimit')"
      :visible.sync="dialogVisibleData"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('roleMaintenance.setDateLimit') + '：'">
          <el-tree
            id="dataLimit-box"
            :data="organizationList"
            :default-expand-all="true"
            show-checkbox
            ref="tree" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleData = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisibleData = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import selectTree from '../../components/selectTree';
  export default {
    name: "role-maintenance",
    components:{Box,selectTree},
    data(){
      return {
        startTime:'',
        endTime:'',
        dialogVisible:false,
        outerVisible:false,
        innerVisible:false,
        dialogVisibleFunction:false,
        dialogVisibleData:true,
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
        organization:'',
        tags:[
          {id:1,label:'张思'},
          {id:2,label:'李四'},
          {id:3,label:'王五'},
          {id:4,label:'赵六'},
        ],
        // 数据默认字段
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'label',       // 标签显示
          children: 'children', // 子级
        },
        organizationList:[
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
        ],
        flag:false,
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
        this.$confirm('请问是否确认启用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        this.$confirm('请问是否确认禁用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        this.$confirm('请问是否确认删除当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
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
      // this.$store.commit('setLoading',true);
    }
  }
</script>

<style>
  #dataLimit-box > div.el-tree-node > div.el-tree-node__children > div.el-tree-node > div.el-tree-node__children > div.el-tree-node {
    float: left;
  }
</style>
