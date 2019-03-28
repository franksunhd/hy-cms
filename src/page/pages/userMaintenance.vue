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
          <selectTree width="200" :options="organizationList" v-model="formItem.organization"/>
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
        <el-table-column prop="organizationId" :label="$t('userMaintenance.organization')" width="100"
                         header-align="center" align="center"/>
        <el-table-column :label="$t('userMaintenance.userRole')" width="100" header-align="center" align="center"/>
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
        <el-table-column prop="createTime" :label="$t('userMaintenance.createTime')" header-align="center"
                         align="center"/>
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
      append-to-body
      :title="$t('userMaintenance.createUpdateUserInfo')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('userMaintenance.organization') + '：'" prop="organization">
          <selectTree width="200" :options="organizationList" v-model="addEdit.organization"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.username') + '：'" prop="username">
          <el-input v-model="addEdit.username"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.loginAccount') + '：'" prop="loginAccount">
          <el-input v-model="addEdit.loginAccount"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.loginPassword') + '：'" prop="loginPassword">
          <el-input type="password" v-model="addEdit.loginPassword"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.mobileNum') + '：'" prop="mobileNum">
          <el-input v-model="addEdit.mobileNum"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.emails') + '：'" prop="emails">
          <el-input v-model="addEdit.emails"/>
        </el-form-item>
        <el-form-item :label="$t('userMaintenance.assignRole') + '：'" prop="assignRole">

        </el-form-item>
        <el-form-item :label="$t('userMaintenance.statusAlert') + '：'" prop="status">
          <el-radio-group v-model="addEdit.status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary" @click="addData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import selectTree from '../../components/selectTree';
  import {isNotNull} from "../../assets/js/validator";

  export default {
    name: "user-maintenance",
    components: {Box, selectTree},
    data() {
      return {
        // 查询表单
        formItem: {
          organization: null,
          status: null,
          username: null
        },
        // 新增 编辑表单
        addEdit: {
          organization: '',
          username: '',
          loginAccount: '',
          loginPassword: '',
          mobileNum: '',
          emails: '',
          status: '',
          assignRole: ''
        },
        // 控制全局按钮 是否禁用
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        dialogVisible: false,
        tableData: [],
        statusList: [
          {label: '启用', value: 1},
          {label: '禁用', value: 0},
        ],
        // 表格选中之后数据接收
        checkListValue: [],
        checkList: [
          {label: '系统管理员', value: 1},
          {label: '区域经理', value: 2}
        ],
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
          label: 'label',       // 标签显示
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
            for (var i = 0; i < data.length; i++) {
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
        // 选中数据 获取id 存储
        var checkValue = new Array();
        data.forEach(function (item) {
          checkValue.push(item.id);
        });
        _t.checkListValue = checkValue;
      },
      // 改变当前页码
      handleCurrentChange(val) {
        this.options.currentPage = val;
      },
      // 启用
      enableData() {
        var _t = this;
        this.$confirm('请问是否确认启用当前的记录?', this.$t('public.confirmTip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user', {
            token: _t.getCookie('hy-token'),
            id: _t.checkListValue.join(','),
            status: 1
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录启用成功!', this.$t('public.resultTip'), {
                  confirmButtonText: this.$t('public.confirm')
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
      // 禁用
      disableData() {
        this.$confirm('请问是否确认禁用当前的记录?', this.$t('public.confirmTip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/user', {
            token: _t.getCookie('hy-token'),
            id: _t.checkListValue.join(','),
            status: 0
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录禁用成功!', this.$t('public.resultTip'), {
                  confirmButtonText: this.$t('public.confirm')
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
      // 删除
      deleteData() {
        this.$confirm('请问是否确认删除当前的记录?', this.$t('public.confirmTip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(() => {

        }).catch(() => {
          return;
        });
      },
      // 查询数据
      getData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('system/user/pagelist', {
          token: _t.getCookie('hy-token'),
          username: _t.formItem.username,
          organizationId: _t.formItem.organization,
          status: _t.formItem.status,
          currentPage: _t.options.currentPage,
          pageSize: _t.options.pageSize,
          languageMark: localStorage.getItem('hy-language')
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.tableData = res.data.list;
              _t.options.currentPage = res.data.currentPage;
              _t.options.total = res.data.count;
              break;
            case 1004: // token 失效
            case 1005: // token 为 null
            case 1006: // token 不一致
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

          }
        });
      },
      // 查询所属组织
      getOrganization() {
        var _t = this;
        _t.$api.get('system/organization/all', {
          token: _t.getCookie('hy-token')
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.organizationList = JSON.parse(res.data).children;
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
      }
    },
    created() {
      // this.$store.commit('setLoading', true);
      // this.getData();
      // this.getOrganization();
    }
  }
</script>

<style scoped>

</style>
