<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.organizeMaintenance')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--左侧导航-->
    <div class="borderRightColorGray organizationMenuBox">
      <p class="organizeMaintenance-title">
        <a href="javascript:;" @click="clickNode(treeMenuData.nodeId)">
					{{treeMenuData.nodeName}}
				</a>
      </p>
      <el-tree
        class="organizeMaintenance-tree"
        :data="treeMenuData.children"
        @node-click="getCurrentNode"
        :props="defaultProps"
        highlight-current
        node-key="nodeId"
        ref="tree"/>
    </div>
    <!--内容区-->
    <div class="organizationMenu-formBox">
      <div class="padding20 borderBottom">
        <!--表单-->
        <el-form inline :model="formItem">
          <el-form-item :label="$t('organizeMaintenance.organizationName') +'：'">
            <el-input class="width200" v-model="formItem.organizationName" clearable/>
          </el-form-item>
          <el-form-item :label="$t('organizeMaintenance.createUpdateDate') +'：'">
            <el-date-picker
              v-model="formItem.dateTime"
              type="daterange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTime')"
              :end-placeholder="$t('public.endTime')"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
            <el-button type="reset" class="queryBtn" @click="resetData">{{$t('public.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="padding20">
        <!--全局操作-->
        <div class="marBottom16">
          <el-button type="warning" class="queryBtn" @click="addDataBtn">
						<span class="iconfont fs14">&#xe689;</span>
            {{$t('public.add')}}
          </el-button>
          <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editDataBtn">
						<span class="iconfont fs14">&#xe641;</span>
            {{$t('public.edit')}}
          </el-button>
          <el-button class="queryBtn" :disabled="disableBtn.enable" @click="enableData">
						<span class="iconfont fs14">&#xe645;</span>
            {{$t('public.enable')}}
          </el-button>
          <el-button class="queryBtn" :disabled="disableBtn.disable" @click="disableData">
						<span class="iconfont fs14">&#xe646;</span>
            {{$t('public.disable')}}
          </el-button>
          <el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
						<span class="iconfont fs14">&#xe647;</span>
            {{$t('public.delete')}}
          </el-button>
        </div>
        <!--表格-->
        <el-table :data="tableData" ref="table" border stripe @selection-change="selectTableNum">
          <el-table-column type="selection" fixed header-align="left" align="left"/>
          <el-table-column width="60px" fixed :label="$t('public.index')" header-align="left" align="left">
            <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('organizeMaintenance.organizationName')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.name" placement="left-start">
                <span>{{scope.row.name}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="roleCount" :label="$t('organizeMaintenance.roleNum')" header-align="left" align="left"/>
          <el-table-column prop="userCount" :label="$t('organizeMaintenance.userNum')" header-align="left" align="left"/>
          <el-table-column :label="$t('organizeMaintenance.sort')" header-align="left" align="left">
            <template slot-scope="scope">
              <el-button :disabled="scope.$index == 0" type="text" @click="moveUp(scope.row)">
								{{$t('public.moveUp')}}
							</el-button>
              <el-button :disabled="scope.$index == tableData.length - 1" type="text" @click="moveDown(scope.row)">
								{{$t('public.moveDown')}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('organizeMaintenance.status')" header-align="left" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.enable === true">{{$t('public.enable')}}</span>
              <span v-if="scope.row.enable === false" class="disabledStatusColor">{{$t('public.disable')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createByUser" :label="$t('organizeMaintenance.createName')" header-align="left"
                           align="left"/>
          <el-table-column width="160px" :label="$t('organizeMaintenance.createTime')" header-align="left" align="left">
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
    <!--新增、编辑-->
    <el-dialog
      class="organizeMaintenance-dialog"
      append-to-body
      :title="$t('organizeMaintenance.createUpdateOrganization')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" label-width="96px" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('organizeMaintenance.parentOrganization') + '：'">
          <el-popover
            trigger="click"
            placement="bottom-start"
            @show="disablePopover"
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
              :disabled="ifAdd == false" 
              readonly
              slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item class="star" :label="$t('organizeMaintenance.organizationName') + '：'" prop="organizationName">
          <el-input class="width200" v-model="addEdit.organizationName"/>
        </el-form-item>
        <el-form-item class="star" :label="$t('organizeMaintenance.isEnable') + '：'" prop="enable">
          <el-radio-group v-model="addEdit.enable">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.organizationDes') + '：'">
          <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="addEdit.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" class="alertBtn" v-if="ifAdd == true" @click="addData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="alertBtn" v-if="ifAdd == false" @click="editData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormData">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import {isNotNull} from "../../../../assets/js/validator";
  import {dateFilter} from "../../../../assets/js/filters";

  export default {
    name: "organize-maintenance",
    components: {Box},
    data() {
      return {
        // 筛选表单
        formItem: {
          dateTime: null,
          organizationName: null,
          organizationId: '0'
        },
        // 新增编辑表单
        addEdit: {
          id: '',
          organization: '',
          organizationId: '',
          organizationName: '',
          enable: 1,
          description: ''
        },
        isShowEditPopover: false, // 控制所属组织下拉框的显示隐藏
        // 操作按钮的禁用启用
        disableBtn: {
          edit: true,
          enable: true,
          disable: true,
          more: true
        },
        tableData: [], // 表格数据
        // 分页
        options: {
          total: 0, // 总条数
          currentPage: 1, // 当前页码
          pageSize: 10, // 每页显示条数
        },
        dialogVisible: false, // 新增编辑弹出层
        ifAdd: false,
        // 数据默认字段
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'nodeName',       // 标签显示
          children: 'children', // 子级
        },
        organizationList: [], // 所属组织集合
        treeMenuData: {}, // 左侧导航集合
        checkListIds: [], // 选中表格的数据id
        checkListValue: [], // 选中的表格集合
        // 表单校验规则
        rules: {
          organizationName: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          enable: [
            {validator: isNotNull, trigger: ['blur']}
          ],
          description: [
            {validator: isNotNull, trigger: ['blur']}
          ]
        }
      }
    },
    methods: {
    	// 编辑时禁用显示属性下拉框
			disablePopover(){
				var _t = this;
				if(_t.ifAdd === false){
					_t.isShowEditPopover = false;
				}
			},
      // 重置筛选表单
      resetData() {
        var _t = this;
        _t.formItem.dateTime = null;
        _t.formItem.organizationName = null;
        _t.getData();
      },
      // 重置表单
      resetFormData() {
        var _t = this;
        _t.addEdit.id = '';
//      _t.addEdit.organization = '';
//      _t.addEdit.organizationId = '';
        _t.addEdit.organizationName = '';
        _t.addEdit.enable = 1;
        _t.addEdit.description = '';
        _t.dialogVisible = false;
        _t.$refs.table.clearSelection();
        _t.$refs.ruleForm.resetFields(); //移除校验结果并重置字段值
//      _t.$refs.ruleForm.clearValidate(); //移除校验结果
      },
      // 选中所属组织节点
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.organization = val.nodeName;
        _t.addEdit.organizationId = val.nodeId;
        _t.isShowEditPopover = false;
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
              if (item.enable == false) {
                _t.disableBtn.enable = false;
              } else if (item.enable == true) {
                _t.disableBtn.disable = false;
              }
              // 获取选照id
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
              // 获取选中id
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
        // 选中的表格集合
        _t.checkListValue = data;
      },
      // 外层 改变当前页码
      handleCurrentChange(val) {
        var _t = this;
        _t.options.currentPage = val;
      },
      // 改变每页显示条数
      handleSizeChangeSub(val) {
        var _t = this;
        _t.options.pageSize = val;
        _t.getData();
      },
      // 启用
      enableData() {
        var _t = this;
        _t.$confirm(_t.$t('organizeMaintenance.confirmEnableTip'), _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          confirmButtonClass: 'alertBtn',
          cancelButtonClass: 'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/organization/enableOrganization', {
            systemOrganization: {
              id: _t.checkListIds.join(','),
              enable: true
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert(_t.$t('organizeMaintenance.confirmEnableSuccessTip'), _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getData();
                  _t.getTreeData();
									_t.$refs.table.clearSelection();
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
        _t.$confirm(_t.$t('organizeMaintenance.confirmDisableTip'), _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          confirmButtonClass: 'alertBtn',
          cancelButtonClass: 'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.put('system/organization/enableOrganization', {
            systemOrganization: {
              enable: false,
              id: _t.checkListIds.join(',')
            }
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert(_t.$t('organizeMaintenance.confirmDisableSuccessTip'), _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getData();
                  _t.getTreeData();
									_t.$refs.table.clearSelection();
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
        _t.$confirm(_t.$t('organizeMaintenance.confirmDeleteTip'), _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning',
          confirmButtonClass: 'alertBtn',
          cancelButtonClass: 'alertBtn'
        }).then(() => {
          _t.$store.commit('setLoading', true);
          _t.$api.delete('system/organization/', {
            jsonString: JSON.stringify({
              id: _t.checkListIds.join(',')
            })
          }, function (res) {
            _t.$store.commit('setLoading', false);
            switch (res.status) {
              case 200:
                _t.$alert(_t.$t('organizeMaintenance.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getData();
                  _t.getTreeData();
									_t.$refs.table.clearSelection();
                });
                break;
              case 1003: // 无操作权限
              case 1004: // 登录过期
              case 1005: // token过期
              case 1006: // token不通过
                _t.exclude(_t, res.message);
                break;
              case 2007: // 删除失败
              case 3005: // 数据关联不能删除
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm'),
                  confirmButtonClass: 'alertBtn'
                }).then(() => {
                  _t.getData();
                  _t.getTreeData();
									_t.$refs.table.clearSelection();
                });
                break;
              default:
                _t.getData();
                _t.getTreeData();
								_t.$refs.table.clearSelection();
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
      // 查询组织维护左侧导航数据
      getTreeData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('system/organization/all/', {
          jsonString: JSON.stringify({
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.treeMenuData = JSON.parse(res.data);
              if (_t.formItem.organizationId !== '0') {
                _t.$nextTick(function () {
                  _t.$refs.tree.setCurrentKey(_t.formItem.organizationId)
                });
              }
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
      // 点击导航节点
      getCurrentNode(val) {
        var _t = this;
        _t.formItem.organizationId = val.nodeId;
        _t.addEdit.organizationId = val.nodeId;
        _t.addEdit.organization = val.nodeName;
        _t.getData();
      },
      // 点击组织结构
      clickNode(val) {
        var _t = this;
        _t.formItem.organizationId = val;
        _t.addEdit.organizationId = val;
        _t.addEdit.organization = null;
        _t.getData();
      },
      // 根据组织id获取表格数据
      getData() {
        var _t = this;
        _t.$api.get('system/organization/pagelist', {
          jsonString: JSON.stringify({
            systemOrganization: {
              id: _t.formItem.organizationId == null ? null : _t.formItem.organizationId,
              name: _t.formItem.organizationName == null ? null : _t.formItem.organizationName.trim(),
              createTime: _t.formItem.dateTime == null ? null : dateFilter(_t.formItem.dateTime[0].getTime()),
              lastModifyTime: _t.formItem.dateTime == null ? null : dateFilter(_t.formItem.dateTime[1].getTime()),
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize
          })
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.tableData = res.data.list === null ? [] : res.data.list;
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
      // 查询所属组织
      getOrganization() {
        var _t = this;
        _t.$api.get('system/organization/all', {}, function (res) {
          switch (res.status) {
            case 200:
              _t.organizationList = JSON.parse(res.data).children === null ? [] : JSON.parse(res.data).children;
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
      // 添加组织按钮
      addDataBtn() {
        var _t = this;
        _t.dialogVisible = true;
        _t.ifAdd = true;
      },
      // 添加组织
      addData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.post('system/organization/', {
              systemOrganization: {
                parentId: _t.addEdit.organizationId == null ? null : (_t.addEdit.organizationId.trim() == '' ? null : _t.addEdit.organizationId.trim()),
                name: _t.addEdit.organizationName == null ? null : _t.addEdit.organizationName.trim(),
                enable: _t.addEdit.enable,
                createBy: localStorage.getItem('hy-user-name'),
                description: _t.addEdit.description == null ? null : _t.addEdit.description.trim()
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getData();
                  _t.getTreeData();
                  _t.resetFormData();
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
                  _t.resetFormData();
                  break;
              }
            });
          }
        });
      },
      // 编辑组织按钮
      editDataBtn() {
        var _t = this;
        // 新增编辑判断
        _t.ifAdd = false;
        _t.addEdit.id = _t.checkListValue[0].id;
        _t.getEditOrgData(_t.addEdit.id);
      },
      // 编辑时根据数据id查询编辑数据
      getEditOrgData(val) {
        var _t = this;
        _t.$api.get('system/organization/' + val, {}, function (res) {
          switch (res.status) {
            case 200:
              if (res.data.parentId !== null) {
                _t.addEdit.organization = organization(_t.organizationList, res.data.parentId);
              } else {
                _t.addEdit.organization = '';
              }
              _t.addEdit.organizationId = res.data.parentId;
              _t.addEdit.organizationName = res.data.name;
              _t.addEdit.enable = res.data.enable == true ? 1 : 0;
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

        // 递归查找组织名
        function organization(data, index) {
          var result, temp; //返回值和临时变量
          for (var i in data) {
            temp = data[i];
            if (temp['nodeName'] && temp['nodeId'] == index) {
              result = temp['nodeName'];
              break; //如果已经返回了就中止
            }
            //如果还没有找到则遍历menus参数下的数据
            if (typeof result == 'undefined' && temp['children']) {
              result = organization(temp['children'], index);
            }
          }
          return result;
        }
      },
      // 编辑组织
      editData(formName) {
        var _t = this;
        _t.$refs[formName].validate((valid) => {
          if (valid) {
            _t.$api.put('system/organization/', {
              systemOrganization: {
                id: _t.addEdit.id,
                parentId: _t.addEdit.organizationId == null ? null : (_t.addEdit.organizationId.trim() == '' ? null : _t.addEdit.organizationId.trim()),
                name: _t.addEdit.organizationName == null ? null : _t.addEdit.organizationName.trim(),
                enable: _t.addEdit.enable,
                lastModifyBy: localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language'),
                description: _t.addEdit.description == null ? null : _t.addEdit.description.trim()
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getData();
                  _t.getTreeData();
                  _t.resetFormData();
                  break;
                case 1003: // 无操作权限
                case 1004: // 登录过期
                case 1005: // token过期
                case 1006: // token不通过
                  _t.exclude(_t, res.message);
                  break;
                default:
                  _t.resetFormData();
                  break;
              }
            });
          }
        });
      },
      // 上移
      moveUp(data) {
        var _t = this;
        var dataIdArr = new Array();
        dataIdArr.push(data.id);
        _t.tableData.forEach(function (item, index) {
          if (item.id == data.id) {
            dataIdArr.push(_t.tableData[index - 1].id)
          }
        });
        _t.$api.put('system/organization/enableOrganization', {
          systemOrganization: {
            id: dataIdArr.join(',')
          },
          upOrDown: "up"
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.getData();
              _t.getTreeData();
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
      // 下移
      moveDown(data) {
        var _t = this;
        var dataIdArr = new Array();
        dataIdArr.push(data.id);
        _t.tableData.forEach(function (item, index) {
          if (item.id == data.id) {
            dataIdArr.push(_t.tableData[index + 1].id)
          }
        });
        _t.$api.put('system/organization/enableOrganization', {
          systemOrganization: {
            id: dataIdArr.join(',')
          },
          upOrDown: "down"
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.getData();
              _t.getTreeData();
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
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getTreeData();
      this.getData();
      this.getOrganization();
    }
  }
</script>

<style scoped>
  .organizeMaintenance-title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    padding-left: 20px;
    width: 176px;
    cursor: pointer;
  }

  .organizeMaintenance-title a {
    line-height: 40px;
    display: inline-block;
  }

  .organizationMenuBox {
    position: absolute;
    top: 50px;
    left: 0;
    bottom: 0;
    width: 176px;
    overflow: auto;
  }

  .organizationMenu-formBox {
    position: absolute;
    top: 50px;
    left: 176px;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
<style>
  .organizeMaintenance-dialog .el-dialog {
    width: 600px;
    height: 430px;
  }
</style>
