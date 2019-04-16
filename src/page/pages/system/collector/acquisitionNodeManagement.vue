<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.deviceAcquisitionSettings')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.acquisitionNodeManagement')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline label-width="96px" :model="formItem">
        <el-form-item :label="$t('acquisitionNodeManagement.nodeName') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" v-model="formItem.collectorName" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeManagement.nodeIp') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" v-model="formItem.IP" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeManagement.nodePort') + '：'" style="margin-bottom: 16px;">
          <el-input class="width200" v-model="formItem.port" />
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeManagement.groupName') + '：'">
          <el-select class="width200" v-model="formItem.groupIp">
            <el-option label="全部" value="0" />
            <el-option v-for="(item,index) in groupIpList" :key="index" :label="item.groupName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('acquisitionNodeManagement.status') + '：'">
          <el-select class="width200" v-model="formItem.status">
            <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button type="warning" class="queryBtn" @click="addDataBtn">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('public.add')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editDataBtn">
          <i class="el-icon-edit-outline"></i>
          {{$t('public.edit')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
          <i class="el-icon-delete"></i>
          {{$t('public.delete')}}
        </el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" ref="table" stripe @selection-change="selectTableNum">
        <el-table-column type="selection" fixed header-align="left" align="left"/>
        <el-table-column :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="collectorName" :label="$t('acquisitionNodeManagement.nodeName')" header-align="left" align="left"/>
        <el-table-column prop="ip" :label="$t('acquisitionNodeManagement.ip')" header-align="left" align="left"/>
        <el-table-column prop="port" :label="$t('acquisitionNodeManagement.port')" header-align="left" align="left"/>

        <el-table-column :label="$t('acquisitionNodeManagement.nodeRunStatus')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="iconfontSuccess">正常</span>
            <span v-if="scope.row.status == -1" class="iconfontError">异常</span>
          </template>
        </el-table-column>

        <el-table-column prop="groupName" :label="$t('acquisitionNodeManagement.nodeGroup')" header-align="left" align="left"/>
        <el-table-column prop="description" :label="$t('acquisitionNodeManagement.description')" header-align="left" align="left"/>
        <el-table-column :label="$t('acquisitionNodeManagement.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <a href="javascript:;" @click="clickSeeDetail(scope.row)" class="acquisitionNode-detail">
              <span class="iconfontSuccess">正常</span>
              <span class="iconfontError">异常</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('acquisitionNodeManagement.createName')" header-align="left" align="left"/>
        <el-table-column :label="$t('acquisitionNodeManagement.createTime')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFilter}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :pageSize='options.pageSize'
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--新增编辑-->
    <el-dialog
      append-to-body
      class="acquisitionNode-dialog"
      :title="$t('acquisitionNodeManagement.createUpdateNode')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="96px" inline :model="addEdit" :rules="rules" ref="formName">
        <el-form-item class="star" :label="$t('acquisitionNodeManagement.nodeName') + '：'" prop="collectorName">
          <el-input class="width200" v-model="addEdit.collectorName" />
        </el-form-item>
        <el-form-item class="star" :label="$t('acquisitionNodeManagement.nodeIp') + '：'" prop="ip">
          <el-input class="width200" v-model="addEdit.ip" />
        </el-form-item>
        <el-form-item class="star" :label="$t('acquisitionNodeManagement.nodeGroup') + '：'" prop="groupId">
          <el-select v-model="addEdit.groupId" class="width200">
            <el-option v-for="(item,index) in groupIpList" :key="index" :label="item.groupName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item class="star" :label="$t('acquisitionNodeManagement.nodePort') + '：'" prop="port">
          <el-input class="width200" v-model="addEdit.port" />
        </el-form-item>
      </el-form>
      <el-form :model="addEdit" label-width="96px">
        <el-form-item :label="$t('acquisitionNodeManagement.ruleDes') + '：'">
          <el-input class="acquisitionNode-description" type="textarea" v-model="addEdit.description" :autosize="{minRows:3}"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" v-if="ifAdd == true" class="alertBtn" @click="addData('formName')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" v-if="ifAdd == false" class="alertBtn" @click="editData('formName')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      class="acquisitionNodeDetail-dialog"
      :title="statusDetail.label + ' 的' + $t('acquisitionNodeManagement.detailNode')"
      :visible.sync="dialogVisibleDetail"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table :data="statusDetailData" stripe>
        <el-table-column :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.$index+(optionsDetail.currentPage - 1) * optionsDetail.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('acquisitionNodeManagement.IPList')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeManagement.gatewayIp')" header-align="left" align="left" />
        <el-table-column :label="$t('acquisitionNodeManagement.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="iconfontSuccess">正常</span>
            <span v-if="scope.row.status == -1" class="iconfontError">异常</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import {isNotNull} from "../../../../assets/js/validator";
  import {dateFilter} from "../../../../assets/js/filters";

  export default {
    name: "acquisitionNodeManagement",
    components: {Box},
    data() {
      return {
        // 带外通讯状态
        statusDetail:{
          id:'',
          label:''
        },
        // 查询表单
        formItem:{
          collectorName:null, // 名称
          groupIp:'0', // 节点组id
          IP:null,
          port:null,
          status:null
        },
        // 新增编辑表单
        addEdit:{
          id:'',
          collectorName:'',
          ip:'',
          status:1,
          groupId:'',
          port:'',
          description:''
        },
        // 全局按钮判断
        disableBtn: {
          edit: true,
          more: true
        },
        statusList:[
          {label:'正常',value:1},
          {label:'异常',value:-1},
        ],
        tableData: [], // 表格数据集合
        checkListIds:[], // 选中的数据id集合
        groupIpList:[], // 节点组列表
        statusDetailData:[], // 带外通讯详情表格数据
        // 分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        optionsDetail: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        dialogVisible: false, // 新增编辑弹出层
        dialogVisibleDetail:false, // 带外通讯状态弹出层
        ifAdd:true, // 判断新增编辑
        rules: {
          collectorName:[
            {validator: isNotNull, trigger: ['blur']}
          ],
          ip:[
            {validator: isNotNull, trigger: ['blur']}
          ],
          groupId:[
            {validator: isNotNull, trigger: ['blur','change']}
          ],
          port:[
            {validator: isNotNull, trigger: ['blur']}
          ]
        }
      }
    },
    methods: {
      // 查看带外通讯状态
      clickSeeDetail(data){
        var _t = this;
        _t.dialogVisibleDetail = true;
        _t.statusDetail.id = data.id;
        _t.statusDetail.label = data.collectorName;
      },
      // 根据id查询带外通讯状态列表
      getStatusById(val){
        var _t = this;
        _t.$api.get('',{},function (res) {
          switch (res.status) {
            case 200:
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              break;
          }
        });
      },
      // 重置表单
      resetFormData(){
        var _t= this;
        _t.ifAdd = true;
        _t.dialogVisible = false;
        _t.addEdit.id = '';
        _t.addEdit.collectorName ='';
        _t.addEdit.ip ='';
        _t.addEdit.status = 1;
        _t.addEdit.groupId ='';
        _t.addEdit.port ='';
        _t.addEdit.description ='';
        this.$refs.table.clearSelection();
      },
      // 当前选中条数
      selectTableNum(data) {
        var _t = this;
        switch (data.length) {
          case 0: // 未选中
            _t.disableBtn.edit = true;
            _t.disableBtn.more = true;
            break;
          case 1: // 单选
            _t.disableBtn.edit = false;
            _t.disableBtn.more = false;
            break;
          default: // 多选
            _t.disableBtn.edit = true;
            _t.disableBtn.more = false;
            break;
        }
        var checkListIds = new Array();
        data.forEach(function (item) {
          checkListIds.push(item.id);
        });
        _t.checkListIds = checkListIds;
      },
      // 改变当前页码
      handleCurrentChange(val) {
        var _t = this;
        _t.options.currentPage = val;
        _t.getData();
      },
      // 删除
      deleteData() {
        var _t = this;
        _t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          cancelButtonClass: "alertBtn",
          confirmButtonClass:'alertBtn',
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading',true);
          _t.$api.delete('system/collector/',{
            jsonString: JSON.stringify({
              systemCollector:{
                id:_t.checkListIds.join(',')
              }
            })
          },function (res) {
            _t.$store.commit('setLoading',false);
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                });
                _t.getData();
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              case 2007: // 删除失败
              case 3005: // 节点组关联角色不能删除
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                });
                break;
              default:
                break;
            }
          });
          _t.disableBtn.edit = true;
          _t.disableBtn.more = true;
        }).catch(() => {
          return;
        });
      },
      // 查询列表数据
      getData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('system/collector/pagelist',{
          jsonString:JSON.stringify({
            systemCollector:{
              collectorName:_t.formItem.collectorName == null ? null : (_t.formItem.collectorName.trim() == '' ? null : _t.formItem.collectorName.trim()),
              ip:_t.formItem.IP == null ? null : (_t.formItem.IP.trim() == '' ? null : _t.formItem.IP.trim()),
              groupId:_t.formItem.groupIp == '0' ? null : (_t.formItem.groupIp.trim() == '' ? null : _t.formItem.groupIp.trim()),
              port:_t.formItem.port == null ? null : (_t.formItem.port.trim() == '' ? null : _t.formItem.port.trim()),
              status:_t.formItem.status,
              languageMark:localStorage.getItem('hy-language')
            },
            currentPage:_t.options.currentPage,
            pageSize:_t.options.pageSize
          })
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
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
      },
      // 新增按钮
      addDataBtn(){
        var _t = this;
        _t.ifAdd = true;
        _t.dialogVisible = true;
      },
      // 新增提交
      addData(formName){
        var _t = this;
        _t.$refs[formName].validate((valid) => {
            if (valid) {
              _t.$api.post('system/collector/',{
                systemCollector:{
                  collectorName:_t.addEdit.collectorName,
                  ip:_t.addEdit.ip,
                  groupId:_t.addEdit.groupId,
                  port:_t.addEdit.port,
                  status:_t.addEdit.status,
                  description:_t.addEdit.description,
                  createBy:localStorage.getItem('hy-user-name'),
                  languageMark: localStorage.getItem('hy-language')
                }
              },function (res) {
                _t.dialogVisible = false;
                switch (res.status) {
                  case 200:
                    _t.getData();
                    break;
                  case 1003: // 无操作权限
                  case 1004: // 登录过期
                  case 1005: // token过期
                  case 1006: // token不通过
                    _t.exclude(_t, res.message);
                    break;
                  case 3004: // 操作失败
                    _t.$alert(res.message, _t.$t('public.resultTip'), {
                      confirmButtonText: _t.$t('public.confirm'),
                      confirmButtonClass:'alertBtn'
                    }).then(()=>{
                      _t.resetFormData();
                    });
                    break;
                  default:
                    break;
                }
              });
            }
        });
      },
      // 编辑按钮
      editDataBtn(){
        var _t = this;
        _t.ifAdd = false;
        _t.dialogVisible = true;
        _t.addEdit.id = _t.checkListIds.join(',');
        _t.getEditDataById(_t.addEdit.id);
      },
      // 根据选中的id获取编辑的数据
      getEditDataById(val){
        var _t = this;
        _t.$api.get('system/collector/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              _t.addEdit.id = res.data.id;
              _t.addEdit.collectorName = res.data.collectorName;
              _t.addEdit.ip = res.data.ip;
              _t.addEdit.port = res.data.port;
              _t.addEdit.status = res.data.status;
              _t.addEdit.description = res.data.description;
              _t.addEdit.groupId = res.data.groupId;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              break;
          }
        });
      },
      // 编辑提交
      editData(formName){
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.put('system/collector/',{
              systemCollector:{
                id:_t.addEdit.id,
                collectorName:_t.addEdit.collectorName,
                ip:_t.addEdit.ip,
                groupId:_t.addEdit.groupId,
                port:_t.addEdit.port,
                status:_t.addEdit.status,
                description:_t.addEdit.description,
                createBy:localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language')
              }
            },function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getData();
                  break;
                case 1003: // 无操作权限
                case 1004: // 登录过期
                case 1005: // token过期
                case 1006: // token不通过
                  _t.exclude(_t, res.message);
                  break;
                case 3004: // 操作失败
                  _t.$alert(res.message, _t.$t('public.resultTip'), {
                    confirmButtonText: _t.$t('public.confirm'),
                    confirmButtonClass:'alertBtn'
                  }).then(()=>{
                    _t.resetFormData();
                  });
                  break;
                default:
                  break;
              }
            });
          }
        });
      },
      // 查询节点组数据
      getGroupData(){
        var _t = this;
        _t.$api.get('system/collectorGroup/all',{},function (res) {
          switch (res.status) {
            case 200:
              _t.groupIpList = res.data.list;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.groupIpList = [];
              break;
          }
        });
      }
    },
    created() {
      this.$store.commit('setLoading',true);
      this.getData();
      this.getGroupData();
    }
  }
</script>

<style>
  .acquisitionNode-dialog .el-dialog {
    width: 660px;
    height: 356px;
  }

  .acquisitionNode-dialog .el-form-item {
    width: 49%;
    margin-bottom: 20px;
    margin-right: 0;
  }

  .acquisitionNode-description {
    width: 505px;
  }

  .acquisitionNode-detail {
    display: inline-block;
  }

  .acquisitionNodeDetail-dialog .el-dialog {
    width: 700px;
    height: 450px;
  }
</style>
