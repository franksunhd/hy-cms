<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.functionMenuMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col :span="4">
        <p class="functionMenuMaintenance-title">
          <a href="javascript:;">{{$t('functionMenuMaintenance.systemDataDictionary')}}</a>
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
            <el-form-item :label="$t('functionMenuMaintenance.businessCode') + '：'">
              <el-input class="width200" />
            </el-form-item>
            <el-form-item :label="$t('functionMenuMaintenance.dictionaryName') + '：'">
              <el-input class="width200" />
            </el-form-item>
            <el-form-item :label="$t('functionMenuMaintenance.status') + '：'">
              <el-select v-model="status">
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
            <el-button class="queryBtn" @click="dialogVisible = true">
              <i class="el-icon-edit-outline"></i>
              {{$t('public.edit')}}
            </el-button>
            <el-button class="queryBtn" @click="enableData">
              <i class="el-icon-circle-check-outline"></i>
              {{$t('public.enable')}}
            </el-button>
            <el-button class="queryBtn" @click="disableData">
              <i class="el-icon-circle-close-outline"></i>
              {{$t('public.disable')}}
            </el-button>
            <el-button class="queryBtn" @click="deleteData">
              <i class="el-icon-delete"></i>
              {{$t('public.delete')}}
            </el-button>
          </div>
          <!--表格-->
          <el-table :data="tableData" stripe>
            <el-table-column type="selection" fixed header-align="center" align="center" />
            <el-table-column :label="$t('public.index')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.menuName')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.icon')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.link')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.jumpType')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.modelLevel')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.sort')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.status')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.createName')" header-align="center" align="center" />
            <el-table-column :label="$t('functionMenuMaintenance.createTime')" header-align="center" align="center" />
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
      :title="$t('functionMenuMaintenance.createUpdateDictionary')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('functionMenuMaintenance.parentDictionary') + '：'">
          <selectTree width="200" :options="treeData" v-model="organization" />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.dictionaryType') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.businessCode') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.dictionaryName') + '：'">
          <el-input type="password" />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.directoryLevel') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.orderIndex') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.statusAlert') + '：'">
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
  export default {
    name: "functionMenuMaintenance",
    components:{Box},
    data() {
      return {
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
          }
        ],
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
  .functionMenuMaintenance-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }

  .functionMenuMaintenance-title a {
    line-height: 35px;
    display: inline-block;
  }
</style>
