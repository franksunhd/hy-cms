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
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('roleMaintenance.roleName') + '：'">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.roleDate') + '：'">
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
        <el-form-item>
          <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button type="warning" class="queryBtn" @click="dialogVisible = true">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('public.add')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.edit" @click="dialogVisible = true">
          <i class="el-icon-edit-outline"></i>
          {{$t('public.edit')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.enable" @click="enableData">
          <i class="el-icon-circle-check-outline"></i>
          {{$t('public.enable')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.disable" @click="disableData">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('public.disable')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
          <i class="el-icon-delete"></i>
          {{$t('public.delete')}}
        </el-button>
        <el-button :disabled="disableBtn.edit" @click="authorizationData">
          <i class="el-icon-delete"></i>
          {{$t('roleMaintenance.userAuthorization')}}
        </el-button>
        <el-button :disabled="disableBtn.edit" @click="functionData">
          <i class="el-icon-delete"></i>
          {{$t('roleMaintenance.functionLimit')}}
        </el-button>
        <el-button :disabled="disableBtn.edit" @click="infoData">
          <i class="el-icon-delete"></i>
          {{$t('roleMaintenance.dataLimit')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
        <el-table-column type="selection" fixed header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.roleName')" header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.organization')" header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.userNum')" header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.status')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('roleMaintenance.createName')" header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.createTime')" header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.updateName')" header-align="center" align="center" />
        <el-table-column :label="$t('roleMaintenance.updateTime')" width="200" header-align="center" align="center" />
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
        <el-button class="queryBtn" type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
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
          <el-button type="primary" class="queryBtn" @click="innerVisible = true">{{$t('roleMaintenance.select')}}</el-button>
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
            <el-input class="width200" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="innerTableData" stripe>
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
          <el-button class="queryBtn" type="primary" @click="innerVisible = false">{{$t('public.confirm')}}</el-button>
          <el-button class="queryBtn" @click="innerVisible = false">{{$t('public.cancel')}}</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button class="queryBtn" type="primary" @click="outerVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="outerVisible = false">{{$t('public.close')}}</el-button>
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
        <el-button class="queryBtn" type="primary" @click="dialogVisibleFunction = false">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisibleFunction = false">{{$t('public.cancel')}}</el-button>
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
          <el-radio-group v-model="status">
            <el-radio :label="3">资源视图</el-radio>
            <el-radio :label="6">业务视图</el-radio>
            <el-radio :label="9">机房视图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input class="width200" />
          <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :checked="checked" @change="checkedAll">全选</el-checkbox>
          <el-tree
            id="dataLimit-box"
            node-key="id"
            :data="organizationList"
            :default-expand-all="true"
            show-checkbox
            ref="vueTree" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary" @click="dialogVisibleData = false">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisibleData = false">{{$t('public.cancel')}}</el-button>
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
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        checked:false,
        startTime:'',
        endTime:'',
        dialogVisible:false,
        outerVisible:false,
        innerVisible:false,
        dialogVisibleFunction:false,
        dialogVisibleData:false,
        tableData:[
          {status:1},{status:0},{status:1},{status:0},{status:1},{status:1}
        ],
        innerTableData:[
          {status:1},{status:0},{status:1},{status:0},{status:1},{status:1}
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
      },
      // 全选和取消全选
      checkedAll(){
        this.checked = !this.checked;
        if (this.checked) {
          //全选
          this.$refs.vueTree.setCheckedNodes(this.organizationList);
        }else{
          //取消选中
          this.$refs.vueTree.setCheckedKeys([]);
        }
      }
    },
    created(){
      // this.$store.commit('setLoading',true);
    },
  }
</script>

<style>
  #dataLimit-box > div.el-tree-node > div.el-tree-node__children > div.el-tree-node > div.el-tree-node__children > div.el-tree-node {
    float: left;
  }
</style>
