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
      <el-form inline>
        <el-form-item :label="$t('platformLanguage.languageCode') + '：'">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.languageName') + '：'">
          <el-input class="width200" />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.status') + '：'">
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
        <el-table-column :label="$t('platformLanguage.languageCodes')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.languageName')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.description')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.sort')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.isDefault')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.status')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0" class="disabledStatusColor">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('platformLanguage.createName')" header-align="center" align="center" />
        <el-table-column :label="$t('platformLanguage.createTime')" header-align="center" align="center" />
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
      <el-form label-width="150px">
        <el-form-item :label="$t('platformLanguage.languageCodes') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.languageName') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.translationName') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item>
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.descriptionAlert') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.Order') + '：'">
          <el-input />
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.isDefault') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.YES')}}</el-radio>
            <el-radio :label="1">{{$t('public.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('platformLanguage.isEnable') + '：'">
          <el-radio-group v-model="status">
            <el-radio :label="0">{{$t('public.enable')}}</el-radio>
            <el-radio :label="1">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
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
    name: "platformLanguage",
    components:{Box},
    data() {
      return {
        disableBtn:{
          edit:true,
          enable:true,
          disable:true,
          more:true
        },
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
        _t.$api.get('', {}, function (res) {
          switch (res.status) {
            case 200:
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
      this.getData();
    }
  }
</script>

<style scoped>

</style>
