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
      <el-form inline v-model="formItem">
        <el-form-item :label="$t('roleMaintenance.roleName') + '：'">
          <el-input v-model="formItem.roleName" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.roleDate') + '：'">
          <el-date-picker
            v-model="formItem.dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
        <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editRoleData">
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
        <el-table-column prop="roleName" :label="$t('roleMaintenance.roleName')" header-align="center" align="center"/>
        <el-table-column prop="organizationName" :label="$t('roleMaintenance.organization')" header-align="center"
                         align="center"/>
        <el-table-column prop="userNum" :label="$t('roleMaintenance.userNum')" header-align="center" align="center"/>
        <el-table-column :label="$t('roleMaintenance.status')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enable === true">启用</span>
            <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('roleMaintenance.createName')" header-align="center"
                         align="center"/>
        <el-table-column :label="$t('roleMaintenance.createTime')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastModifyBy" :label="$t('roleMaintenance.updateName')" header-align="center"
                         align="center"/>
        <el-table-column :label="$t('roleMaintenance.updateTime')" width="200" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lastModifyTime | dateFilter}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pages
        :total='options.total'
        :currentPage='options.currentPage'
        :pageSize='options.pageSize'
        @handleCurrentChangeSub="handleCurrentChange" />
    </div>
    <!--新增/编辑-->
    <el-dialog
      :title="$t('roleMaintenance.addUpdateRole')"
      append-to-body
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('roleMaintenance.organization') +'：'" prop="organization">
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
        <el-form-item :label="$t('roleMaintenance.roleName') +'：'" prop="roleName">
          <el-input v-model="addEdit.roleName"/>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.isEnable') +'：'" prop="status">
          <el-radio-group v-model="addEdit.status">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.organizationDes') +'：'" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="addEdit.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="queryBtn" type="primary" @click="addRoleData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--用户授权-->
    <el-dialog
      append-to-body
      :title="$t('roleMaintenance.setUserName')"
      :visible.sync="outerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('roleMaintenance.roleOrganization') + '：'">
          <span>集团亚洲总部-->上海分部</span>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.pleaseSelectUser') + '：'">
          <el-button type="primary" class="queryBtn" @click="selectRole">{{$t('roleMaintenance.select')}}</el-button>
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
        <el-form inline :model="formItem">
          <el-form-item :label="$t('public.name') + '：'">
            <el-input class="width200" v-model="formItem.username"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="queryBtn" @click="selectRole">{{$t('public.query')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="innerTableData" stripe>
          <el-table-column type="selection" fixed header-align="center" align="center" />
          <el-table-column prop="displayName" :label="$t('public.name')" header-align="center" align="center"/>
          <el-table-column prop="username" :label="$t('roleMaintenance.account')" header-align="center" align="center"/>
          <el-table-column :label="$t('public.sex')" header-align="center" align="center" />
          <el-table-column :label="$t('roleMaintenance.registerDate')" header-align="center" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | dateFilter}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <pages
          :total='innerOptions.total'
          :currentPage='innerOptions.currentPage'
          :pageSize='innerOptions.pageSize'
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
      append-to-body
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
      append-to-body
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
          <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
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
  import {isNotNull} from "../../assets/js/validator";
  import {dateFilter} from '../../assets/js/filters';

  export default {
    name: "role-maintenance",
    components: {Box},
    data(){
      return {
        // 查询表单
        formItem: {
          roleName: null,
          dateTime: null,
          userName: null
        },
        // 新增编辑表单
        addEdit: {
          organization: '',
          organizationId: 'org_01_02',
          roleName: '23',
          status: false,
          description: 'hahha'
        },
        status: '',
        // 全局按钮 是否禁用
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        checked:false,
        dialogVisible:false,
        outerVisible:false,
        innerVisible:false,
        dialogVisibleFunction:false,
        dialogVisibleData:false,
        isShowEditPopover: false,
        tableData: [],
        innerTableData: [],
        options:{
          total: 0, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
        },
        innerOptions:{
          total: 0, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
        },
        tags: [],
        // 数据默认字段
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'nodeName',       // 标签显示
          children: 'children', // 子级
        },
        organizationList: [],
        checkListIds: [], // 选中表格的数据id集合
        checkListOrg: [], // 选中表格的数据组织id集合
        rules: {
          organization: [
            {validator: isNotNull, trigger: ['blur', 'change']}
          ],
          roleName: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          status: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          description: [
            {validator: isNotNull, trigger: ['blur']}
          ]
        }
      }
    },
    methods:{
      // 查询表格数据
      getData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('system/role/pagelist', {
          jsonString: JSON.stringify({
            systemRole: {
              roleName: _t.formItem.roleName == null ? null : _t.formItem.roleName.trim(),
              createTime: _t.formItem.dateTime == null ? null : dateFilter(_t.formItem.dateTime[0].getTime()),
              lastModifyTime: _t.formItem.dateTime == null ? null : dateFilter(_t.formItem.dateTime[1].getTime()),
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.tableData = res.data.list;
              _t.options.currentPage = res.data.currentPage;
              _t.options.total = res.data.count;
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
      // 启用
      enableData() {
        var _t = this;
        _t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/role/enableRole', {
            systemRole: {
              id: _t.checkListIds.join(','),
              enable: 1
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
          _t.$api.put('system/role/enableRole', {
            systemRole: {
              enable: 0,
              id: _t.checkListIds.join(',')
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
            var checkListIds = new Array();
            var checkListOrg = new Array();
            data.forEach(function (item) {
              // 判断启用禁用
              if (item.enable === false) {
                _t.disableBtn.enable = false;
              } else if (item.enable === true) {
                _t.disableBtn.disable = false;
              }
              // 获取选中的 id
              checkListIds.push(item.id);
              checkListOrg.push(item.organizationId);
            });
            _t.checkListIds = checkListIds;
            _t.checkListOrg = checkListOrg;
            break;
          default: // 多选
            _t.disableBtn.edit = true;
            _t.disableBtn.more = false;
            var disableFlag = 0, enableFlag = 0;
            var checkListIds = new Array();
            var checkListOrg = new Array();
            for (var i = 0;i < data.length;i++){
              // 根据选中条数中的状态值判断 启用禁用数量
              if (data[i].enable === false) {
                disableFlag++;
              } else if (data[i].enable === true) {
                enableFlag++;
              }
              // 获取选中的数据的id值
              checkListIds.push(data[i].id);
              checkListOrg.push(data[i].organizationId);
            }
            _t.checkListIds = checkListIds;
            _t.checkListOrg = checkListOrg;
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
        _t.getData();
      },
      // 内层 改变当前页码
      innerOptionsHandleCurrentChange(val){
        var _t = this;
        _t.innerOptions.currentPage = val;
        _t.selectRole();
      },
      // 删除
      deleteData(){
        var _t = this;
        _t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{
          _t.$api.delete('system/role/', {
            jsonString: JSON.stringify({
              roleId: _t.checkListIds.join(',')
            })
          }, function (res) {
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
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
                });
                break;
              default:
                break;
            }
          });
        }).catch(()=>{
          return;
        });
      },
      // 用户授权
      authorizationData(){
        var _t = this;
        _t.outerVisible = true;
      },
      // 功能权限
      functionData(){
        var _t = this;
        _t.dialogVisibleFunction = true;
      },
      // 数据权限
      infoData(){
        var _t = this;
        _t.dialogVisibleData = true;
      },
      // 关闭标签
      handleClose(tag){
        var _t = this;
        for (var i = 0; i < _t.tags.length; i++) {
          if (tag.id === _t.tags[i].id) {
            _t.tags.splice(i, 1);
          }
        }
        console.log(_t.tags);
      },
      // 全选和取消全选
      checkedAll(){
        var _t = this;
        _t.checked = !_t.checked;
        if (_t.checked) {
          //全选
          _t.$refs.vueTree.setCheckedNodes(_t.organizationList);
        }else{
          //取消选中
          _t.$refs.vueTree.setCheckedKeys([]);
        }
      },
      // 点击所属组织节点
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.organization = val.nodeName;
        _t.addEdit.organizationId = val.nodeId;
        _t.isShowEditPopover = false;
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
      // 新增角色
      addRoleData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.post('system/role/', {
              systemRole: {
                organizationId: _t.addEdit.organizationId,
                roleName: _t.addEdit.roleName === null ? null : _t.addEdit.roleName.trim(),
                enable: _t.addEdit.status,
                description: _t.addEdit.description === null ? null : _t.addEdit.description.trim()
              }
            }, function (res) {
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
                case 2005:
                  _t.$alert(res.message);
                  break;
                default:
                  break;
              }
            });
          }
        });
      },
      // 编辑角色
      editRoleData(formName) {
        var _t = this;
        // _t.$refs[formName].validate((valid) => {
        //   if (valid) {
        _t.$api.put('system/role/', {
          systemRole: {
            id: 'b548994283b54b7982066e1b914872a1',
            organizationId: _t.addEdit.organizationId,
            roleName: _t.addEdit.roleName === null ? null : _t.addEdit.roleName.trim(),
            enable: _t.addEdit.status,
            description: _t.addEdit.description === null ? null : _t.addEdit.description.trim()
          }
        }, function (res) {
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
            case 2006:
              _t.$alert(res.message);
              break;
            default:
              break;
          }
        });
      },
      // });
      // },
      // 根据组织id查询用户列表
      selectRole() {
        var _t = this;
        _t.innerVisible = true;
        _t.$api.get('/system/user/pagelist/', {
          jsonString: JSON.stringify({
            systemUser: {
              username: _t.formItem.username == null ? null : _t.formItem.username.trim(),
              organizationId: _t.checkListOrg.join(','),
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.innerOptions.currentPage,
            pageSize: _t.innerOptions.pageSize
          })
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.innerTableData = res.data.list;
              _t.innerOptions.total = res.data.count;
              _t.innerOptions.currentPage = res.data.currentPage;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.innerTableData = [];
              _t.innerOptions.total = 0;
              _t.innerOptions.currentPage = 1;
              break;
          }
        });
      }
    },
    created(){
      this.$store.commit('setLoading', true);
      this.getData();
      this.getOrganization();
    },
  }
</script>

<style>
  #dataLimit-box > div.el-tree-node > div.el-tree-node__children > div.el-tree-node > div.el-tree-node__children > div.el-tree-node {
    float: left;
  }
</style>
