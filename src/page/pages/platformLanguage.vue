<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.platformLanguage')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20 borderBottom">
      <!--表单-->
      <el-form inline :model="formItem">
        <el-form-item :label="$t('platformLanguage.languageCode') + '：'">
          <el-input class="width200" v-model="formItem.languageCode"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.languageName') + '：'">
          <el-input class="width200" v-model="formItem.languageName"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.status') + '：'">
          <el-select v-model="formItem.status" class="width200">
            <el-option
              v-for="item in statusList"
              :value="item.value"
              :key="item.key"
              :label="item.label" />
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
        <el-button class="queryBtn" :disabled="disableBtn.edit" @click="deleteData">
          <i class="el-icon-delete"></i>
          {{$t('public.delete')}}
        </el-button>
        <el-button @click="setDefault" :disabled="disableBtn.edit">
          <i class="el-icon-delete"></i>
          {{$t('platformLanguage.setDefault')}}
        </el-button>
        <el-button @click="importFunction" :disabled="disableBtn.edit">
          <i class="el-icon-delete"></i>
          {{$t('platformLanguage.importFunction')}}
        </el-button>
        <el-button @click="importData" :disabled="disableBtn.edit">
          <i class="el-icon-delete"></i>
          {{$t('platformLanguage.importData')}}
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
        <el-table-column prop="languageCode" :label="$t('platformLanguage.languageCodes')" header-align="center"
                         align="center"/>
        <el-table-column prop="languageName" :label="$t('platformLanguage.languageName')" header-align="center"
                         align="center"/>
        <el-table-column :label="$t('platformLanguage.description')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.sort')" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="moveUp(scope.row)">上移</el-button>
            <el-button type="text" @click="moveDown(scope.row)">下移</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('platformLanguage.isDefault')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isDefault = true">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('platformLanguage.status')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enable === true">启用</span>
            <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('platformLanguage.createName')" header-align="center"
                         align="center"/>
        <el-table-column :label="$t('platformLanguage.createTime')" header-align="center" align="center">
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
        @handleCurrentChangeSub="handleCurrentChange" />
    </div>
    <!--新增/编辑-->
    <el-dialog
      append-to-body
      :title="$t('platformLanguage.createUpdateLanguage')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="150px" inline :model="addEdit" :rules="rules" ref="roleForm">
        <el-form-item :label="$t('platformLanguage.languageCodes') + '：'">
          <el-input class="width200" v-model="addEdit.languageCode"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.languageName') + '：'">
          <el-input class="width200" v-model="addEdit.languageName"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.translationName') + '：'">
          <el-input class="width200" v-model="addEdit.translationName"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.descriptionAlert') + '：'">
          <el-input class="width200" v-model="addEdit.description"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.Order') + '：'">
          <el-input class="width200" v-model="addEdit.orderIndex"/>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.isDefault') + '：'">
          <el-radio-group v-model="addEdit.isDefault">
            <el-radio :label="1">{{$t('public.YES')}}</el-radio>
            <el-radio :label="0">{{$t('public.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.isEnable') + '：'">
          <el-radio-group v-model="addEdit.isEnable">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="addData('roleForm')">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "platformLanguage",
    components:{Box},
    data() {
      return {
        // 查询表单
        formItem: {
          languageCode: null,
          languageName: null,
          status: null
        },
        addEdit: {
          id: '',
          languageCode: '',
          languageName: '',
          translationName: '',
          description: '',
          orderIndex: '',
          isDefault: '',
          isEnable: ''
        },
        // 按钮禁用启用
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
        // 状态列表
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
        status:'',
        dialogVisible:false,
        tableData: [],
        options:{
          total: 0, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
        },
        rules: {}
      }
    },
    methods: {
      // 新增语言
      addData(formName) {
        var _t = this;
        _t.dialogVisible = false;
        _t.$api.post('system/basedata/', {
          systemLanguage: {
            languageCode: _t.addEdit.languageCode == null ? null : _t.addEdit.languageCode.trim(),
            languageName: _t.addEdit.languageName == null ? null : _t.addEdit.languageName.trim(),
            isDefault: _t.addEdit.isDefault == 1 ? true : false,
            enable: _t.addEdit.isEnable == 1 ? true : false,
            languageIcon: 'icon',
            orderMark: 3
          }
        }, function (res) {
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
              break;
            default:
              break;
          }
        });
        console.log(_t.addEdit);
        // _t.$refs[formName].validate((valid) => {
        //   if (valid) {
        //
        //   }
        // });
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
            data.forEach(function (item) {
              if (item.enable === false) {
                _t.disableBtn.enable = false;
              } else if (item.enable === true) {
                _t.disableBtn.disable = false;
              }
            });
            break;
          default: // 多选
            _t.disableBtn.edit = true;
            _t.disableBtn.more = false;
            var disableFlag = 0, enableFlag = 0;
            for (var i = 0;i < data.length;i++){
              if (data[i].enable === false) {
                disableFlag++;
              } else if (data[i].enable === true) {
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
        console.log(val)
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
      // 设为默认
      setDefault(){
        this.$confirm('请问是否确认将当前的记录设为默认?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 导入功能菜单
      importFunction(){
        this.$confirm('请问是否确认下载选中记录的相应文件?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 导入数据字典菜单
      importData(){
        this.$confirm('请问是否确认下载选中记录的相应文件?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 获取表格数据
      getData() {
        var _t = this;
        _t.$store.commit('setLoading', true);
        _t.$api.get('system/language/pagelist', {
          jsonString: JSON.stringify({
            systemLanguage: {
              languageMark: localStorage.getItem('hy-language')
            },
            currentPage: _t.options.currentPage,
            pageSize: _t.options.pageSize
          })
        }, function (res) {
          _t.$store.commit('setLoading', false);
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
      // 上移
      moveUp(data) {
      },
      // 下移
      moveDown(data) {
      }
    },
    created() {
      this.$store.commit('setLoading', true);
      this.getData();
    }
  }
</script>

<style scoped>

</style>
