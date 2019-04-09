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
    <el-row>
      <el-col :span="4">
        <p>
          <a href="javascript:;" @click="clickNode(treeMenuData.nodeId)">{{treeMenuData.nodeName}}</a>
        </p>
        <el-tree
          :data="treeMenuData.children"
          @node-click="getCurrentNode"
          :props="defaultProps"
          highlight-current
          :expand-on-click-node="false"
          :default-expand-all="true"/>
      </el-col>
      <el-col :span="20">
        <div class="padding20 borderBottom">
          <!--表单-->
          <el-form inline :model="formItem">
            <el-form-item :label="$t('organizeMaintenance.organizationName') +'：'">
              <el-input class="width200" v-model="formItem.organizationName"/>
            </el-form-item>
            <el-form-item :label="$t('organizeMaintenance.createUpdateDate') +'：'">
              <el-date-picker
                v-model="formItem.dateTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
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
            <el-table-column fixed :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('organizeMaintenance.organizationName')" header-align="center"
                             align="center"/>
            <el-table-column prop="roleCount" :label="$t('organizeMaintenance.roleNum')" header-align="center"
                             align="center"/>
            <el-table-column prop="userCount" :label="$t('organizeMaintenance.userNum')" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('organizeMaintenance.status')" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enable === true">启用</span>
                <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" :label="$t('organizeMaintenance.createName')" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('organizeMaintenance.createTime')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | dateFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastModifyBy" :label="$t('organizeMaintenance.updateName')" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('organizeMaintenance.updateTime')" header-align="center" align="center">
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
            @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
    <!--新增、编辑-->
    <el-dialog
      append-to-body
      :title="$t('organizeMaintenance.createUpdateOrganization')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="addEdit" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('organizeMaintenance.parentOrganization') + '：'">
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
        <el-form-item :label="$t('organizeMaintenance.organizationName') + '：'" prop="organizationName">
          <el-input class="width200" v-model="addEdit.organizationName"/>
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.orderIndex') + '：'" prop="orderIndex">
          <el-input class="width200" v-model="addEdit.orderIndex"/>
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.isEnable') + '：'" prop="enable">
          <el-radio-group v-model="addEdit.enable">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('organizeMaintenance.organizationDes') + '：'" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="addEdit.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" class="queryBtn" v-if="ifAdd == true" @click="addData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="queryBtn" v-if="ifAdd == false" @click="editData('ruleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import {isNotNull} from "../../assets/js/validator";
  import {dateFilter} from "../../assets/js/filters";
  export default {
    name: "organize-maintenance",
    components: {Box},
    data(){
      return {
        // 筛选表单
        formItem: {
          dateTime: null,
          organizationName: null,
          organizationId: null
        },
        // 新增编辑表单
        addEdit: {
          id: '',
          organization: '',
          organizationId: '',
          organizationName: '',
          enable: '',
          description: '',
          orderIndex: ''
        },
        isShowEditPopover: false, // 控制所属组织下拉框的显示隐藏
        // 操作按钮的禁用启用
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        tableData: [], // 表格数据
        // 分页
        options:{
          total: 0, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
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
          orderIndex: [
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
    methods:{
      // 选中所属组织节点
      clickNodeAlert(val) {
        var _t = this;
        _t.addEdit.organization = val.nodeName;
        _t.addEdit.organizationId = val.nodeId;
        _t.isShowEditPopover = false;
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
            for (var i = 0;i < data.length;i++){
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
      handleCurrentChange(val){
        var _t = this;
        _t.options.currentPage = val;
      },
      // 启用
      enableData(){
        var _t = this;
        _t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{
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
        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        var _t = this;
        _t.$confirm('请问是否确认禁用当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{
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
        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        var _t = this;
        _t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
          confirmButtonText: _t.$t('public.confirm'),
          cancelButtonText: _t.$t('public.close'),
          type: 'warning'
        }).then(()=>{
          _t.$store.commit('setLoading', true);
          _t.$api.delete('system/organization/', {
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
                _t.getTreeData();
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
                _t.getTreeData();
                break;
              case 3005: // 数据关联不能删除
                _t.$alert(res.message, _t.$t('public.resultTip'), {
                  confirmButtonText: _t.$t('public.confirm')
                });
                _t.getTreeData();
                break;
              default:
                _t.getTreeData();
                break;
            }
            _t.disableBtn.edit = true;
            _t.disableBtn.enable = true;
            _t.disableBtn.disable = true;
            _t.disableBtn.more = true;
          });
        }).catch(()=>{
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
              // 获取树形列表第一层id值
              _t.formItem.organizationId = _t.treeMenuData.nodeId;
              // 查询表格数据
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
      // 点击导航节点
      getCurrentNode(val) {
        var _t = this;
        _t.formItem.organizationId = val.nodeId;
        _t.getData();
      },
      // 点击组织结构
      clickNode(val) {
        var _t = this;
        _t.formItem.organizationId = _t.treeMenuData.nodeId;
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
                parentId: _t.addEdit.organizationId,
                name: _t.addEdit.organizationName == null ? null : _t.addEdit.organizationName.trim(),
                enable: _t.addEdit.enable,
                createBy: localStorage.getItem('hy-user-name'),
                orderMark: _t.addEdit.orderIndex == null ? null : _t.addEdit.orderIndex.trim(),
                description: _t.addEdit.description == null ? null : _t.addEdit.description.trim()
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
                  _t.getTreeData();
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
      // 编辑组织按钮
      editDataBtn() {
        var _t = this;
        _t.dialogVisible = true;
        _t.ifAdd = false;
        _t.addEdit.id = _t.checkListValue[0].id;
        _t.addEdit.organization = organization(_t.organizationList, _t.checkListValue[0].parentId);
        _t.addEdit.organizationId = _t.checkListValue[0].parentId;
        _t.addEdit.organizationName = _t.checkListValue[0].name;
        _t.addEdit.orderIndex = _t.checkListValue[0].orderMark;
        _t.addEdit.enable = _t.checkListValue[0].enable == true ? 1 : 0;
        _t.addEdit.description = _t.checkListValue[0].description;

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
                parentId: _t.addEdit.organizationId,
                name: _t.addEdit.organizationName == null ? null : _t.addEdit.organizationName.trim(),
                enable: _t.addEdit.enable,
                lastModifyBy: localStorage.getItem('hy-user-name'),
                languageMark: localStorage.getItem('hy-language'),
                orderMark: _t.addEdit.orderIndex == null ? null : _t.addEdit.orderIndex.toString().trim(),
                description: _t.addEdit.description == null ? null : _t.addEdit.description.trim()
              }
            }, function (res) {
              _t.dialogVisible = false;
              switch (res.status) {
                case 200:
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
        });
      }
    },
    created(){
      this.$store.commit('setLoading', true);
      this.getTreeData();
      this.getOrganization();
    }
  }
</script>

<style scoped>

</style>
