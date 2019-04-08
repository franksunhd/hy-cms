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
          <a href="javascript:;" @click="clickNode">{{$t('functionMenuMaintenance.systemDataDictionary')}}</a>
        </p>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="getCurrentNode"
          :expand-on-click-node="false"
          :default-expand-all="false"/>
      </el-col>
      <el-col :span="20">
        <div class="padding20 borderBottom">
          <!--表单-->
          <el-form inline :model="formItem">
            <el-form-item :label="$t('functionMenuMaintenance.dictionaryName') + '：'">
              <el-input class="width200" v-model="formItem.dictionaryName"/>
            </el-form-item>
            <el-form-item :label="$t('functionMenuMaintenance.status') + '：'">
              <el-select v-model="formItem.status" class="width200">
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
          <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
            <el-table-column type="selection" fixed header-align="center" align="center"/>
            <el-table-column :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="menuName" :label="$t('functionMenuMaintenance.menuName')" header-align="center"
                             align="center"/>
            <el-table-column prop="menuIcon" :label="$t('functionMenuMaintenance.icon')" header-align="center"
                             align="center"/>
            <el-table-column prop="menuHref" :label="$t('functionMenuMaintenance.link')" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('functionMenuMaintenance.jumpType')" header-align="center" align="center"/>
            <el-table-column prop="menuLevel" :label="$t('functionMenuMaintenance.modelLevel')" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('functionMenuMaintenance.sort')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="moveUp(scope.row)">上移</el-button>
                <el-button type="text" @click="moveDown(scope.row)">下移</el-button>
              </template>
            </el-table-column>
            <el-table-column :label="$t('functionMenuMaintenance.status')" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enable === true">启用</span>
                <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" :label="$t('functionMenuMaintenance.createName')" header-align="center"
                             align="center"/>
            <el-table-column prop="createTime" :label="$t('functionMenuMaintenance.createTime')" header-align="center"
                             align="center"/>
          </el-table>
          <!--分页-->
          <pages
            :total='options.total'
            :currentPage='options.currentPage'
            :pageSize='options.pageSize'
            @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
    <!--新增编辑-->
    <el-dialog
      append-to-body
      :title="$t('functionMenuMaintenance.createUpdateDictionary')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px" :model="addEdit" :rules="rules" ref="roleName">
        <el-form-item :label="$t('functionMenuMaintenance.menuName') + '：'" prop="menuNameZh">
          <el-input v-model="addEdit.menuNameZh" placeholder="中文简体" class="width200"/>
        </el-form-item>
        <el-form-item prop="menuNameEn">
          <el-input v-model="addEdit.menuNameEn" placeholder="英文" class="width200"/>
        </el-form-item>
        <!--<el-form-item prop="menuNameTw">-->
        <!--<el-input v-model="addEdit.menuNameTw" placeholder="中文繁体" class="width200"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('functionMenuMaintenance.menuIcon') + '：'">
          <el-upload action="">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-input v-if="false" v-model="addEdit.menuIcon"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.menuUrl') + '：'" prop="menuHref">
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
        <el-form-item :label="$t('functionMenuMaintenance.roleMenu') + '：'">
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
        <el-form-item :label="$t('functionMenuMaintenance.directoryLevel') + '：'" prop="menuLevel">
          <el-input v-model="addEdit.menuLevel" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.orderIndex') + '：'" prop="orderMark">
          <el-input v-model="addEdit.orderMark" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.statusAlert') + '：'" prop="enable">
          <el-radio-group v-model="addEdit.enable">
            <el-radio :label="'1'">{{$t('public.enable')}}</el-radio>
            <el-radio :label="'0'">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!--选择用户-->
      <el-dialog
        :title="$t('functionMenuMaintenance.selectUser')"
        :visible.sync="dialogVisibleAlert"
        append-to-body>
        <el-tree
          :data="selectUser"
          :props="defaultPropsUser"
          show-checkbox
          ref="tree"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getCheckedNodes" size="small">{{$t('public.confirm')}}</el-button>
          <el-button @click="dialogVisibleAlert = false" size="small">{{$t('public.cancel')}}</el-button>
        </span>
      </el-dialog>
      <span slot="footer">
        <el-button type="primary" class="queryBtn" v-if="ifAdd == true" @click="addData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="queryBtn" v-if="ifAdd == false" @click="editData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {isNotNull} from "../../assets/js/validator";
  import {queryOrgWithRole} from "../../assets/js/recursive";

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
          parentId: '',
          menuNameZh: '',
          menuNameEn: '',
          menuNameTw: '',
          menuLevel: '',
          menuIcon: '',
          menuHref: '',
          jumpType: '',
          enable: '',
          orderMark: '',
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
        selectUser: [], // 选中的用户
        treeData: [], // 左侧导航列表
        tableData: [], //
        checkListIds: [], // 选中数据集合的id
        checkValueList: {}, // 选中数据集合 编辑时
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
            {validator: isNotNull, trigger: ['blur']}
          ],
          jumpType: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          menuIcon: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          menuNameZh: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          menuNameEn: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          menuNameTw: [
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
        this.options.currentPage = val;
        this.getData();
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
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getMenuData();
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
                _t.disableBtn.edit = true;
                _t.disableBtn.enable = true;
                _t.disableBtn.disable = true;
                _t.disableBtn.more = true;
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
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getMenuData();
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
                _t.disableBtn.edit = true;
                _t.disableBtn.enable = true;
                _t.disableBtn.disable = true;
                _t.disableBtn.more = true;
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
          _t.$api.delete('system/menu/', {
            jsonString: JSON.stringify({
              id: _t.checkListIds.join(',')
            })
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getMenuData();
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
              case 2007: // 删除失败
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.disableBtn.edit = true;
                _t.disableBtn.enable = true;
                _t.disableBtn.disable = true;
                _t.disableBtn.more = true;
                break;
              default:
                _t.disableBtn.edit = true;
                _t.disableBtn.enable = true;
                _t.disableBtn.disable = true;
                _t.disableBtn.more = true;
                break;
            }
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
        console.log(_t.result());
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
              _t.formItem.nodeId = '0';
              _t.getData();
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
              status: _t.formItem.status == null ? null : _t.formItem.status
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
      // 新增按钮
      addDataBtn() {
        var _t = this;
        _t.ifAdd = true;
        _t.dialogVisible = true;
      },
      // 新增提交
      addData(formName) {
        var _t = this;
        _t.dialogVisible = false;
        if (_t.listData.length == 0) {
          _t.selectUserIsNull = true;
        } else {
          _t.selectUserIsNull = false;
        }
        _t.$refs[formName].validate((valid) => {
          if (valid && _t.selectUserIsNull == false) {
            var menuNameArr = new Array();
            menuNameArr.push(_t.menuNameZh);
            menuNameArr.push(_t.menuNameEn);
            var selectRoleList = new Array();
            _t.result().forEach(function (item) {
              selectRoleList.push(item.nodeId);
            });
            _t.$api.post('system/menu/', {
              systemMenu: {
                parentId: _t.addEdit.parentId,
                menuName: menuNameArr.join(','),
                menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.toString().trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.toString().trim(),
                menuLevel: _t.addEdit.menuLevel == null ? null : _t.addEdit.menuLevel.toString().trim(),
                enable: _t.addEdit.enable == 1 ? true : false,
                languageMark: localStorage.getItem('hy-language')
              },
              roleId: selectRoleList.join(',')
            }, function (res) {
              switch (res.status) {
                case 200:
                  _t.getMenuData();
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
          }
        });
      },
      // 编辑按钮
      editDataBtn() {
        var _t = this;
        _t.ifAdd = false;
        _t.dialogVisible = true;
        console.log(_t.checkValueList);
        _t.addEdit.id = _t.checkValueList.id;
        _t.addEdit.parentId = _t.checkValueList.parentId;
        _t.addEdit.menuNameZh = _t.checkValueList.menuName.split(',')[0] == undefined ? '' : _t.checkValueList.menuName.split(',')[0];
        _t.addEdit.menuNameEn = _t.checkValueList.menuName.split(',')[1] == undefined ? '' : _t.checkValueList.menuName.split(',')[1];
        _t.addEdit.menuHref = _t.checkValueList.menuHref == null ? '' : _t.checkValueList.menuHref;
        _t.addEdit.menuLevel = _t.checkValueList.menuLevel == null ? '' : _t.checkValueList.menuLevel;
        _t.addEdit.menuIcon = _t.checkValueList.menuIcon == null ? '' : _t.checkValueList.menuIcon;
        _t.addEdit.orderMark = _t.checkValueList.orderMark == null ? '' : _t.checkValueList.orderMark;
        _t.addEdit.enable = _t.checkValueList.enable == true ? '1' : '0';
      },
      // 编辑提交
      editData(formName) {
        var _t = this;
        _t.dialogVisible = false;
        if (_t.listData.length == 0) {
          _t.selectUserIsNull = true;
        } else {
          _t.selectUserIsNull = false;
        }
        _t.$refs[formName].validate((valid) => {
          if (valid && _t.selectUserIsNull == false) {
            var menuNameArr = new Array();
            menuNameArr.push(_t.addEdit.menuNameZh);
            menuNameArr.push(_t.addEdit.menuNameEn);
            var selectUserList = new Array();
            _t.result().forEach(function (item) {
              selectUserList.push(item.nodeId);
            });

            _t.$api.put('system/menu/', {
              systemMenu: {
                id: _t.checkListIds.join(','),
                parentId: _t.addEdit.parentId,
                menuName: menuNameArr.join(','),
                menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.toString().trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.toString().trim(),
                menuLevel: _t.addEdit.menuLevel == null ? null : _t.addEdit.menuLevel.toString().trim(),
                enable: _t.addEdit.enable == 1 ? true : false,
                languageMark: localStorage.getItem('hy-language')
              },
              roleId: selectUserList.join(',')
            }, function (res) {
              switch (res.status) {
                case 200:
                  _t.getMenuData();
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
          }
        });
      },
      // 表格数据上移
      moveUp(data) {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.put('', {}, function (res) {
          _t.$store.commit('setLoading', false);
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
            default:
              break;
          }
        });
      },
      // 表格数据下移
      moveDown(data) {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.put('', {}, function (res) {
          _t.$store.commit('setLoading', false);
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
            default:
              break;
          }
        });
      },
      // 选择用户
      selectUserBtn() {
        var _t = this;
        _t.dialogVisibleAlert = true;
        _t.$api.get('system/menu/getOrgRole', {}, function (res) {
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
        _t.getData();
      }
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getMenuData();
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
