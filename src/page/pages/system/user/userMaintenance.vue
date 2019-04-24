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
      <el-form inline v-model="formItem">
        <el-form-item :label="$t('userMaintenance.account') + '：'">
          <el-input v-model="formItem.username" class="width200" clearable/>
        </el-form-item>
        <el-form-item id="selectTreeBox" class="positionRelative" :label="$t('userMaintenance.organization') + '：'">
          <i class="el-icon-error el-input__clear selectTreeBox_close"></i>
          <el-popover
            trigger="click"
            v-model="isShowFormPopover"
            placement="bottom-start"
            ref="popover">
            <el-tree
              :data="organizationList"
              highlight-current
              :expand-on-click-node="false"
              @node-click="clickNode"
              :props="defaultProps"/>
            <el-input
              v-model="formItem.organization"
              style="width: 200px;"
              suffix-icon="el-icon-arrow-down"
              readonly
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.status') + '：'">
          <el-select v-model="formItem.status" class="width200" clearable>
            <el-option
              v-for="(item,index) in statusList"
              :value="item.value"
              :key="index"
              :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
          <el-button type="reset" class="queryBtn" @click="resetFormData">{{$t('public.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button type="warning" @click="AddDataBtn" class="queryBtn">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('public.add')}}
        </el-button>
        <el-button :disabled="disableBtn.edit" @click="editDataBtn" class="queryBtn">
          <i class="el-icon-edit-outline"></i>
          {{$t('public.edit')}}
        </el-button>
        <el-button :disabled="disableBtn.more" @click="resetPassword">
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
      <el-table :data="tableData" stripe ref="table" @selection-change="selectTableNum">
        <el-table-column type="selection" fixed header-align="left" align="left"/>
        <el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="displayName" :label="$t('userMaintenance.username')" header-align="left" align="left"/>
        <el-table-column prop="username" :label="$t('userMaintenance.loginAccount')" header-align="left" align="left"/>
        <el-table-column prop="organizationName" :label="$t('userMaintenance.organization')" header-align="left" align="left"/>
        <el-table-column :label="$t('userMaintenance.userRole')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.roleName" placement="top-start">
              <span>{{scope.row.roleName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" :label="$t('userMaintenance.mobile')" header-align="left" align="left"/>
        <el-table-column :label="$t('userMaintenance.email')" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.email" placement="top-start">
              <span>{{scope.row.email}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('userMaintenance.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{$t('public.enable')}}</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">{{$t('public.disable')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('userMaintenance.createName')" header-align="left" align="left"/>
        <el-table-column width="160px" :label="$t('userMaintenance.createTime')" header-align="left" align="left">
          <template slot-scope="scope">
            {{scope.row.createTime | dateFilter}}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :page-size="options.pageSize"
        @handleSizeChangeSub="handleSizeChangeSub"
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--新增-->
    <el-dialog
      class="userMaintenance-dialog"
      append-to-body
      :title="$t('userMaintenance.createUpdateUserInfo')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" autocomplete="off" inline label-width="116px" :rules="rules" ref="ruleForm" >
        <el-form-item class="star" :label="$t('userMaintenance.organization') + '：'" prop="organization">
          <el-popover
            trigger="click"
            placement="bottom-start"
            v-model="isShowEditPopover"
            ref="popover">
            <el-tree
              :data="organizationList"
              highlight-current
              :expand-on-click-node="false"
              @node-click="clickNodeAlert"
              :props="defaultProps"/>
            <el-input
              v-model="addEdit.organization"
              style="width: 200px;"
              suffix-icon="el-icon-arrow-down"
              readonly
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.username') + '：'" prop="username">
          <el-input v-model="addEdit.username" class="width200" />
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.loginAccount') + '：'" prop="loginAccount">
          <el-input v-model="addEdit.loginAccount" class="width200" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="ifAdd === true" class="star" :label="$t('userMaintenance.loginPassword') + '：'" prop="loginPassword">
          <el-input type="password" v-model="addEdit.loginPassword" auto-complete="new-password" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.mobileNum') + '：'" prop="mobileNum">
          <el-input v-model="addEdit.mobileNum" maxlength="11" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.emails') + '：'" prop="emails">
          <el-input v-model="addEdit.emails" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.statusAlert') + '：'" prop="status">
          <el-radio-group v-model="addEdit.status" class="width200">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item class="star" :label="$t('userMaintenance.assignRole') + '：'" prop="assignRole">
          <el-button type="success" class="queryBtn" @click="selectRoleList">选择</el-button>
        </el-form-item>
      </el-form>
      <div class="assignRole-box" v-show="isShowRole">
        <template v-for="(item,index) in organizationName">
          <span style="margin-bottom: 10px;display: inline-block;font-size: 12px;">{{item}}</span>
          <i v-if="index !== organizationName.length - 1" class="el-icon-arrow-right"></i>
        </template>
        <el-checkbox-group class="assignRole-group-box" v-model="addEdit.assignRole">
          <el-checkbox-button v-for="role in assignRoleList" :label="role.id" :key="role.id">{{role.roleName}}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button class="alertBtn" v-if="ifAdd == true" type="primary" @click="addData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" v-if="ifAdd === false" type="primary" @click="editData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormAdd">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import {isNotNull,isMobilePhone,isEmail} from "../../../../assets/js/validator";
  import {orgBreadcrumb} from "../../../../assets/js/recursive";

  export default {
    name: "user-maintenance",
    components: {Box},
    data() {
      return {
        // 查询表单
        formItem: {
          organization: null,
          status: null,
          username: null,
          organizationId: null,
          rotateStatus:true
        },
        // 新增 编辑表单
        addEdit: {
          id: '',
          organization: '',
          organizationId: '',
          username: '',
          loginAccount: '',
          loginPassword: '',
          mobileNum: '',
          emails: '',
          status: 1,
          assignRole: [],
          changeSelect: false
        },
        // 控制全局按钮 是否禁用
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        // 新增弹出层
        dialogVisible: false,
        // 判断弹出层是新增还是编辑
        ifAdd: true,
        // 表单所属组织下拉区域
        isShowFormPopover: false,
        // 新增所属组织下拉区域
        isShowEditPopover: false,
        // 显示角色区域
        isShowRole: false,
        // 表格数据
        tableData: [],
        statusList: [
          {label: '启用', value: 1},
          {label: '禁用', value: 0},
        ],
        // 表格选中之后数据接收
        checkListValue: [],
        // 删除数据传参
        checkRoleIds: [],
        // 编辑数据集合
        editDataList: {},
        // 角色列表
        assignRoleList: [],
        // 组织层级
        organizationName: [],
        // 分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 显示条数
        },
        // 数据默认字段
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'nodeName',       // 标签显示
          children: 'children', // 子级
        },
        organizationList: [],
        // 校验
        rules: {
          organization:[
            {validator: isNotNull, trigger: ['blur','change']}
          ],
          username: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          loginAccount: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          loginPassword: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          mobileNum: [
            {validator: isNotNull, trigger: ['blur']},
            {validator: isMobilePhone, trigger: ['blur']}
          ],
          emails: [
            {validator: isNotNull, trigger: ['blur']},
            {validator: isEmail, trigger: ['blur']}
          ],
          status: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          assignRole: [
            {validator: isNotNull, trigger: ['blur']}
          ]
        }
      }
    },
    methods: {
      // 重置筛选表单
      resetFormData(){
        var _t = this;
        _t.formItem.organization = null;
        _t.formItem.organizationId = null;
        _t.formItem.status = null;
        _t.formItem.username = null;
      },
      // 选择组织下拉框中的角色
      selectRoleList(){
        var _t = this;
        if (_t.addEdit.organizationId !== '') {
          _t.isShowRole = true;
        }
      },
      // 新增按钮弹出层
      AddDataBtn() {
        this.dialogVisible = true;
        this.ifAdd = true;
      },
      // 查询表单所属组织下拉框
      clickNode(val) {
        var _t = this;
        _t.formItem.organization = val.nodeName;
        _t.formItem.organizationId = val.nodeId;
        _t.isShowFormPopover = false;
      },
      // 新增编辑弹出层所属组织下拉框
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.organization = val.nodeName;
        _t.addEdit.organizationId = val.nodeId;
        _t.isShowEditPopover = false;
        _t.addEdit.changeSelect = true;
        _t.organizationName = orgBreadcrumb(_t.organizationList, val.nodeId);
        _t.getRoleWithOrgId(_t.addEdit.organizationId);
      },
      // 重置新增表单数据
      resetFormAdd() {
        var _t = this;
        _t.dialogVisible = false;
        _t.ifAdd = true;
        _t.isShowRole = false;
        _t.addEdit.organizationId = '';
        _t.addEdit.organization = '';
        _t.addEdit.username = '';
        _t.addEdit.loginAccount = '';
        _t.addEdit.loginPassword = '';
        _t.addEdit.mobileNum = '';
        _t.addEdit.status = 1;
        _t.addEdit.emails = '';
        _t.$refs.table.clearSelection();
        _t.$refs.ruleForm.resetFields(); //移除校验结果并重置字段值
        _t.$refs.ruleForm.clearValidate(); //移除校验结果
      },
      // 当前选中条数
      selectTableNum(data) {
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
            data.forEach(function (item) {
              _t.editDataList = item;
              // 先判断是否选中自己 再判断禁用还是启用
              if (item.id !== localStorage.getItem('hy-user-id')) {
                if (item.status === 0) {
                  _t.disableBtn.enable = false;
                } else if (item.status === 1) {
                  _t.disableBtn.disable = false;
                }
                // 不可重置自己的密码
                _t.disableBtn.more = false;
              } else {
                _t.$message({
                  message: "不可以禁用、删除本人,重置本人密码!",
                  customClass:'messageBoxError',
                  duration:3000
                });
              }
            });
            break;
          default: // 多选
            _t.disableBtn.edit = true;
            _t.editDataList = {};
            var disableFlag = 0, enableFlag = 0, resetFlag = 0;
            for (var i = 0; i < data.length; i++) {
              if (data[i].status === 0) {
                disableFlag++;
              } else if (data[i].status === 1) {
                enableFlag++;
              }
              if (data[i].id == localStorage.getItem('hy-user-id')) {
                resetFlag++;
              }
            }
            // 重置密码判断
            if (resetFlag > 0) {
              _t.disableBtn.more = true;
            } else {
              _t.disableBtn.more = false;
            }
            // 启用禁用判断
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
        // 选中数据 获取id 存储
        var checkValue = new Array();
        var checkRoleIds = new Array();
        data.forEach(function (item) {
          checkValue.push(item.id);
          var obj = new Object();
          obj.roleId = item.roleList;
          obj.userId = item.id;
          checkRoleIds.push(obj);
        });
        _t.checkRoleIds = checkRoleIds;
        _t.checkListValue = checkValue;
      },
      // 改变当前页码
      handleCurrentChange(val) {
        var _t = this;
        _t.options.currentPage = val;
        _t.getData();
      },
      // 改变每页显示条数
      handleSizeChangeSub(val){
        var _t = this;
        _t.options.pageSize = val;
        _t.getData();
      },
      // 启用
      enableData() {
        var _t = this;
        _t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          cancelButtonClass:'alertBtn',
          confirmButtonClass:'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user/updateSystemUserStatus', {
            systemUser: {
              id: _t.checkListValue.join(','),
              status: 1
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录启用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                  _t.resetFormAdd();
                });
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
        }).catch(() => {
          return;
        });
      },
      // 禁用
      disableData() {
        var _t = this;
        _t.$confirm('请问是否确认禁用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          cancelButtonClass:'alertBtn',
          confirmButtonClass:'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user/updateSystemUserStatus', {
            systemUser: {
              status: 0,
              id: _t.checkListValue.join(',')
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录禁用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn',
                }).then(()=>{
                  _t.resetFormAdd();
                  _t.getData();
                });
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
        }).catch(() => {
          return;
        });
      },
      // 删除
      deleteData() {
        var _t = this;
        _t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          confirmButtonClass:'alertBtn',
          cancelButtonClass:'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          var checkRoleIds = new Array();
          _t.checkRoleIds.forEach(function (item) {
            checkRoleIds.push(item.userId);
          });
          console.log(checkRoleIds);
          _t.$api.delete('system/user/', {
            jsonString: JSON.stringify({
              userId: checkRoleIds.join(',')
            })
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.resetFormAdd();
                  _t.getData();
                });
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              case 2007: // 删除失败
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                });
                break;
              case 3005: //
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.resetFormAdd();
                  _t.getData();
                });
                break;
              default:
                _t.getData();
                break;
            }
            _t.disableBtn.edit = true;
            _t.disableBtn.enable = true;
            _t.disableBtn.disable = true;
            _t.disableBtn.more = true;
          });
        }).catch(() => {
          return;
        });
      },
      // 重置密码
      resetPassword() {
        var _t = this;
        _t.$confirm('请问是否重置当前的记录密码?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          confirmButtonClass:'alertBtn',
          cancelButtonClass:'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user/resetPassword', {
            systemUser: {
              id: _t.checkListValue.join(',')
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('重置密码成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.resetFormAdd();
                  _t.getData();
                });
                break;
              case 1004: // token 失效
              case 1005: // token 为 null
              case 1006: // token 不一致
                _t.exclude(_t, res.message);
                break;
              default:
                break;
            }
          });
        }).catch(() => {
          return;
        });
      },
      // 查询数据
      getData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('system/user/pagelist', {
          jsonString: JSON.stringify({
            systemUser: {
              username: _t.formItem.username,
              organizationId: _t.formItem.organizationId,
              status: _t.formItem.status,
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.options.currentPage = res.data.currentPage;
              _t.options.total = res.data.count;
              var lists = res.data.list;
              lists.forEach(function (item) {
                if (item.roleList !== null) {
                  if (item.roleList.length !== 0) {
                    var roleName = new Array();
                    var roleIds = new Array();
                    item.roleList.forEach(function (data) {
                      roleName.push(data.roleName);
                      roleIds.push(data.id);
                    });
                    item.roleName = roleName.join(',');
                    item.roleListIds = roleIds.join(',');
                  } else {
                    item.roleName = '';
                    item.roleListIds = null;
                  }
                } else {
                  item.roleName = '';
                  item.roleListIds = null;
                }
              });
              _t.tableData = res.data.list;
              _t.disableBtn.edit = true;
              _t.disableBtn.enable = true;
              _t.disableBtn.disable = true;
              _t.disableBtn.more = true;
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
              _t.disableBtn.edit = true;
              _t.disableBtn.enable = true;
              _t.disableBtn.disable = true;
              _t.disableBtn.more = true;
              break;
          }
        });
      },
      // 新增数据
      addData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.post('system/user/', {
              systemUser: {
                organizationId: _t.addEdit.organizationId == null ? null : _t.addEdit.organizationId,
                username: _t.addEdit.loginAccount == null ? null : (_t.addEdit.loginAccount.trim() == '' ? null : _t.addEdit.loginAccount.trim()),
                password: _t.$md5('begin1$2%3=4#5$6end' + _t.$md5(_t.addEdit.loginPassword.trim())),
                displayName: _t.addEdit.username == null ? null :(_t.addEdit.username.trim() == '' ? null : _t.addEdit.username.trim()),
                email: _t.addEdit.emails == null ? null : (_t.addEdit.emails.trim() == '' ? null : _t.addEdit.emails.trim()),
                mobile: _t.addEdit.mobileNum == null ? null : (_t.addEdit.mobileNum.trim() == '' ? null : _t.addEdit.mobileNum.trim()),
                status: _t.addEdit.status,
                createBy: localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language')
              },
              roleId: _t.addEdit.assignRole.join(',')
            }, function (res) {
              switch (res.status) {
                case 200:
                  _t.dialogVisible = false;
                  _t.getData();
                  _t.resetFormAdd();
                  break;
                case 1003: // 无操作权限
                case 1004: // 登录过期
                case 1005: // token过期
                case 1006: // token不通过
                  _t.exclude(_t, res.message);
                  break;
                case 2005:
                  _t.$alert(res.message, _t.$t('public.resultTip'), {
                    confirmButtonText: _t.$t('public.confirm'),
                    confirmButtonClass:'alertBtn'
                  }).then(()=>{
                    _t.resetFormAdd();
                    _t.getData();
                  });
                  break;
                default:
                  _t.dialogVisible = false;
                  break;
              }
            });
          }
        });
      },
      // 查询所属组织
      getOrganization() {
        var _t = this;
        _t.$api.get('system/organization/all', {}, function (res) {
          switch (res.status) {
            case 200:
              _t.organizationList = JSON.parse(res.data).children;
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
      // 根据组织id查询 角色列表
      getRoleWithOrgId(val) {
        var _t = this;
        _t.$api.get('system/role/all/', {
          jsonString: JSON.stringify({
            systemRole: {
              organizationId: val
            }
          })
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.assignRoleList = res.data.list;
              if (_t.ifAdd) {
                _t.addEdit.assignRole = [];
              } else if (_t.ifAdd == false && _t.addEdit.changeSelect == false) {
                _t.addEdit.assignRole = _t.editDataList.roleListIds.split(',');
              } else if (_t.ifAdd == false && _t.addEdit.changeSelect == true) {
                _t.addEdit.assignRole = [];
              }
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.assignRoleList = [];
              if (_t.ifAdd) {
                _t.addEdit.assignRole = [];
              } else if (_t.ifAdd == false && _t.addEdit.changeSelect == false) {
                _t.addEdit.assignRole = _t.editDataList.roleListIds.split(',');
              } else if (_t.ifAdd == false && _t.addEdit.changeSelect == true) {
                _t.addEdit.assignRole = [];
              }
              break;
          }
        });
      },
      // 编辑数据按钮
      editDataBtn() {
        var _t = this;
        // 新增编辑类型判断
        _t.ifAdd = false;
        _t.addEdit.id = _t.editDataList.id;
        _t.getEditDataById(_t.addEdit.id);
      },
      // 编辑时通过id重新请求数据 防止数据滞后
      getEditDataById(val){
        var _t = this;
        _t.$api.get('system/user/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              _t.addEdit.organization = res.data.organizationName;
              _t.addEdit.organizationId = res.data.organizationId;
              _t.addEdit.username = res.data.displayName;
              _t.addEdit.loginAccount = res.data.username;
              _t.addEdit.mobileNum = res.data.mobile;
              _t.addEdit.emails = res.data.email;
              _t.addEdit.status = res.data.status;
              _t.getRoleWithOrgId(res.data.organizationId);
              _t.organizationName = orgBreadcrumb(_t.organizationList,res.data.organizationId);
              if (_t.addEdit.organizationId !== '') {
                _t.isShowRole = true;
              }
              _t.dialogVisible = true;
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
      // 编辑数据
      editData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.put('system/user/', {
              systemUser: {
                id: _t.addEdit.id,
                organizationId: _t.addEdit.organizationId == null ? null : _t.addEdit.organizationId,
                username: _t.addEdit.loginAccount == null ? null : (_t.addEdit.loginAccount.trim() == '' ? null : _t.addEdit.loginAccount.trim()),
                // password: _t.$md5('begin1$2%3=4#5$6end' + _t.$md5(_t.addEdit.loginPassword.trim())),
                displayName: _t.addEdit.username == null ? null :(_t.addEdit.username.trim() == '' ? null : _t.addEdit.username.trim()),
                email: _t.addEdit.emails == null ? null : (_t.addEdit.emails.trim() == '' ? null : _t.addEdit.emails.trim()),
                mobile: _t.addEdit.mobileNum == null ? null : (_t.addEdit.mobileNum.trim() == '' ? null : _t.addEdit.mobileNum.trim()),
                status: _t.addEdit.status,
                createBy: localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language')
              },
              roleId: _t.addEdit.assignRole.join(',')
            }, function (res) {
              switch (res.status) {
                case 200:
                  _t.dialogVisible = false;
                  _t.getData();
                  _t.resetFormAdd();
                  break;
                case 1003: // 无操作权限
                case 1004: // 登录过期
                case 1005: // token过期
                case 1006: // token不通过
                  _t.exclude(_t, res.message);
                  break;
                case 2006:
                  _t.$alert(res.message, _t.$t('public.resultTip'), {
                    confirmButtonText: _t.$t('public.confirm'),
                    confirmButtonClass:'alertBtn'
                  }).then(()=>{
                    _t.resetFormAdd();
                    _t.getData();
                  });
                  break;
                default:
                  _t.getData();
                  _t.dialogVisible = false;
                  break;
              }
            });
          }
        });
      },
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getData();
      this.getOrganization();
    }
  }
</script>

<style>
  .assignRole-box {
    min-height: 72px;
    max-height: 152px;
    padding: 10px 0 0 50px;
    position: relative;
  }

  .assignRole-box:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    top: -12px;
    left: 150px;
    border-width: 6px;
    border-style: solid;
  }

  .assignRole-group-box .el-checkbox-button {
    margin-right: 10px;
    margin-bottom: 10px;
    min-width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .assignRole-group-box .el-checkbox-button span {
    font-size: 12px;
  }

  .assignRole-group-box .el-checkbox-button__inner {
    border-radius: 2px !important;
    padding: 0 20px;
    display: inline-block;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }

  .userMaintenance-dialog .el-dialog {
    width: 700px;
    height: 400px;
  }

  .userMaintenance-dialog .el-form-item {
    margin-right: 0 !important;
    width: 49%;
  }
</style>
