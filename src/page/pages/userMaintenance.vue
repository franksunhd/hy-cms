<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('userMaintenance.account') + '：'">
          <el-input v-model="username" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.organization') + '：'">
          <selectTree width="200" :options="organizationList" v-model="organization" />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.status') + '：'">
          <el-select v-model="status" class="width200">
            <el-option
              v-for="item in statusList"
              :value="item.value"
              :key="item.key"
              :label="item.label" />
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
        <el-button type="warning" @click="dialogVisible = true" class="queryBtn">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('public.add')}}
        </el-button>
        <el-button :disabled="disableBtn.edit" @click="dialogVisible = true" class="queryBtn">
          <i class="el-icon-edit-outline"></i>
          {{$t('public.edit')}}
        </el-button>
        <el-button :disabled="disableBtn.more">
          <i class="el-icon-refresh"></i>
          {{$t('public.resets')}}
        </el-button>
        <el-button :disabled="disableBtn.enable" @click="enableData" class="queryBtn">
          <i class="el-icon-circle-check-outline"></i>
          {{$t('public.enable')}}
        </el-button>
        <el-button :disabled="disableBtn.disable" @click="disableData" class="queryBtn">
          <i class="el-icon-circle-close-outline"></i>
          {{$t('public.disable')}}
        </el-button>
        <el-button :disabled="disableBtn.more" @click="deleteData" class="queryBtn">
          <i class="el-icon-delete"></i>
          {{$t('public.delete')}}
        </el-button>
      </div>
      <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
        <el-table-column type="selection" fixed header-align="center" align="center" />
        <el-table-column :label="$t('public.index')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('userMaintenance.username')" width="100" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.loginAccount')" width="100" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.organization')" width="100" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.userRole')" width="100" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.mobile')" width="100" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.email')" width="100" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.status')" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('userMaintenance.createName')" width="200" header-align="center" align="center" />
        <el-table-column :label="$t('userMaintenance.createTime')" header-align="center" align="center" />
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
      append-to-body
      :title="$t('userMaintenance.createUpdateUserInfo')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('userMaintenance.organization') + '：'">
          <selectTree width="200" :options="organizationList" v-model="organization" />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.username') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.loginAccount') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.loginPassword') + '：'">
          <el-input type="password" />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.mobileNum') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.statusAlert') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.assignRole') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.emails') + '：'">
          <el-checkbox-group v-model="checkListValue">
            <template v-for="(item,index) in checkList">
              <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
              <br>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import selectTree from '../../components/selectTree';
  export default {
    name: "user-maintenance",
    components:{Box,selectTree},
    data(){
      return {
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        dialogVisible:false,
        tableData:[
          {status:1},{status:0},{status:1},{status:0},{status:1},{status:1}
        ],
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
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
        },
        organization:'',
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
        ]
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
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      },
      // 启用
      enableData() {
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
      }
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
