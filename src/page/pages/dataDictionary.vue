<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataDictionary')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col :span="4">
        <p class="dataDictionary-title">
          <a href="javascript:;">{{$t('dataDictionary.systemDataDictionary')}}</a>
        </p>
        <el-tree
          style="width: 200px;"
          :data="treeData"
          @node-click="getCurrentNode"
          :expand-on-click-node="false"
          :default-expand-all="true"/>
      </el-col>
      <el-col :span="20">
        <div class="padding20 borderBottom">
          <!--表单-->
          <el-form inline>
            <el-form-item :label="$t('dataDictionary.businessCode') + '：'">
              <el-input class="width200" />
            </el-form-item>
            <el-form-item :label="$t('dataDictionary.dictionaryName') + '：'">
              <el-input class="width200" />
            </el-form-item>
            <el-form-item :label="$t('dataDictionary.status') + '：'">
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
          </div>
          <!--表格-->
          <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
            <el-table-column type="selection" fixed header-align="center" align="center" />
            <el-table-column :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('dataDictionary.dictionaryType')" width="150" header-align="center" align="center" />
            <el-table-column :label="$t('dataDictionary.dictionaryName')" width="150" header-align="center" align="center" />
            <el-table-column :label="$t('dataDictionary.businessCode')" width="150" header-align="center" align="center" />
            <el-table-column :label="$t('dataDictionary.directoryLevel')" width="150" header-align="center" align="center" />
            <el-table-column :label="$t('dataDictionary.sort')" width="150" header-align="center" align="center" />
            <el-table-column :label="$t('dataDictionary.status')" width="150" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">启用</span>
                <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('dataDictionary.createName')" width="150" header-align="center" align="center" />
            <el-table-column :label="$t('dataDictionary.createTime')" width="150" header-align="center" align="center" />
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
      </el-col>
    </el-row>
    <!--新增编辑-->
    <el-dialog
      :title="$t('dataDictionary.createUpdateDictionary')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('dataDictionary.parentDictionary') + '：'">
          <selectTree width="200" :options="treeData" v-model="organization" />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.dictionaryType') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.businessCode') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.dictionaryName') + '：'">
          <el-input type="password" />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.directoryLevel') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.orderIndex') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.statusAlert') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import selectTree from '../../components/selectTree';
  export default {
    name: "dataDictionary",
    components:{Box,selectTree},
    data() {
      return {
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        dialogVisible:false,
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
        status:'',
        organization:'',
        treeData:[
          {
            id:1,
            label:'告警严重程度',
            parentId:null,
            level:1,
            children:[
              {
                id:2,
                label:'紧急',
                parentId:1,
                level:2
              },
              {
                id:3,
                label:'主要',
                parentId:1,
                level:2
              },
              {
                id:4,
                label:'正常',
                parentId:1,
                level:2
              },
              {
                id:5,
                label:'次要',
                parentId:1,
                level:2
              }
            ]
          },
          {
            id:6,
            label:'设备资产',
            parentId:null,
            level:1,
            children:[
              {
                id:7,
                label:'服务器',
                parentId:6,
                level:2,
                children:[
                  {
                    id:8,
                    label:'机架式',
                    parentId:7,
                    level:3,
                  },
                  {
                    id:9,
                    label:'刀片机',
                    parentId:7,
                    level:3,
                  }
                ]
              },
              {
                id:10,
                label:'小型机',
                parentId:6,
                level:2,
                children:[
                  {
                    id:11,
                    label:'刀片服务器',
                    parentId:10,
                    level:3,
                  },
                  {
                    id:12,
                    label:'刀箱服务器',
                    parentId:10,
                    level:3,
                  }
                ]
              },
              {
                id:13,
                label:'存储',
                parentId:6,
                level:2,
                children:null
              },
              {
                id:14,
                label:'备份',
                parentId:6,
                level:2,
                children:null
              }
            ]
          },
          {
            id:6,
            label:'设备资产',
            parentId:null,
            level:1,
            children:[
              {
                id:7,
                label:'服务器',
                parentId:6,
                level:2,
                children:[
                  {
                    id:8,
                    label:'机架式',
                    parentId:7,
                    level:3,
                  },
                  {
                    id:9,
                    label:'刀片机',
                    parentId:7,
                    level:3,
                  }
                ]
              },
              {
                id:10,
                label:'小型机',
                parentId:6,
                level:2,
                children:[
                  {
                    id:11,
                    label:'刀片服务器',
                    parentId:10,
                    level:3,
                  },
                  {
                    id:12,
                    label:'刀箱服务器',
                    parentId:10,
                    level:3,
                  }
                ]
              },
              {
                id:13,
                label:'存储',
                parentId:6,
                level:2,
                children:null
              },
              {
                id:14,
                label:'备份',
                parentId:6,
                level:2,
                children:null
              }
            ]
          },{
            id:6,
            label:'设备资产',
            parentId:null,
            level:1,
            children:[
              {
                id:7,
                label:'服务器',
                parentId:6,
                level:2,
                children:[
                  {
                    id:8,
                    label:'机架式',
                    parentId:7,
                    level:3,
                  },
                  {
                    id:9,
                    label:'刀片机',
                    parentId:7,
                    level:3,
                  }
                ]
              },
              {
                id:10,
                label:'小型机',
                parentId:6,
                level:2,
                children:[
                  {
                    id:11,
                    label:'刀片服务器',
                    parentId:10,
                    level:3,
                  },
                  {
                    id:12,
                    label:'刀箱服务器',
                    parentId:10,
                    level:3,
                  }
                ]
              },
              {
                id:13,
                label:'存储',
                parentId:6,
                level:2,
                children:null
              },
              {
                id:14,
                label:'备份',
                parentId:6,
                level:2,
                children:null
              }
            ]
          }
        ],
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
      },
      // 获取选中的节点
      getCurrentNode(data){
        console.log(data.label)
      }
    },
    created() {
    }
  }
</script>

<style scoped>
  .dataDictionary-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }

  .dataDictionary-title a {
    line-height: 35px;
    display: inline-block;
  }
</style>
