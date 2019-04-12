<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataDictionary')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col :span="4">
        <p class="dataDictionary-title">
          <a href="javascript:;" @click="clickNode">{{formItem.menuName}}</a>
        </p>
        <el-tree
          :data="treeData"
          @node-click="getCurrentNode"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expand-all="false"/>
      </el-col>
      <el-col :span="20">
        <div class="padding20 borderBottom">
          <!--表单-->
          <el-form :model="formItem" inline>
            <el-form-item :label="$t('dataDictionary.businessCode') + '：'">
              <el-input class="width200" v-model="formItem.businessCode"/>
            </el-form-item>
            <el-form-item :label="$t('dataDictionary.dictionaryName') + '：'">
              <el-input class="width200" v-model="formItem.dictionaryName"/>
            </el-form-item>
            <el-form-item :label="$t('dataDictionary.status') + '：'">
              <el-select v-model="formItem.status" class="width200" clearable>
                <el-option v-for="item in statusList" :value="item.value" :key="item.key" :label="item.label"/>
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
              <i class="el-icon-circle-plus-outline"></i> {{$t('public.add')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editDataBtn">
              <i class="el-icon-edit-outline"></i> {{$t('public.edit')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.enable" @click="enableData">
              <i class="el-icon-circle-check-outline"></i> {{$t('public.enable')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.disable" @click="disableData">
              <i class="el-icon-circle-close-outline"></i> {{$t('public.disable')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
              <i class="el-icon-delete"></i> {{$t('public.delete')}}
            </el-button>
          </div>
          <!--表格-->
          <el-table :data="tableData" ref="table" stripe @selection-change="selectTableNum">
            <el-table-column type="selection" fixed header-align="center" align="center"/>
            <el-table-column :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
								<span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="dictionaryType" :label="$t('dataDictionary.dictionaryType')" width="150"
                             header-align="center" align="center"/>
            <el-table-column prop="basedataName" :label="$t('dataDictionary.dictionaryName')" width="150"
                             header-align="center" align="center"/>
            <el-table-column prop="dictionaryCode" :label="$t('dataDictionary.businessCode')" width="150"
                             header-align="center" align="center"/>
            <el-table-column prop="level" :label="$t('dataDictionary.directoryLevel')" width="150" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('dataDictionary.sort')" width="150" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="moveUp(scope.row)">上移</el-button>
                <el-button type="text" @click="moveDown(scope.row)">下移</el-button>
              </template>
            </el-table-column>
            <el-table-column :label="$t('dataDictionary.status')" width="150" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enable === true">启用</span>
                <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" :label="$t('dataDictionary.createName')" width="150" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('dataDictionary.createTime')" width="155" header-align="center" align="center">
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
      </el-col>
    </el-row>
    <!--新增编辑-->
    <el-dialog
      append-to-body
      :title="$t('dataDictionary.createUpdateDictionary')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form class="dataDictionary-dialog-form" :model="addEdit" inline label-width="150px" :rules="rules" ref="roleName">
        <el-form-item :label="$t('dataDictionary.parentDictionary') + '：'">
          <el-popover trigger="click" placement="bottom-start" v-model="isShowEditPopover" ref="popover">
            <el-tree
              :data="treeData"
              highlight-current
              :expand-on-click-node="false"
              @node-click="clickNodeAlert"
              :props="defaultProps"/>
            <el-input
              v-model="addEdit.nodeName"
              style="width: 200px;"
              suffix-icon="el-icon-arrow-down"
              readonly
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.dictionaryType') + '：'" prop="dictionaryType">
          <el-input v-model="addEdit.dictionaryType" class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.businessCode') + '：'" prop="dictionaryCode">
          <el-input v-model="addEdit.dictionaryCode" class="width200"/>
        </el-form-item>
        <br>
        <el-form-item
          v-for="(item,index) in systemBaseDataLanguageList"
          :key="index"
          :label="index == 0 ? $t('dataDictionary.dictionaryName') + '：':' '">
          <div style="position: relative;">
            <el-input
              :id="item.id"
              @input="menuNameInput(item)"
              v-model="item.basedataName"
              class="width200"
              :placeholder="item.languageName" />
            <span
              class="isNotNull"
              v-if="item.flag == true && item.basedataName.trim() == ''">
              {{$t('public.isNotNull')}}
            </span>
          </div>
        </el-form-item>
        <br>
        <el-form-item :label="$t('dataDictionary.directoryLevel') + '：'" prop="level">
          <el-input v-model="addEdit.level" readonly class="width200"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.orderIndex') + '：'" prop="orderMark">
          <el-input v-model="addEdit.orderMark" class="width200" />
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.statusAlert') + '：'" prop="enable">
          <el-radio-group v-model="addEdit.enable" class="width200">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" class="queryBtn" v-if="ifAdd == true" @click="addData('roleName')" >{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="queryBtn" v-if="ifAdd == false" @click="editData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {isNotNull} from "../../assets/js/validator";
  import {orgBreadcrumb} from "../../assets/js/recursive";

  export default {
    name: "dataDictionary",
    components: {Box},
    data() {
      return {
        // 查询表单
        formItem: {
          nodeId: '0',
          businessCode: null,
          dictionaryName: null,
          status: null,
          menuName: '', // 虚拟的一级菜单
        },
        // 数据默认字段
        defaultProps: {
          parentId: 'parentId', // 父级唯一标识
          value: 'id', // 唯一标识
          label: 'nodeName', // 标签显示
          children: 'children', // 子级
        },
        // 新增 编辑表单
        addEdit: {
          parentId: null, //父级Id
          id: '', //字典项ID
          level: 0, //目录级别
          dictionaryCode: '', //字典项编码
          dictionaryType: '', //字典项类型
          orderMark: '', //顺序
          enable: 1, //状态
        },
        // 全局按钮禁用启用
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        dialogVisible: false, // 新增编辑弹出层
        isShowEditPopover: false, // 控制父级组织弹出层的显示隐藏
        ifAdd: true, // 新增编辑判断
        statusList: [
          {label: '启用', value: 1},
          {label: '禁用', value: 0},
        ],
        treeData: [], // 左侧导航数据
        tableData: [], // 表格数据
        checkListValue: [], // 表格选中之后数据接收
        checkListIds: [], // 表格选中的数据id集合
        checkRoleIds: [], // 删除数据传参
        systemBaseDataLanguageList:[], // 字典名称集合
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        rules:{
          dictionaryType:[
            {validator: isNotNull, trigger: ['blur']}
          ],
          dictionaryCode:[
            {validator: isNotNull, trigger: ['blur']}
          ],
          level:[
            {validator: isNotNull, trigger: ['blur']}
          ],
          orderMark:[
            {validator: isNotNull, trigger: ['blur']}
          ],
          enable:[
            {validator: isNotNull, trigger: ['blur']}
          ]
        }
      }
    },
    methods: {
      // 输入框字典名称校验
      menuNameInput(data){
        if (data.basedataName.trim() == '') {
          data.flag = true;
          document.getElementById(data.id).style.borderColor = '#F56C6C';
        } else {
          data.flag = false;
          document.getElementById(data.id).style.borderColor = '#DCDFE6';
        }
      },
      // 重置表单
      resetFormData(){
        var _t = this;
        _t.ifAdd = true;
        _t.dialogVisible = false;
        _t.addEdit.parentId = null;
        _t.addEdit.id = '';
        _t.addEdit.level = 0;
        _t.addEdit.dictionaryCode = '';
        _t.addEdit.dictionaryType = '';
        _t.addEdit.orderMark = '';
        _t.addEdit.enable = 1;
        _t.$refs.table.clearSelection();
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
              // 启用禁用判断
              if (item.enable === false) {
                _t.disableBtn.enable = false;
              } else if (item.enable === true) {
                _t.disableBtn.disable = false;
              }
              // 选中行的id集合
              checkListIds.push(item.id);
            });
            _t.checkListIds = checkListIds;
            break;
          default: // 多选
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
              // 选中条数id集合
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
      // 启用
      enableData() {
        var _t = this;
        _t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          confirmButtonClass:'queryBtn',
          cancelButtonClass:'queryBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/basedata/', {
            systemBasedata: {
              id: _t.checkListIds.join(','),
              enable: "true"
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录启用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'queryBtn'
                });
                _t.getData();
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
          })
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
          confirmButtonClass:'queryBtn',
          cancelButtonClass:'queryBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/basedata/', {
            systemBasedata: {
              id: _t.checkListIds.join(','),
              enable: false
            }
          }, function (res) {
            switch (res.status) {
              case 200:
                _t.$alert('恭喜你,当前记录禁用成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'queryBtn'
                }).then(()=>{
                  _t.getData();
                  _t.getMenuData();
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
          confirmButtonClass:'queryBtn',
          cancelButtonClass:'queryBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.delete('system/basedata/', {
            jsonString: JSON.stringify({
              basedataIds: _t.checkListIds
            })
          },function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert('删除成功!', _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'queryBtn'
                }).then(()=>{
                  _t.getData();
                  _t.getMenuData();
                });
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              case 400: // 删除失败
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass:'queryBtn'
                });
                break;
              default:
                break;
            }
          })
        }).catch(() => {
          return;
        });
      },
      // 获取选中的节点
      getCurrentNode(data) {
        var _t = this;
        _t.formItem.nodeId = data.nodeId;
        _t.addEdit.level = data.level;
        _t.getData();
      },
      // 点击系统功能菜单节点
      clickNode() {
        var _t = this;
        _t.formItem.nodeId = '0';
        _t.addEdit.level = 0;
        _t.getData();
      },
      // 获取左侧树状菜单数据
      getMenuData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('system/basedata/all', {
          jsonString: JSON.stringify({
            systemBasedata: {
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200:
              // 渲染树节点
              _t.treeData = res.data.treeNode.children;
              // 渲染虚拟节点
              _t.formItem.nodeId = res.data.treeNode.nodeId;
              _t.formItem.menuName = res.data.treeNode.nodeName;
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
      // 新增编辑弹出层所属字典下拉框
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.parentId = val.nodeId;
        _t.addEdit.nodeName = val.nodeName;
        _t.addEdit.level = val.level + 1;
        _t.isShowEditPopover = false;
      },
      // 新增按钮
      addDataBtn() {
        var _t = this;
        _t.ifAdd = true;
        _t.dialogVisible = true;
        _t.addEdit.level += 1;
        _t.getLanguageList();
      },
      //新增表格数据
      addData(formName) {
        var _t = this;
        // 字典名称有为空的情况
        var isNullNum = 0;
        _t.systemBaseDataLanguageList.forEach(function (item) {
          if (item.basedataName.trim() === '') {
            item.flag = true;
            document.getElementById(item.id).style.borderColor = '#F56C6C';
          } else {
            isNullNum += 1;
          }
        });
        _t.$refs[formName].validate((valid) => {
          if (valid && isNullNum === _t.systemBaseDataLanguageList.length) {
            _t.$api.post('system/basedata/', {
              systemBasedata: {
                parentId: _t.addEdit.parentId == null ? null : _t.addEdit.parentId,
                dictionaryCode: _t.addEdit.dictionaryCode == null ? null : _t.addEdit.dictionaryCode.trim(),
                dictionaryType: _t.addEdit.dictionaryType == null ? null : _t.addEdit.dictionaryType.trim(),
                orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.trim(),
                level: _t.addEdit.level,
                enable: _t.addEdit.enable == 1 ? true : false,
                systemBasedataLanguageList: _t.systemBaseDataLanguageList
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getMenuData();
                  _t.getData();
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
          }
        });
      },
      // 获取表格数据
      getData() {
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('system/basedata/pagelist', {
          jsonString: JSON.stringify({
            systemBasedata: {
              parentId: _t.formItem.nodeId,
              basedataName: _t.formItem.dictionaryName == null ? null : (_t.formItem.dictionaryName.trim() == '' ? null : _t.formItem.dictionaryName.trim()),
              dictionaryCode: _t.formItem.businessCode == null ? null : (_t.formItem.businessCode.trim() == '' ? null : _t.formItem.businessCode.trim()),
              enable: _t.formItem.status == null ? null : (_t.formItem.status == 1 ? true : false),
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize
          })
        }, function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.tableData = res.data.list;
              _t.options.total = res.data.count;
              _t.options.currentPage = res.data.currentPage;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.tableData = [];
              _t.options.tolal = 0;
              _t.options.currentPage = 1;
              break;
          }
        });
      },
      //点击编辑按钮查询接口
      editDataBtn() {
        var _t = this;
        _t.ifAdd = false;
        _t.dialogVisible = true;
        _t.addEdit.id = _t.checkListIds.join(',');
        _t.getEditData(_t.addEdit.id);
      },
      // 根据选中的表格的数据id 查询最新的数据
      getEditData(val){
        var _t = this;
        _t.$api.get('system/basedata/' + val, {}, function (res) {
          switch (res.status) {
            case 200:
              _t.addEdit.id = res.data.id;
              _t.addEdit.parentId = res.data.parentId;
              _t.addEdit.dictionaryCode = res.data.dictionaryCode;
              _t.addEdit.dictionaryType = res.data.dictionaryType;
              _t.addEdit.orderMark = res.data.orderMark;
              _t.addEdit.level = res.data.level;
              _t.addEdit.enable == 1 ? true : false;
              _t.systemBaseDataLanguageList = res.data.systemBasedataLanguageList;
              _t.addEdit.nodeName = orgBreadcrumb(_t.treeData,res.data.parentId == null ? '0' : res.data.parentId)[0];
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
        // 字典名称有为空的情况
        var isNullNum = 0;
        _t.systemBaseDataLanguageList.forEach(function (item) {
          if (item.basedataName.trim() == '') {
            item.flag = true;
            document.getElementById(item.id).style.borderColor = '#F56C6C';
          } else {
            isNullNum += 1;
          }
        });
        _t.$refs[formName].validate((valid) => {
          if (valid && isNullNum == _t.systemBaseDataLanguageList.length) {
            _t.$api.put('system/basedata/', {
              systemBasedata: {
                id: _t.addEdit.id,
                parentId: _t.addEdit.parentId,
                dictionaryCode: _t.addEdit.dictionaryCode,
                dictionaryType: _t.addEdit.dictionaryType,
                orderMark: _t.addEdit.orderMark,
                level: _t.addEdit.level,
                enable: _t.addEdit.enable == 1 ? true : false,
                systemBasedataLanguageList: _t.systemBaseDataLanguageList
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getMenuData();
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
                    confirmButtonClass:'queryBtn'
                  }).then(()=>{
                    _t.getData();
                    _t.getMenuData();
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
      // 获取当前系统支持的语言 动态渲染字典名称
      getLanguageList(){
        var _t = this;
        _t.$api.get('system/language/all', {}, function (res) {
          switch (res.status) {
            case 200:
              var systemBaseDataLanguageList = res.data.list;
              systemBaseDataLanguageList.forEach(function (item) {
                item.basedataName = '';
                item.languageMark = item.languageCode;
                item.flag = false;
              });
              _t.systemBaseDataLanguageList = systemBaseDataLanguageList;
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
      // 上移
      moveUp() {},
      // 下移
      moveDown() {},
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getMenuData();
      this.getData();
    }
  }</script>

<style scoped>
  .dataDictionary-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }

  .dataDictionary-title a {
    line-height: 35px;
    display: inline-block;
  }
</style>
<style>
  .dataDictionary-dialog-form .el-form-item {
    margin-bottom: 20px;
    margin-right: 0;
  }
</style>
