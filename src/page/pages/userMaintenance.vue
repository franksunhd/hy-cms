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
          <el-input v-model="formItem.username" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.organization') + '：'">
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
          <el-select v-model="formItem.status" class="width200">
            <el-option
              v-for="(item,index) in statusList"
              :value="item.value"
              :key="index"
              :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
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
        <el-button :disabled="disableBtn.edit" @click="editData" class="queryBtn">
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
      <el-table :data="tableData" stripe @selection-change="selectTableNum">
        <el-table-column type="selection" fixed header-align="center" align="center"/>
        <el-table-column :label="$t('public.index')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="displayName" :label="$t('userMaintenance.username')" width="100" header-align="center"
                         align="center"/>
        <el-table-column prop="username" :label="$t('userMaintenance.loginAccount')" width="100" header-align="center"
                         align="center"/>
        <el-table-column prop="organizationName" :label="$t('userMaintenance.organization')" width="100"
                         header-align="center" align="center"/>
        <el-table-column prop="roleName" :label="$t('userMaintenance.userRole')" width="100" header-align="center"
                         align="center"/>
        <el-table-column prop="mobile" :label="$t('userMaintenance.mobile')" width="100" header-align="center"
                         align="center"/>
        <el-table-column prop="email" :label="$t('userMaintenance.email')" width="100" header-align="center"
                         align="center"/>
        <el-table-column :label="$t('userMaintenance.status')" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{$t('public.enable')}}</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">{{$t('public.disable')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('userMaintenance.createName')" width="200" header-align="center"
                         align="center"/>
        <el-table-column :label="$t('userMaintenance.createTime')" header-align="center"
                         align="center">
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
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--新增编辑-->
    <el-dialog
      class="userMaintenance-dialog"
      append-to-body
      :title="$t('userMaintenance.createUpdateUserInfo')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" inline label-width="150px" :rules="rules" ref="ruleForm">
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
          <el-input v-model="addEdit.username" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.loginAccount') + '：'" prop="loginAccount">
          <el-input v-model="addEdit.loginAccount" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.loginPassword') + '：'" prop="loginPassword">
          <el-input type="password" v-model="addEdit.loginPassword" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.mobileNum') + '：'" prop="mobileNum">
          <el-input v-model="addEdit.mobileNum" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.emails') + '：'" prop="emails">
          <el-input v-model="addEdit.emails" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('userMaintenance.statusAlert') + '：'" prop="status">
          <el-select class="width200" v-model="addEdit.status">
            <el-option :label="$t('public.enable')" value="1"/>
            <el-option :label="$t('public.disable')" value="0"/>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item class="star" :label="$t('userMaintenance.assignRole') + '：'" prop="assignRole">
          <el-button type="success" class="queryBtn">选择</el-button>
        </el-form-item>
      </el-form>
      <div class="assignRole-box">
        <el-breadcrumb style="margin-bottom: 10px;">
          <el-breadcrumb-item>集团亚洲总部</el-breadcrumb-item>
          <el-breadcrumb-item>上海分部</el-breadcrumb-item>
        </el-breadcrumb>
        <el-checkbox-group class="assignRole-group-box" v-model="addEdit.assignRole">
          <el-checkbox-button v-for="role in assignRoleList" :label="role.id" :key="role.id">{{role.roleName}}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button class="queryBtn" type="primary" @click="addData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {isNotNull} from "../../assets/js/validator";

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
          organizationId: null
        },
        // 新增 编辑表单
        addEdit: {
          organization: '',
          organizationId: '',
          username: '',
          loginAccount: '',
          loginPassword: '',
          mobileNum: '',
          emails: '',
          status: '',
          assignRole: []
        },
        // 控制全局按钮 是否禁用
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        dialogVisible: false,
        isShowFormPopover: false,
        isShowEditPopover: false,
        tableData: [],
        statusList: [
          {label: '启用', value: 1},
          {label: '禁用', value: 0},
        ],
        // 表格选中之后数据接收
        checkListValue: [],
        // 删除数据传参
        checkRoleIds: [],
        assignRoleList: [],
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
        rules: {
          organization: [
            {validator: isNotNull, trigger: ['blur', 'change']}
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
            {validator: isNotNull, trigger: ['blur']}
          ],
          emails: [
            {validator: isNotNull, trigger: ['blur']}
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
      // 查询表单所属组织下拉框
      clickNode(val) {
        this.formItem.organization = val.nodeName;
        this.formItem.organizationId = val.nodeId;
        this.isShowFormPopover = false;
      },
      // 新增编辑弹出层所属组织下拉框
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.organization = val.nodeName;
        _t.addEdit.organizationId = val.nodeId;
        _t.isShowEditPopover = false;
        _t.getRoleWithOrgId(_t.addEdit.organizationId);
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
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.assignRoleList = [];
              break;
          }
        });
      },
      // 重置新增编辑表单数据
      resetForm() {
        var _t = this;
        _t.addEdit = {
          organization: '',
          username: '',
          loginAccount: '',
          loginPassword: '',
          mobileNum: '',
          emails: '',
          status: '',
          assignRole: []
        }
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
              // 先判断是否选中自己 再判断禁用还是启用
              if (item.id !== localStorage.getItem('hy-user-id')) {
                if (item.status === 0) {
                  _t.disableBtn.enable = false;
                } else if (item.status === 1) {
                  _t.disableBtn.disable = false;
                }
                // 不可重置自己的密码
                _t.disableBtn.more = false;
              }
            });
            break;
          default: // 多选
            _t.disableBtn.edit = true;
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
      // 启用
      enableData() {
        var _t = this;
        _t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user/', {
            systemUser: {
              id: _t.checkListValue.join(','),
              status: 1
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录启用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getData();
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
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user/', {
            systemUser: {
              status: 0,
              id: _t.checkListValue.join(',')
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录禁用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getData();
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
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.delete('system/user/', {
            jsonString: JSON.stringify({
              userRoleParmArray: _t.checkRoleIds
            })
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
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
                _t.$alert(res.message);
                break;
              default:
                break;
            }
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
          type: 'warning'
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
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getData();
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
      // 新增数据
      addData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.post('system/user/', {
              systemUser: {
                organizationId: _t.addEdit.organizationId,
                username: _t.addEdit.loginAccount,
                password: _t.addEdit.loginPassword,
                displayName: _t.addEdit.username,
                email: _t.addEdit.emails,
                mobile: _t.addEdit.mobileNum,
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
                  break;
                case 1003: // 无操作权限
                case 1004: // 登录过期
                case 1005: // token过期
                case 1006: // token不通过
                  _t.exclude(_t, res.message);
                  break;
                case 2005:
                  _t.$alert(res.message);
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
      // 编辑数据
      editData() {
        var _t = this;
        _t.$api.put('system/user/', {
          systemUser: {
            id: 'bb6c161ddb4240ffa78bef522c874653',
            organizationId: 'org_01_02',
            username: 'huanhang',
            password: '123456',
            displayName: '换行1',
            email: 'aaa@qq.com',
            mobile: '123',
            status: 0,
            languageMark: localStorage.getItem('hy-language')
          },
          roleId: 'role_01'
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.dialogVisible = false;
              _t.getData();
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            case 2006:
              _t.$alert(res.message);
              break;
            default:
              _t.dialogVisible = false;
              break;
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
  }

  .assignRole-group-box .el-checkbox-button {
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .assignRole-group-box .el-checkbox-button__inner {
    border-radius: 2px !important;
  }
</style>
