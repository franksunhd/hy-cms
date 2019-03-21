<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.platformLanguage')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item :label="$t('platformLanguage.languageCode') + '：'">
        <el-input />
      </el-form-item>
      <el-form-item :label="$t('platformLanguage.languageName') + '：'">
        <el-input />
      </el-form-item>
      <el-form-item :label="$t('platformLanguage.status') + '：'">
        <el-select v-model="status">
          <el-option
            v-for="item in statusList"
            :value="item.value"
            :key="item.key"
            :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">{{$t('public.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button @click="dialogVisible = true">{{$t('public.add')}}</el-button>
      <el-button @click="enableData">{{$t('public.enable')}}</el-button>
      <el-button @click="disableData">{{$t('public.disable')}}</el-button>
      <el-button @click="deleteData">{{$t('public.delete')}}</el-button>
      <el-button @click="setDefault">{{$t('platformLanguage.setDefault')}}</el-button>
      <el-button @click="importFunction">{{$t('platformLanguage.importFunction')}}</el-button>
      <el-button @click="importData">{{$t('platformLanguage.importData')}}</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column :label="$t('public.index')" width="60" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.languageCodes')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.languageName')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.description')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.sort')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.isDefault')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.status')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.createName')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('platformLanguage.createTime')" width="150" header-align="center" align="center" />
      <el-table-column :label="$t('public.operation')" width="120" header-align="center" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogVisible = true">{{$t('public.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pages
      :total='options.total'
      :currentPage='options.currentPage'
      :pageSize='options.pageSize'
      :firstPage='options.firstPage'
      :lastPage='options.lastPage'
      @handleCurrentChangeSub="handleCurrentChange" />
    <!--新增/编辑-->
    <el-dialog
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
        statusList:[
          {label:'启用',value:1},
          {label:'禁用',value:0},
        ],
        status:'',
        dialogVisible:false,
        tableData:[
          {},{}
        ],
        options:{
          total:1000, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
          firstPage:1, // 首页
          lastPage:100 // 末页
        },
      }
    },
    methods: {
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
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
