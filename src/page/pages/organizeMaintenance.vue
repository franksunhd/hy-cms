<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.organizeMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline>
        <el-form-item :label="$t('organizeMaintenance.organizationName') +'：'">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.createUpdateDate') +'：'">
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
          <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
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
        <el-table-column :label="$t('organizeMaintenance.organizationName')" header-align="center" align="center" />
        <el-table-column :label="$t('organizeMaintenance.roleNum')" header-align="center" align="center" />
        <el-table-column :label="$t('organizeMaintenance.userNum')" header-align="center" align="center" />
        <el-table-column :label="$t('organizeMaintenance.status')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('organizeMaintenance.createName')" header-align="center" align="center" />
        <el-table-column :label="$t('organizeMaintenance.createTime')" header-align="center" align="center" />
        <el-table-column :label="$t('organizeMaintenance.updateName')"  header-align="center" align="center" />
        <el-table-column :label="$t('organizeMaintenance.updateTime')" header-align="center" align="center" />
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :pageSize='options.pageSize'
        @handleCurrentChangeSub="handleCurrentChange" />
    </div>
    <!--新增、编辑-->
    <el-dialog
      append-to-body
      :title="$t('organizeMaintenance.createUpdateOrganization')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('organizeMaintenance.parentOrganization') + '：'">
          <selectTree width="200" :options="organizationList" v-model="organization" />
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.organizationName') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.orderIndex') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.isEnable') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.organizationDes') + '：'">
          <el-input type="textarea" :autosize="{ minRows: 3 }" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" class="queryBtn" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import selectTree from '../../components/selectTree';
  export default {
    name: "organize-maintenance",
    components:{Box,selectTree},
    data(){
      return {
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        startTime:'',
        endTime:'',
        tableData: [],
        options:{
          total: 0, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
        },
        dialogVisible:false,
        // 数据默认字段
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'label',       // 标签显示
          children: 'children', // 子级
        },
        organizationList: [],
        organization:'',
        status:''
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
        var _t = this;
        _t.options.currentPage = val;
      },
      // 启用
      enableData(){
        var _t = this;
        _t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        var _t = this;
        _t.$confirm('请问是否确认禁用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        var _t = this;
        _t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 查询组织维护表格数据
      getData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('', {
          jsonString: JSON.stringify({
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize,
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.tableData = res.data.list;
              _t.options.currentPage = res.data.currentPage;
              _t.options.total = res.data.count;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.tableData = [];
              _t.options.currentPage = 1;
              _t.options.total = 0;
              break;
          }
        });
      }
    },
    created(){
      // this.$store.commit('setLoading', true);
      // this.getData();
    }
  }
</script>

<style scoped>

</style>
