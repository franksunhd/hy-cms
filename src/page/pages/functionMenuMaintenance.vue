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
        <el-form-item :label="$t('functionMenuMaintenance.menuIcon') + '：'" prop="menuIcon">
          <el-upload action="">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-input v-if="false" v-model="addEdit.menuIcon"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.menuUrl') + '：'" prop="menuHref">
          <el-input v-model="addEdit.menuHref" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.jumpType') + '：'" prop="jumpType">
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
          <div v-for="(item,index) in listData"> <!--第一层 数据条数的循环-->
            <p>
              <span>{{item.headName}}</span>
              <span v-if="item.branchName !== null">></span>
              <span v-if="item.branchName !== null">{{item.branchName}}</span>
            </p>
            <el-tag
              v-for="(tag,index) in item.headChildren"
              :key="tag.id"
              @close="handleClose(tag)"
              :disable-transitions="true"
              closable>
              {{tag.label}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.directoryLevel') + '：'" prop="menuLevel">
          <el-input v-model="addEdit.menuLevel" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.orderIndex') + '：'" prop="orderMark">
          <el-input v-model="addEdit.orderMark" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.statusAlert') + '：'" prop="enable">
          <el-radio-group v-model="addEdit.enable">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
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
          ref="tree">
          <!--<span slot-scope="{ node, data }">-->
          <!--<i v-if="data.type !== 1" class="el-icon-document"></i>{{ node.nodeName }}-->
          <!--</span>-->
        </el-tree>
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
            {validator: isNotNull, trigger: ['blur']}
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
                _t.getData();
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
                _t.getData();
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
      // 获取节点显示数据 重新封装 by ssy
      getCheckedNodes() {
        this.dialogVisibleAlert = false;
        var listData = new Array(); // 总数据集合
        var allNodes = this.$refs.tree.getCheckedNodes(); // 选中的节点
        if (allNodes.length !== 0) {
          var headOffice = new Array(); // 全体总部人员集合
          var branchOffice = new Array(); // 全体分部人员集合
          // 判断是否 隶属总部 level 2总部 3分部
          for (var i = 0; i < allNodes.length; i++) {
            if (allNodes[i].level === 2 && allNodes[i].type === 'user') {
              headOffice.push(allNodes[i]);
            } else if (allNodes[i].level === 3 && allNodes[i].type === 'user') {
              branchOffice.push(allNodes[i]);
            }
          }
          // 总部
          for (var j = 0; j < this.selectUser.length; j++) {
            var obj = new Object();
            var headOfficeArr = new Array();
            for (var k = 0; k < headOffice.length; k++) {
              if (headOffice[k].parentId === this.selectUser[j].id) {
                // 拼接各总部直属人员数组
                headOfficeArr.push(headOffice[k]);
              }
            }
            obj.headName = this.selectUser[j].label;
            obj.headChildren = headOfficeArr;
            obj.branchName = null;
            obj.branchId = null;
            // 过滤总部下属人员为空的情况
            if (obj.headChildren.length !== 0) {
              listData.push(obj);
            }
          }
          // 分部
          // 查询原数组中所有的分部集合
          var branchNameArr = new Array();
          for (var m = 0; m < this.selectUser.length; m++) {
            if (this.selectUser[m].children.length !== 0) {
              for (var n = 0; n < this.selectUser[m].children.length; n++) {
                if (this.selectUser[m].children[n].type !== 'user') {
                  branchNameArr.push(this.selectUser[m].children[n]);
                }
              }
            }
          }
          // 拼接各总部下属各分部的数据
          for (var p = 0; p < branchNameArr.length; p++) {
            var objBranch = new Object();
            var branchOfficeArr = new Array();
            // 拼接各分部人员数据
            for (var q = 0; q < branchOffice.length; q++) {
              if (branchOffice[q].parentId === branchNameArr[p].id) {
                branchOfficeArr.push(branchOffice[q]);
              }
            }
            // 各分部 id
            objBranch.branchId = branchNameArr[p].id;
            // 各分部名称
            objBranch.branchName = branchNameArr[p].label;
            // 各分部人员集合
            objBranch.headChildren = branchOfficeArr;
            // 查找该条数据对应的 总部
            for (var x = 0; x < this.selectUser.length; x++) {
              if (branchNameArr[p].parentId === this.selectUser[x].id) {
                objBranch.headName = this.selectUser[x].label;
              }
            }
            // 过滤分部人员为空的情况
            if (branchOfficeArr.length !== 0) {
              listData.push(objBranch);
            }
          }
          this.listData = listData;
          this.result();
        }
      },
      // 删除标签
      handleClose(item) {
        for (var i = 0; i < this.listData.length; i++) {
          var headChildren = this.listData[i].headChildren;
          if (headChildren.length > 1) {
            // 删除本标签
            for (var j = 0; j < headChildren.length; j++) {
              if (item.id === headChildren[j].id) {
                headChildren.splice(j, 1);
                this.result();
                return false;
              }
            }
          } else {
            // 删除本标签之后删除该区域
            for (var k = 0; k < headChildren.length; k++) {
              if (item.id === headChildren[k].id) {
                headChildren.splice(k, 1);
                this.listData.splice(i, 1);
                this.result();
                return false;
              }
            }
          }
        }
      },
      // 剩余人员
      result() {
        // 所有展示的人员集合
        var allNode = new Array();
        for (var i = 0; i < this.listData.length; i++) {
          if (this.listData[i].headChildren.length !== 0) {
            for (var j = 0; j < this.listData[i].headChildren.length; j++) {
              allNode.push(this.listData[i].headChildren[j]);
            }
          }
        }
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
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            var menuNameArr = new Array();
            menuNameArr[0] = _t.addEdit.menuNameZh.trim() + '(中-简)';
            menuNameArr[1] = _t.addEdit.menuNameEn.trim() + '(英)';
            // menuNameArr[2] = _t.addEdit.menuNameTw.trim() + '(中-繁)';
            var selectRoleList = new Array();
            _t.selectUser.forEach(function (item) {
              selectRoleList.push(item.id);
            });
            _t.$api.post('system/menu/', {
              systemMenu: {
                parentId: _t.addEdit.parentId,
                menuName: menuNameArr.join(','),
                menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.trim(),
                menuLevel: _t.addEdit.menuLevel,
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
        _t.addEdit.id = _t.checkValueList.id;
        _t.addEdit.parentId = _t.checkValueList.parentId;
        _t.addEdit.menuNameZh = _t.checkValueList.menuName.split(',')[0];
        _t.addEdit.menuNameEn = _t.checkValueList.menuName.split(',')[1];
        _t.addEdit.menuHref = _t.checkValueList.menuHref;
        _t.addEdit.menuLevel = _t.checkValueList.menuLevel;
        _t.addEdit.menuIcon = _t.checkValueList.menuIcon;
      },
      // 编辑提交
      editData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            var menuNameArr = new Array();
            _t.addEdit.menuName.forEach(function (item, index) {
              menuNameArr.push(item + _t.addEdit.menuLanguage[index]);
            });
            var selectRoleList = new Array();
            _t.selectUser.forEach(function (item) {
              selectRoleList.push(item.id);
            });
            _t.$api.post('system/menu/', {
              systemMenu: {
                id: _t.checkListIds.join(','),
                parentId: _t.addEdit.parentId,
                menuName: menuNameArr.join(','),
                menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.trim(),
                menuLevel: _t.addEdit.menuLevel,
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
              _t.selectUser = JSON.parse(res.data.list).children;
              console.log(_t.selectUser)
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
