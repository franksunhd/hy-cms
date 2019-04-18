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
    <div class="borderRightColorGray functionMenuBox">
      <p class="functionMenuMaintenance-title">
        <a href="javascript:;" @click="clickNode">{{$t('functionMenuMaintenance.systemDataDictionary')}}</a>
      </p>
      <el-tree
        class="functionMenuMaintenance-tree"
        :data="treeData"
        :props="defaultProps"
        highlight-current
        @node-click="getCurrentNode"
        :expand-on-click-node="false"
        :default-expand-all="false"/>
    </div>
    <div class="functionMenu-FormBox">
      <div class="padding20 borderBottom">
        <!--表单-->
        <el-form inline :model="formItem">
          <el-form-item :label="$t('functionMenuMaintenance.dictionaryName') + '：'">
            <el-input class="width200" v-model="formItem.dictionaryName"/>
          </el-form-item>
          <el-form-item :label="$t('functionMenuMaintenance.status') + '：'">
            <el-select v-model="formItem.status" class="width200" clearable>
              <el-option
                v-for="item in statusList"
                :value="item.value"
                :key="item.key"
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
          <el-button type="warning" class="queryBtn" @click="addDataBtn">
            <i class="el-icon-circle-plus-outline"></i>
            {{$t('public.add')}}
          </el-button>
          <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editDataBtn">
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
        <el-table :data="tableData" ref="table" stripe @selection-change="selectTableNum">
          <el-table-column type="selection" fixed header-align="left" align="left"/>
          <el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
            <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
            </template>
          </el-table-column>
          <el-table-column min-width="60px" :label="$t('functionMenuMaintenance.menuName')" header-align="left"
                           align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.menuName" placement="top-start">
                <span>{{scope.row.menuName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="60px" prop="menuIcon" :label="$t('functionMenuMaintenance.icon')" header-align="left"
                           align="left"/>
          <el-table-column min-width="100px" :label="$t('functionMenuMaintenance.link')" header-align="left"
                           align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.menuHref" placement="top-start">
                <span>{{scope.row.menuHref}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="90px" :label="$t('functionMenuMaintenance.jumpType')" header-align="left"
                           align="left"/>
          <el-table-column prop="menuLevel" :label="$t('functionMenuMaintenance.modelLevel')" header-align="left"
                           align="left"/>
          <el-table-column :label="$t('functionMenuMaintenance.sort')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-button :disabled="scope.$index == 0" type="text" @click="moveUp(scope.row)">上移</el-button>
              <el-button :disabled="scope.$index == tableData.length - 1" type="text" @click="moveDown(scope.row)">下移
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('functionMenuMaintenance.status')" header-align="left" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.enable === true">启用</span>
              <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" :label="$t('functionMenuMaintenance.createName')" header-align="left"
                           align="left"/>
          <el-table-column width="160px" :label="$t('functionMenuMaintenance.createTime')" header-align="left"
                           align="left">
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
          @handleSizeChangeSub="handleSizeChangeSub"
          @handleCurrentChangeSub="handleCurrentChange"/>
      </div>
    </div>
    <!--新增编辑-->
    <el-dialog
      append-to-body
      class="functionMenuMaintenance-dialog"
      :title="$t('functionMenuMaintenance.createUpdateDictionary')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px" :model="addEdit" :rules="rules" ref="roleName">
        <el-form-item class="star" :label="$t('functionMenuMaintenance.menuName') + '：'" style="margin-bottom: 0;">
          <div style="position: relative;" v-for="(item,index) in languageList">
            <el-input :id="item.id" @input="menuNameInput(item)" v-model="item.menuName" style="margin-bottom: 20px;"
                      class="width200" :placeholder="item.languageName"/>
            <span class="isNotNull"
                  v-if="item.flag == true && item.menuName.trim() == ''">{{$t('public.isNotNull')}}</span>
          </div>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.menuIcon') + '：'">
          <el-upload action="">
            <el-button class="queryBtn" size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-input v-if="false" v-model="addEdit.menuIcon"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('functionMenuMaintenance.menuUrl') + '：'" prop="menuHref">
          <el-input v-model="addEdit.menuHref" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.jumpType') + '：'">
          <el-radio-group v-model="addEdit.jumpType">
            <el-radio :label="0">framename</el-radio>
            <el-radio :label="1">_blank</el-radio>
            <el-radio :label="2">_self</el-radio>
            <el-radio :label="3">_parent</el-radio>
            <el-radio :label="4">_top</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="star" :label="$t('functionMenuMaintenance.roleMenu') + '：'">
          <el-button class="queryBtn" type="primary" @click="selectUserBtn">
            {{$t('functionMenuMaintenance.selectUser')}}
          </el-button>
          <!--展示选择的用户数据-->
          <div v-for="(item,index) in listData" :key="index">
            <!--标题部分循环-->
            <p style="font-size: 16px;">
              <template v-for="(k,i) in item.title">
                <span>{{k}}</span>
                <i v-if="i !== item.title.length - 1" class="el-icon-arrow-right"></i>
              </template>
            </p>
            <!--标签部分循环-->
            <el-tag
              style="margin: 10px 10px 0 0;"
              v-for="tag in item.tags"
              :key="tag.id"
              @close="handleClose(tag)"
              closable>
              {{tag.nodeName}}
            </el-tag>
          </div>
          <p v-if="selectUserIsNull == true" class="el-form-item__error">必选项不能为空</p>
        </el-form-item>
        <el-form-item class="star" :label="$t('functionMenuMaintenance.directoryLevel') + '：'" prop="menuLevel">
          <el-input v-model="addEdit.menuLevel" class="width200"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('functionMenuMaintenance.orderIndex') + '：'" prop="orderMark">
          <el-input v-model="addEdit.orderMark" class="width200" readonly/>
        </el-form-item>
        <el-form-item class="star" :label="$t('functionMenuMaintenance.statusAlert') + '：'" prop="enable">
          <el-radio-group v-model="addEdit.enable">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!--选择用户-->
      <el-dialog
        class="functionMenuMaintenance-dialog-selectUser"
        :title="$t('functionMenuMaintenance.selectUser')"
        :visible.sync="dialogVisibleAlert"
        append-to-body>
        <el-tree
          :data="selectUser"
          :props="defaultPropsUser"
          show-checkbox
          node-key="nodeId"
          :default-checked-keys="checkedKeysArr"
          ref="tree"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getCheckedNodes" class="alertBtn">{{$t('public.confirm')}}</el-button>
          <el-button @click="dialogVisibleAlert = false" class="alertBtn">{{$t('public.cancel')}}</el-button>
        </span>
      </el-dialog>
      <span slot="footer">
        <el-button type="primary" class="alertBtn" v-if="ifAdd == true" @click="addData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="alertBtn" v-if="ifAdd == false" @click="editData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import {isNotNull,isMenuHref} from "../../../../assets/js/validator";
  import {queryOrgWithRole} from "../../../../assets/js/recursive";
  import {dateFilter} from "../../../../assets/js/filters";

  export default {
    name: "functionMenuMaintenance",
    components: {Box},
    data() {
      return {
        formItem: {
          nodeId: '0',
          dictionaryName: null,
          status: null,
        },
        addEdit: {
          id: '',
          parentId: null,
          menuLevel: 0,
          menuIcon: '',
          menuHref: '',
          jumpType: '',
          enable: 1,
          orderMark: 1,
        },
        disableBtn: { // 全局按钮启用禁用判断
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        dialogVisible: false, // 新增编辑弹出层
        dialogVisibleAlert: false, // 选择用户弹出层
        ifAdd: false, // 是否新增
        selectUserIsNull: false, // 选中用户是否为空
        statusList: [
          {label: '启用', value: 1},
          {label: '禁用', value: 0},
        ],
        status: '',
        organization: '',
        listData: [],
        selectUser: [], // 选中的角色
        treeData: [], // 左侧导航列表
        tableData: [], //
        checkListIds: [], // 选中数据集合的id
        checkValueList: {}, // 选中数据集合 编辑时
        languageList: [], // 当前系统支持的语言列表
        checkedKeysArr: [], // 选择用户树形控件默认选中的节点组
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        defaultProps: {
          label: 'menuName',
          children: 'systemMenuAndLanguageRelationChildList'
        },
        defaultPropsUser: {
          label: 'nodeName',
          children: 'children'
        },
        rules: {
          menuLevel: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          orderMark: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          enable: [
            {validator: isNotNull, trigger: ['blur', 'change']}
          ],
          menuHref: [
            {validator: isNotNull, trigger: ['blur']},
            {validator: isMenuHref, trigger: ['blur']},
          ],
          jumpType: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          menuIcon: [
            {validator: isNotNull, trigger: ['blur']}
          ]
        }
      }
    },
    methods: {
      // 重置表单数据
      resetFormData() {
        var _t = this;
        _t.dialogVisible = false;
        _t.addEdit.id = '';
        _t.addEdit.parentId = null;
        _t.addEdit.menuLevel = 0;
        _t.addEdit.menuIcon = '';
        _t.addEdit.menuHref = '';
        _t.addEdit.jumpType = '';
        _t.addEdit.enable = 1;
        _t.addEdit.orderMark = 1;
        _t.$refs.table.clearSelection();
      },
      // 输入框菜单名称校验
      menuNameInput(data) {
        if (data.menuName.trim() == '') {
          data.flag = true;
          document.getElementById(data.id).style.borderColor = '#F56C6C';
        } else {
          data.flag = false;
          document.getElementById(data.id).style.borderColor = '#DCDFE6';
        }
      },
      // 查询当前支持的语言
      getLanguage() {
        var _t = this;
        _t.$api.get('system/language/all', {}, function (res) {
          switch (res.status) {
            case 200:
              var languageList = res.data.list;
              languageList.forEach(function (item) {
                item.menuName = '';
                item.languageMark = item.languageCode;
                item.flag = false;
              });
              _t.languageList = languageList;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.languageList = [];
              break;
          }
        });
      },
      // 新增按钮
      addDataBtn() {
        var _t = this;
        _t.ifAdd = true;
        _t.dialogVisible = true;
        _t.addEdit.menuLevel += 1;
        _t.getLanguage();
      },
      // 新增提交
      addData(formName) {
        var _t = this;
        // 选择用户为空的情况
        if (_t.listData.length == 0) {
          _t.selectUserIsNull = true;
        } else {
          _t.selectUserIsNull = false;
        }
        // 菜单名称有为空的情况
        var isNullNum = 0;
        _t.languageList.forEach(function (item) {
          if (item.menuName == '') {
            item.flag = true;
            document.getElementById(item.id).style.borderColor = 'red';
          } else {
            isNullNum += 1;
          }
        });
        _t.$refs[formName].validate((valid) => {
          if (valid && _t.selectUserIsNull == false && isNullNum == _t.languageList.length) {
            var selectRoleList = new Array();
            _t.result().forEach(function (item) {
              selectRoleList.push(item.nodeId);
            });
            _t.$api.post('system/menu/', {
              systemMenu: {
                parentId: _t.addEdit.parentId,
                menuName: _t.languageList,
                menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.toString().trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.toString().trim(),
                menuLevel: _t.addEdit.menuLevel,
                enable: _t.addEdit.enable == 1 ? true : false,
                languageMark: localStorage.getItem('hy-language')
              },
              roleId: selectRoleList.join(',')
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getMenuData();
                  _t.getData();
                  // 新增语言之后刷新左侧导航的数据
                  _t.$bus.emit('getMenu', true);
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
                    confirmButtonClass: 'alertBtn'
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
      editDataBtn() {
        var _t = this;
        // 新增编辑判断
        _t.ifAdd = false;
        _t.addEdit.id = _t.checkValueList.id;
        _t.getEditData(_t.addEdit.id);
        _t.getEditRoleData(_t.addEdit.id);
      },
      // 根据菜单id查询需要编辑的数据
      getEditData(data) {
        var _t = this;
        _t.$api.get('system/menu/' + data, {}, function (res) {
          switch (res.status) {
            case 200:
              var languageList = res.data.systemMenuLanguageList;
              languageList.forEach(function (item) {
                item.languageName = item.createBy;
              });
              _t.languageList = languageList;
              _t.addEdit.parentId = res.data.parentId;
              _t.addEdit.menuHref = res.data.menuHref;
              _t.addEdit.menuLevel = Number(res.data.menuLevel);
              _t.addEdit.menuIcon = res.data.menuIcon;
              _t.addEdit.orderMark = res.data.orderMark;
              _t.addEdit.enable = res.data.enable == true ? 1 : 0;
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
      // 根据菜单id 查询 需要编辑的数据下的角色列表
      getEditRoleData(data) {
        var _t = this;
        _t.$api.get('system/menu/getRoleByMenu', {
          jsonString: JSON.stringify({
            systemMenu: {
              id: data
            }
          })
        }, function (res) {
          switch (res.status) {
            case 200:
              var nodeIdArr = new Array();
              var resData = res.data;
              resData.forEach(function (item) {
                var obj = new Object();
                obj.children = [];
                obj.level = 1; // 类型 1代表角色类型 2代表组织类型
                obj.nodeId = item.id;
                obj.nodeName = item.roleName;
                obj.parentNodeId = item.organizationId;
                nodeIdArr.push(obj);
              });
              _t.listData = queryOrgWithRole(_t.selectUser, nodeIdArr, 1);
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
      editData(formName) {
        var _t = this;
        if (_t.listData.length == 0) {
          _t.selectUserIsNull = true;
        } else {
          _t.selectUserIsNull = false;
        }
        // 菜单名称有为空的情况
        var isNullNum = 0;
        _t.languageList.forEach(function (item) {
          if (item.menuName == '') {
            item.flag = true;
            document.getElementById(item.id).style.borderColor = 'red';
          } else {
            isNullNum += 1;
          }
        });
        _t.$refs[formName].validate((valid) => {
          if (valid && _t.selectUserIsNull == false && isNullNum == _t.languageList.length) {
            var selectUserList = new Array();
            // 角色集合
            _t.result().forEach(function (item) {
              selectUserList.push(item.nodeId);
            });
            _t.$api.put('system/menu/', {
              systemMenu: {
                id: _t.checkListIds.join(','),
                parentId: _t.addEdit.parentId,
                menuName: _t.languageList,
                menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.toString().trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.toString().trim(),
                menuLevel: _t.addEdit.menuLevel,
                enable: _t.addEdit.enable == 1 ? true : false,
                languageMark: localStorage.getItem('hy-language')
              },
              roleId: selectUserList.join(',')
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getMenuData();
                  _t.getData();
                  // 编辑成功后刷新左侧导航的数据
                  _t.$bus.emit('getMenu', true);
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
                    confirmButtonClass: 'alertBtn'
                  });
                  break;
                default:
                  break;
              }
            });
          }
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
            data.forEach(function (item) {
              _t.checkValueList = item;
              // 启用禁用判断
              if (item.enable === false) {
                _t.disableBtn.enable = false;
              } else if (item.enable === true) {
                _t.disableBtn.disable = false;
              }
              checkListIds.push(item.id);
            });
            _t.checkListIds = checkListIds;
            break;
          default: // 多选
            _t.checkValueList = {};
            _t.disableBtn.edit = true;
            _t.disableBtn.more = false;
            var disableFlag = 0, enableFlag = 0;
            var checkListIds = new Array();
            for (var i = 0; i < data.length; i++) {
              // 启用禁用判断
              if (data[i].enable === false) {
                disableFlag++;
              } else if (data[i].enable === true) {
                enableFlag++;
              }
              checkListIds.push(data[i].id);
            }
            _t.checkListIds = checkListIds;
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
          confirmButtonClass: 'alertBtn',
          cancelButtonClass: 'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/menu/enableMenu', {
            systemMenu: {
              id: _t.checkListIds.join(','),
              enable: true
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录启用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getMenuData();
                  _t.getData();
                  // 启用成功之后刷新左侧导航数据
                  _t.$bus.emit('getMenu', true);
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
            _t.disableBtn.edit = true;
            _t.disableBtn.enable = true;
            _t.disableBtn.disable = true;
            _t.disableBtn.more = true;
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
          confirmButtonClass: 'alertBtn',
          cancelButtonClass: 'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/menu/enableMenu', {
            systemMenu: {
              id: _t.checkListIds.join(','),
              enable: false
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录禁用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  // 刷新当前组件列表数据
                  _t.getMenuData();
                  _t.getData();
                  // 刷新左侧导航列表数据
                  _t.$bus.emit('getMenu', true);
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
            _t.disableBtn.edit = true;
            _t.disableBtn.enable = true;
            _t.disableBtn.disable = true;
            _t.disableBtn.more = true;
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
          confirmButtonClass: 'alertBtn',
          cancelButtonClass: 'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.delete('system/menu/', {
            jsonString: JSON.stringify({
              id: _t.checkListIds.join(',')
            })
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getMenuData();
                  _t.getData();
                  // 删除之后刷新左侧导航数据
                  _t.$bus.emit('getMenu', true);
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
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getMenuData();
                  _t.getData();
                  // 删除失败之后刷新左侧导航数据
                  _t.$bus.emit('getMenu', true);
                });
                break;
              case 3005: // 菜单关联其他菜单
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getMenuData();
                  _t.getData();
                  _t.$bus.emit('getMenu', true);
                });
                break;
              default:
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
      // 获取节点显示数据
      getCheckedNodes() {
        var _t = this;
        _t.dialogVisibleAlert = false;
        _t.listData = queryOrgWithRole(_t.selectUser, _t.$refs.tree.getCheckedNodes(), 1);
      },
      // 删除标签
      handleClose(tag) {
        var _t = this;
        var listData = _t.listData;
        listData.forEach(function (item, index) {
          var tags = item.tags;
          if (tags.length > 1) { // 该区域删除之后还有标签
            tags.forEach(function (val, i) {
              if (tag.nodeId == tags[i].nodeId) {
                tags.splice(i, 1);
                _t.result();
                return false;
              }
            });
          } else { // 该区域删除之后没有标签了 删除该区域
            tags.forEach(function (val, i) {
              if (tag.nodeId == tags[i].nodeId) {
                tags.splice(i, 1);
                listData.splice(index, 1);
                _t.result();
                return false;
              }
            });
          }
        });
      },
      // 剩余人员
      result() {
        var _t = this;
        var listData = _t.listData;
        var nodeArr = new Array();
        listData.forEach(function (item) {
          if (item.tags.length !== 0) {
            item.tags.forEach(function (val) {
              nodeArr.push(val);
            });
          }
        });
        return nodeArr;
      },
      // 获取左侧功能菜单列表
      getMenuData() {
        var _t = this;
        _t.$api.get('system/menu/', {
          jsonString: JSON.stringify({
            menuLevel: '1_2_3_4',
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.treeData = res.data.rootMenu;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.treeData = [];
              break;
          }
        });
      },
      // 获取选中树形菜单
      getCurrentNode(data) {
        var _t = this;
        _t.formItem.nodeId = data.id;
        _t.addEdit.parentId = data.id;
        _t.addEdit.menuLevel = data.menuLevel;
        _t.getData();
      },
      // 根据选中菜单id 重新获取子菜单
      getData() {
        var _t = this;
        _t.$api.get('system/menu/pagelist', {
          jsonString: JSON.stringify({
            systemMenu: {
              id: _t.formItem.nodeId,
              menuName: _t.formItem.dictionaryName == null ? null : _t.formItem.dictionaryName.trim(),
              languageMark: localStorage.getItem('hy-language'),
              enable: _t.formItem.status == null ? null : _t.formItem.status
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
      // 表格数据上移
      moveUp(data) {
        var _t = this;
        var dataIdArr = new Array();
        dataIdArr.push(data.id);
        _t.tableData.forEach(function (item, index) {
          if (item.id == data.id) {
            dataIdArr.push(_t.tableData[index - 1].id)
          }
        });
        _t.$store.commit('setLoading', true);
        _t.$api.put('system/menu/enableMenu', {
          systemMenu: {
            id: dataIdArr.join(',')
          },
          upOrDown: 'up'
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200:
              _t.getData();
              _t.getMenuData();
              // 列表数据上移之后刷新左侧导航菜单
              _t.$bus.emit('getMenu', true);
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
      // 表格数据下移
      moveDown(data) {
        var _t = this;
        _t.$store.commit('setLoading', true);
        var dataIdArr = new Array();
        dataIdArr.push(data.id);
        _t.tableData.forEach(function (item, index) {
          if (item.id == data.id) {
            dataIdArr.push(_t.tableData[index + 1].id)
          }
        });
        _t.$api.put('system/menu/enableMenu', {
          systemMenu: {
            id: dataIdArr.join(',')
          },
          upOrDown: 'down'
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200:
              _t.getData();
              _t.getMenuData();
              // 数据下移之后刷新左侧导航菜单
              _t.$bus.emit('getMenu', true);
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
      // 选择用户
      selectUserBtn() {
        var _t = this;
        _t.dialogVisibleAlert = true;
        // 编辑时 过滤数据
        if (_t.ifAdd == false) {
          var checkArr = new Array();
          _t.result().forEach(function (item) {
            checkArr.push(item.nodeId);
          });
          _t.checkedKeysArr = checkArr;
        }
      },
      // 获取组织角色列表
      getOrgRoleList() {
        var _t = this;
        _t.$api.get('system/organization/getOrgRole', {}, function (res) {
          switch (res.status) {
            case 200:
              var selectUser = new Array();
              selectUser.push(JSON.parse(res.data));
              _t.selectUser = selectUser[0].children;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.selectUser = [];
              break;
          }
        });
      },
      // 点击系统功能菜单
      clickNode() {
        var _t = this;
        _t.formItem.nodeId = '0';
        _t.addEdit.parentId = null;
        _t.addEdit.menuLevel = 0;
        _t.getData();
      }
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getMenuData();
      this.getData();
      this.getOrgRoleList();
    }
  }
</script>

<style scoped>
  .functionMenuMaintenance-title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    padding-left: 20px;
  }

  .functionMenuMaintenance-title a {
    line-height: 40px;
    display: inline-block;
  }

  .functionMenuBox {
    position: absolute;
    top: 50px;
    left: 0;
    bottom:0;
    width: 176px;
    overflow: auto;
  }

  .functionMenuMaintenance-tree {
    min-width: 176px;
    display: inline-block;
  }

  .functionMenu-FormBox {
    position: absolute;
    top: 50px;
    left: 176px;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
<style>
  .functionMenuMaintenance-dialog .el-dialog {
    width: 700px;
    height: 600px;
  }

  .functionMenuMaintenance-dialog-selectUser .el-dialog {
    width: 700px;
    height: 450px;
  }
</style>
