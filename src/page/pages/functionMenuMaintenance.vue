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
          <a href="javascript:;"
             @click="tableData = treeData">{{$t('functionMenuMaintenance.systemDataDictionary')}}</a>
        </p>
        <el-tree
          style="width: 200px;"
          :data="treeData"
          :props="defaultProps"
          @node-click="getCurrentNode"
          :expand-on-click-node="false"
          :default-expand-all="false"/>
      </el-col>
      <el-col :span="20">
        <div class="padding20 borderBottom">
          <!--表单-->
          <el-form inline>
            <el-form-item :label="$t('functionMenuMaintenance.businessCode') + '：'">
              <el-input class="width200" />
            </el-form-item>
            <el-form-item :label="$t('functionMenuMaintenance.dictionaryName') + '：'">
              <el-input class="width200" />
            </el-form-item>
            <el-form-item :label="$t('functionMenuMaintenance.status') + '：'">
              <el-select v-model="status" class="width200">
                <el-option
                  v-for="item in statusList"
                  :value="item.value"
                  :key="item.key"
                  :label="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="queryBtn">{{$t('public.query')}}</el-button>
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
            <el-button class="queryBtn" :disabled="disableBtn.edit" @click="dialogVisible = true">
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
            <el-table-column type="selection" fixed header-align="center" align="center" />
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
            <el-table-column :label="$t('functionMenuMaintenance.jumpType')" header-align="center" align="center" />
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
                <span v-if="scope.row.status === 1">启用</span>
                <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
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
            @handleCurrentChangeSub="handleCurrentChange" />
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
      <el-form label-width="150px">
        <el-form-item :label="$t('functionMenuMaintenance.menuName') + '：'">
          <el-input />
          <el-input />
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.menuIcon') + '：'">
          <el-upload
          action="">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.menuUrl') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.jumpType') + '：'">
          <el-radio-group>
            <el-radio :label="0">framename</el-radio>
            <el-radio :label="1">_blank</el-radio>
            <el-radio :label="2">_self</el-radio>
            <el-radio :label="3">_parent</el-radio>
            <el-radio :label="4">_top</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.roleMenu') + '：'">
          <el-button class="queryBtn" type="primary" @click="dialogVisibleAlert = true">{{$t('functionMenuMaintenance.selectUser')}}</el-button>
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
        <el-form-item :label="$t('functionMenuMaintenance.directoryLevel') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.orderIndex') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('functionMenuMaintenance.statusAlert') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
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
          show-checkbox
          ref="tree">
         <span slot-scope="{ node, data }">
           <i v-if="data.type !== 'user'" class="el-icon-document"></i>{{ node.label }}
        </span>
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getCheckedNodes" size="small">{{$t('public.confirm')}}</el-button>
          <el-button @click="dialogVisibleAlert = false" size="small">{{$t('public.cancel')}}</el-button>
        </span>
      </el-dialog>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>

  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "functionMenuMaintenance",
    components:{Box},
    data() {
      return {
        disableBtn: { // 全局按钮启用禁用判断
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        dialogVisible: false, // 新增编辑弹出层
        dialogVisibleAlert: false, // 选择用户弹出层
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
        status:'',
        organization:'',
        listData:[],
        selectUser: [], // 选中的用户
        treeData: [], // 左侧导航列表
        tableData: [], //
        options:{
          total: 0, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
        },
        defaultProps: {
          label: 'menuName',
          children: 'systemMenuAndLanguageRelationChildList'
        }
      }
    },
    methods: {
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
            for (var i = 0;i < data.length;i++){
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
      },
      // 改变当前页码
      handleCurrentChange(val){
        this.options.currentPage = val;
      },
      // 启用
      enableData() {
        this.$confirm('请问是否确认启用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        this.$confirm('请问是否确认禁用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        this.$confirm('请问是否确认删除当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 获取节点显示数据
      getCheckedNodes() {
        this.dialogVisibleAlert = false;
        var listData = new Array(); // 总数据集合
        var allNodes = this.$refs.tree.getCheckedNodes(); // 选中的节点
        if (allNodes.length !== 0) {
          var headOffice = new Array(); // 全体总部人员集合
          var branchOffice = new Array(); // 全体分部人员集合
          // 判断是否 隶属总部 level 2总部 3分部
          for (var i = 0;i < allNodes.length;i++){
            if (allNodes[i].level === 2 && allNodes[i].type === 'user') {
              headOffice.push(allNodes[i]);
            } else if (allNodes[i].level === 3 && allNodes[i].type === 'user'){
              branchOffice.push(allNodes[i]);
            }
          }
          // 总部
          for (var j = 0;j < this.selectUser.length;j++){
            var obj = new Object();
            var headOfficeArr = new Array();
            for (var k = 0;k < headOffice.length;k++){
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
          for (var m = 0;m < this.selectUser.length;m++){
            if (this.selectUser[m].children.length !== 0) {
              for (var n = 0;n < this.selectUser[m].children.length;n++){
                if (this.selectUser[m].children[n].type !== 'user') {
                  branchNameArr.push(this.selectUser[m].children[n]);
                }
              }
            }
          }
          // 拼接各总部下属各分部的数据
          for (var p = 0;p < branchNameArr.length;p++){
            var objBranch = new Object();
            var branchOfficeArr = new Array();
            // 拼接各分部人员数据
            for (var q = 0;q < branchOffice.length;q++){
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
            for (var x = 0;x < this.selectUser.length;x++){
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
      handleClose(item){
        for (var i = 0;i < this.listData.length;i++){
          var headChildren = this.listData[i].headChildren;
          if (headChildren.length > 1) {
            // 删除本标签
            for (var j = 0;j < headChildren.length;j++){
              if (item.id === headChildren[j].id) {
                headChildren.splice(j,1);
                this.result();
                return false;
              }
            }
          } else {
            // 删除本标签之后删除该区域
            for (var k = 0;k < headChildren.length;k++){
              if (item.id === headChildren[k].id) {
                headChildren.splice(k,1);
                this.listData.splice(i,1);
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
        for (var i = 0;i < this.listData.length;i++){
          if (this.listData[i].headChildren.length !== 0){
            for (var j = 0;j < this.listData[i].headChildren.length;j++){
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
              var navBarArr = res.data.rootMenu;
              if (navBarArr) {
                navBarArr.forEach(function (item) {
                  if (item.systemMenuAndLanguageRelationChildList.length === 0) {
                    item.systemMenuAndLanguageRelationChildList = null;
                  }
                });
                _t.treeData = navBarArr;
              }
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
        _t.tableData = data.systemMenuAndLanguageRelationChildList;
      },
      // 根据选中菜单id 重新获取子菜单
      getData() {
        var _t = this;
        _t.$api.get('system/menu/', {
          jsonString: JSON.stringify({
            menuId: '',
            menuLevel: '1_2_3_4',
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
          switch (res.status) {
            case 200: // 查询成功
              _t.tableData = res.data.rootMenu;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.tableData = [];
              break;
          }
        });
      },
      // 表格数据上移
      moveUp(data) {

      },
      // 表格数据下移
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
