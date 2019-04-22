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
            :placeholder="$t('public.selectDate')"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="padding20">
      <!--全局操作-->
      <div class="marBottom16">
        <el-button type="warning" class="queryBtn" @click="addRoleDataBtn">
          <i class="el-icon-circle-plus-outline"></i>
          {{$t('public.add')}}
        </el-button>
        <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editRoleDatBtn">
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
      <el-table :data="tableData" ref="table" stripe @selection-change="selectTableNum">
        <el-table-column type="selection" fixed header-align="left" align="left"/>
        <el-table-column prop="roleName" :label="$t('roleMaintenance.roleName')" header-align="left" align="left"/>
        <el-table-column prop="organizationName" :label="$t('roleMaintenance.organization')" header-align="left" align="left"/>
        <el-table-column prop="userCount" :label="$t('roleMaintenance.userNum')" header-align="left" align="left"/>
        <el-table-column :label="$t('roleMaintenance.status')" header-align="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.enable === true">启用</span>
            <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('roleMaintenance.createName')" header-align="left" align="left"/>
        <el-table-column :label="$t('roleMaintenance.createTime')" header-align="left" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastModifyBy" :label="$t('roleMaintenance.updateName')" header-align="left" align="left"/>
        <el-table-column :label="$t('roleMaintenance.updateTime')" width="200" header-align="left" align="left">
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
        @handleSizeChangeSub="handleSizeChangeSub"
        @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
    <!--新增/编辑-->
    <el-dialog
      class="roleMaintenance-dialog"
      :title="$t('roleMaintenance.addUpdateRole')"
      append-to-body
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" label-width="96px" :rules="rules" ref="ruleForm">
        <el-form-item class="star" :label="$t('roleMaintenance.organization') +'：'" prop="organization">
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
        <el-form-item class="star" :label="$t('roleMaintenance.roleName') +'：'" prop="roleName">
          <el-input v-model="addEdit.roleName" class="width200" />
        </el-form-item>
        <el-form-item class="star" :label="$t('roleMaintenance.isEnable') +'：'" prop="status">
          <el-radio-group v-model="addEdit.status" class="width200">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('roleMaintenance.organizationDes') +'：'">
          <el-input style="width: 400px" type="textarea" :autosize="{ minRows: 3 }" v-model="addEdit.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="alertBtn" type="primary" v-if="ifAdd == true" @click="addRoleData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" type="primary" v-if="ifAdd == false" @click="editRoleData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--用户授权-->
    <el-dialog
      class="role-setUserName-dialog"
      append-to-body
      :title="$t('roleMaintenance.setUserName')"
      :visible.sync="outerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px">
        <el-form-item :label="$t('roleMaintenance.roleOrganization') + '：'">
          <template v-for="(item,index) in organizationName">
            <span>{{item}}</span>
            <i v-if="index !== organizationName.length - 1" class="el-icon-arrow-right"></i>
          </template>
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
            {{tag.displayName}}
          </el-tag>
          <div style="height: 20px;" v-if="tagsLength">必填项不能为空</div>
        </el-form-item>
      </el-form>
      <!--选择用户内页-->
      <el-dialog
        class="roleMaintenance-dialog"
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
        <el-table :data="innerTableData" stripe @select="selectTableNumAlert" @select-all="selectTableNumAlert">
          <el-table-column type="selection" fixed header-align="left" align="left"/>
          <el-table-column prop="displayName" :label="$t('public.name')" header-align="left" align="left"/>
          <el-table-column prop="username" :label="$t('roleMaintenance.account')" header-align="left" align="left"/>
          <el-table-column :label="$t('public.sex')" header-align="left" align="left"/>
          <el-table-column :label="$t('roleMaintenance.registerDate')" header-align="left" align="left">
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
          @handleSizeChangeSub="innerOptionsHandleSizeChange"
          @handleCurrentChangeSub="innerOptionsHandleCurrentChange"/>
        <div slot="footer">
          <el-button class="alertBtn" type="primary" @click="innerVisible = false">{{$t('public.confirm')}}</el-button>
          <el-button class="alertBtn" @click="innerVisible = false">{{$t('public.cancel')}}</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button class="alertBtn" type="primary" @click="userDataForm">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="outerVisible = false;tagsLength = false;">{{$t('public.close')}}</el-button>
      </div>
    </el-dialog>
    <!--功能权限-->
    <el-dialog
      append-to-body
      class="role-setRoleLimit-dialog"
      :title="$t('roleMaintenance.roleLimit')"
      :visible.sync="dialogVisibleFunction"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form>
        <el-form-item>
          <el-tree
            :data="selectArr"
            node-key="id"
            show-checkbox
            ref="tree"
            @check-change="currentChange"
            :props="menuProps"
            :check-strictly="true"
            :default-checked-keys="keys"
            :default-expanded-keys="menuExpanded"


            />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <div v-if="selectMenuMark" class="isNotNull">必填项不能为空</div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="alertBtn" type="primary" @click="commitMenuData">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="dialogVisibleFunction = false; selectMenuMark = false;">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--数据权限-->
    <el-dialog
      class="role-setDateLimit-dialog"
      append-to-body
      :title="$t('roleMaintenance.setDateLimit')"
      :visible.sync="dialogVisibleData"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form>
        <el-form-item :label="$t('roleMaintenance.setDateLimit') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="3">资源视图</el-radio>
            <el-radio :label="6">业务视图</el-radio>
            <el-radio :label="9">机房视图</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="role-setDateLimit-dialog-line"><div class="line"></div></div>
        <el-form-item style="margin-bottom: 10px;">
          <el-input class="width200 role-input-search">
            <el-button slot="append" @click="getData" class="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox class="role-setDateLimit-dialog-checkout" :checked="checked" @change="checkedAll">全选</el-checkbox>
          <el-tree
            id="dataLimit-box"
            node-key="id"
            :data="selectArr"
            :props="menuProps"
            show-checkbox
            ref="vueTree"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="alertBtn" type="primary" @click="dialogVisibleData = false">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="dialogVisibleData = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import {isNotNull} from "../../../../assets/js/validator";
  import {dateFilter} from '../../../../assets/js/filters';
  import {orgBreadcrumb,getMenuWithParentIdByMenuId,getParent, uniqArr, getChildren} from "../../../../assets/js/recursive";

  export default {
    name: "role-maintenance",
    components: {Box},
    data() {
      return {
        // 查询表单
        formItem: {
          roleName: null,
          dateTime: null,
          userName: null
        },
        // 新增编辑表单
        addEdit: {
          id: '',
          organization: '',
          roleName: '',
          organizationId: '',
          status: 1,
          description: ''
        },
        status: '',
        // 全局按钮 是否禁用
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        // 判断视图下全选按钮 是否选中
        checked: false,
        // 新增编辑弹出层
        dialogVisible: false,
        // 用户授权外层
        outerVisible: false,
        // 用户授权内层
        innerVisible: false,
        // 功能权限
        dialogVisibleFunction: false,
        // 数据权限
        dialogVisibleData: false,
        // 所属组织下拉框
        isShowEditPopover: false,
        // 是否编辑
        ifAdd: false,
        // 是否提交用户授权
        tagsLength: false,
        // 是否提交功能权限
        selectMenuMark: false,
        // 表格数据
        tableData: [],
        // 内层表格数据
        innerTableData: [],
        // 组织结构名
        organizationName: [],
        menuExpanded:[], // 功能菜单授权数据回显 展开树
        keys:[],
        // 外层分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        // 内层分页
        innerOptions: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        // 标签
        tags: [],
        // 数据默认字段
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'nodeName',       // 标签显示
          children: 'children', // 子级
        },
        menuProps: {
          label: 'menuName',
          children: 'systemMenuAndLanguageRelationChildList'
        },
        // 所属组织列表
        organizationList: [],
        checkListIds: [], // 选中表格的数据id集合
        checkListOrg: [], // 选中表格的数据组织id集合
        selectArr: [], // 功能菜单集合
        editDataList: {}, // 编辑选中的集合
        rules: {
          organization: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          roleName: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          status: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          description: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          tags: [
            {validator: isNotNull, trigger: ['blur']}
          ]
        },
      }
    },
    methods: {
      // 树节点的点击
      currentChange(node, status) {
        var _t = this;
        var nodeChildrenArr = [];
        var keys = new Array();
        var uniqArrKeys = new Array();
        if (status) {
          var parent = getParent(_t.selectArr, node.id, 'id', 'systemMenuAndLanguageRelationChildList', 'parentId');
          parent.forEach(function (item) {
            keys.push(item.id);
          });
          uniqArrKeys = uniqArr(keys);
          _t.keys = uniqArrKeys;
        } else {
          _t.keys.forEach(function (item, index) {
            if (item === node.id) {
              _t.keys.splice(index, 1);
            }
          });
          // 获取勾选带子级的节点
          nodeChildrenArr = getChildren(_t.selectArr, node.id, 'id', 'systemMenuAndLanguageRelationChildList');
          // 循环设置取消勾选节点子集的所有节点
          nodeChildrenArr.forEach(function (item) {
            // item key值, false: 不勾选
            _t.$refs.tree.setChecked(item, false, true);
          });
        }
      },
      // 功能权限
      functionData() {
        var _t = this;
        _t.dialogVisibleFunction = true;
        _t.getFunctionDataByRoleId(_t.checkListIds.join(','))
      },
      // 获取已授权的功能权限菜单
      getFunctionDataByRoleId(val){
        var _t = this;
        _t.$api.get('system/menu/getImpowerMenuById',{
          jsonString:JSON.stringify({
            systemRole:{
              id:val
            }
          })
        },function (res) {
          switch (res.status) {
            case 200:
              console.log(status);
              var menuData = new Array();
              res.data.forEach(function (item) {
                menuData.push(item.id);
              });
              _t.menuExpanded = menuData;
              _t.$refs.tree.setCheckedKeys(menuData);
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
      // 提交授权菜单
      commitMenuData() {
        var _t = this;
        var selectMenu = new Array();
        selectMenu = getMenuWithParentIdByMenuId(_t.selectArr,_t.$refs.tree.getCheckedKeys());
        if (selectMenu.length !== 0) {
          _t.selectMenuMark = false;
          _t.$api.post('system/role/impowerRoleByMenu', {
            systemRole: {
              id: _t.checkListIds.join(',')
            },
            menuId: selectMenu.join(',')
          }, function (res) {
            switch (res.status) {
              case 200:
                _t.dialogVisibleFunction = false;
                _t.$refs.tree.setCheckedKeys([]);
                _t.$bus.emit('getMenu',true);
                _t.resetFormData();
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
        } else {
          _t.selectMenuMark = true;
        }
      },
      // 重置表单
      resetFormData(){
        var _t = this;
        _t.addEdit.id =  '';
        _t.addEdit.organization = '';
        _t.addEdit.roleName = '';
        _t.addEdit.organizationId = '';
        _t.addEdit.status = 1;
        _t.addEdit.description = '';
        _t.$refs.table.clearSelection();
        _t.dialogVisible = false;
      },
      // 提交授权用户
      userDataForm() {
        var _t = this;
        if (_t.tags.length !== 0) {
          _t.tagsLength = false;
          var userIds = new Array();
          _t.tags.forEach(function (item) {
            userIds.push(item.id);
          });
          _t.$api.post('system/role/impowerRoleByUser', {
            systemRole: {
              id: _t.checkListIds.join(',')
            },
            userId: userIds.join(',')
          }, function (res) {
            switch (res.status) {
              case 200:
                _t.outerVisible = false;
                _t.tags = [];
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              default:
                _t.tags = [];
                break;
            }
          });
        } else {
          _t.tagsLength = true;
        }
      },
      // 选中表格内部数据
      selectTableNumAlert(val) {
        var _t = this;
        _t.tags = val;
      },
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
          type: 'warning',
          confirmButtonClass:'alertBtn',
          cancelButtonClass:'alertBtn'
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
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                  _t.resetFormData();
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
          confirmButtonClass:'alertBtn',
          cancelButtonClass:'alertBtn'
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
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                  _t.resetFormData();
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
            var checkListIds = new Array();
            var checkListOrg = new Array();
            data.forEach(function (item) {
              _t.editDataList = item;
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
            _t.editDataList = {};
            var disableFlag = 0, enableFlag = 0;
            var checkListIds = new Array();
            var checkListOrg = new Array();
            for (var i = 0; i < data.length; i++) {
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
      // 内层 改变当前页码
      innerOptionsHandleCurrentChange(val) {
        var _t = this;
        _t.innerOptions.currentPage = val;
        _t.selectRole();
      },
      // 改变每页显示条数
      innerOptionsHandleSizeChange(val){
        var _t = this;
        _t.options.pageSize = val;
        _t.getData();
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
          _t.$api.delete('system/role/', {
            jsonString: JSON.stringify({
              roleId: _t.checkListIds.join(',')
            })
          }, function (res) {
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                  _t.resetFormData();
                });
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              case 2007: // 删除失败
              case 3005: // 角色关联用户不能删除
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'alertBtn'
                }).then(()=>{
                  _t.getData();
                  _t.resetFormData();
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
      // 用户授权 数据回显
      authorizationData() {
        var _t = this;
        _t.organizationName = orgBreadcrumb(_t.organizationList, _t.editDataList.organizationId);
        _t.outerVisible = true;
        _t.getAuthorizationData(_t.checkListIds.join(','))
      },
      // 获取已授权的用户
      getAuthorizationData(val){
        var _t = this;
        _t.$api.get('system/user/getImpowerRoleById',{
          jsonString:JSON.stringify({
            systemRole:{
              id:val
            }
          })
        },function (res) {
          switch (res.status) {
            case 200:
              var tags = new Array();
              res.data.forEach(function (item) {
                var obj = new Object();
                obj.id = item.id;
                obj.displayName = item.displayName;
                tags.push(obj);
              });
              _t.tags = tags;
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
      // 数据权限
      infoData() {
        var _t = this;
        _t.dialogVisibleData = true;
      },
      // 关闭标签
      handleClose(tag) {
        var _t = this;
        for (var i = 0; i < _t.tags.length; i++) {
          if (tag.id === _t.tags[i].id) {
            _t.tags.splice(i, 1);
          }
        }
      },
      // 全选和取消全选
      checkedAll() {
        var _t = this;
        _t.checked = !_t.checked;
        if (_t.checked) {
          //全选
          _t.$refs.vueTree.setCheckedNodes(_t.organizationList);
        } else {
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
      // 新增角色按钮
      addRoleDataBtn() {
        this.ifAdd = true;
        this.dialogVisible = true;
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
                description: _t.addEdit.description === null ? null : _t.addEdit.description.trim(),
                createBy: localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language')
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getData();
                  _t.resetFormData();
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
                    _t.getData();
                    _t.resetFormData();
                  });
                  break;
                default:
                  _t.$alert(res.message, _t.$t('public.resultTip'), {
                    confirmButtonText: _t.$t('public.confirm'),
                    confirmButtonClass:'alertBtn'
                  }).then(()=>{
                    _t.getData();
                    _t.resetFormData();
                  });
                  break;
              }
            });
          }
        });
      },
      // 编辑角色按钮
      editRoleDatBtn() {
        var _t = this;
        // 新增编辑判断
        _t.ifAdd = false;
        _t.addEdit.id = _t.editDataList.id;
        _t.getEditRoleListById(_t.addEdit.id);
      },
      // 编辑时根据id查询数据
      getEditRoleListById(val){
        var _t = this;
        _t.$api.get('system/role/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              _t.addEdit.roleName = res.data.roleName;
              _t.addEdit.organization = res.data.organizationName;
              _t.addEdit.organizationId = res.data.organizationId;
              _t.addEdit.status = res.data.enable == true ? 1 : 0;
              _t.addEdit.description = res.data.description;
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
      // 编辑角色
      editRoleData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.put('system/role/', {
              systemRole: {
                id: _t.addEdit.id,
                organizationId: _t.addEdit.organizationId,
                roleName: _t.addEdit.roleName === null ? null : _t.addEdit.roleName.trim(),
                enable: _t.addEdit.status,
                description: _t.addEdit.description === null ? null : _t.addEdit.description.trim(),
                lastModified: localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language')
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getData();
                  _t.resetFormData();
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
                    _t.getData();
                    _t.resetFormData();
                  });
                  break;
                default:
                  _t.$alert(res.message, _t.$t('public.resultTip'), {
                    confirmButtonText: _t.$t('public.confirm'),
                    confirmButtonClass:'alertBtn'
                  }).then(()=>{
                    _t.getData();
                    _t.resetFormData();
                  });
                  break;
              }
            });
          }
        });
      },
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
      },
      // 请求菜单数据
      getMenuData() {
        var _t = this;
        _t.$api.get('system/menu/getMenuTree', {
          jsonString: JSON.stringify({
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          switch (res.status) {
            case 200: // 查询成功
              var navBarArr = res.data.rootMenu;
              if (navBarArr) {
                navBarArr.forEach(function (item) {
                  if (item.systemMenuAndLanguageRelationChildList.length === 0) {
                    item.systemMenuAndLanguageRelationChildList = null;
                  }
                });
                _t.selectArr = navBarArr;
              }
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.selectArr = [];
              break;
          }
        });
      },
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getData();
      this.getOrganization();
      this.getMenuData();
    },
  }
</script>

<style>
  .roleMaintenance-dialog .el-dialog {
    width: 600px;
    height: 400px;
  }

  .role-setUserName-dialog .el-dialog {
    width: 820px;
    height: 500px;
  }

  .role-setRoleLimit-dialog .el-dialog {
    width: 700px;
    height: 450px;
  }

  .role-setDateLimit-dialog .el-dialog {
    width: 700px;
    height: 450px;
  }

  .role-setDateLimit-dialog-checkout .el-checkbox__label {
    font-size: 12px;
  }

  .role-setDateLimit-dialog-line {
    position: relative;
  }

  .role-setDateLimit-dialog-line div.line {
    position: absolute;
    top: -15px;
    left: -20px;
    right: -20px;
    height: 1px;
    border-bottom: 1px solid #eaedf1;
  }

  .role-input-search .el-input__inner {
    height: 32px;
  }
</style>
