<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.license')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form inline label-width="200px">
      <el-form-item :label="$t('breadcrumb.version') + '：'">3.0</el-form-item><br>
      <el-form-item :label="$t('breadcrumb.customerName') + '：'">上海XXXXXXXXXXXXXXX证券营业部</el-form-item><br>
      <el-form-item :label="$t('breadcrumb.LicenseGenerated') + '：'">
        <span style="width: 100px;display: inline-block;">2019-02-01</span>
      </el-form-item>
      <el-form-item :label="$t('breadcrumb.validity') + '：'">2019-02-01</el-form-item><br>
      <el-form-item :label="$t('breadcrumb.allNumber') + '：'">
        <span style="width: 100px;display: inline-block;">666</span>
      </el-form-item>
      <el-form-item :label="$t('breadcrumb.hasNumber') + '：'">102</el-form-item><br>
      <el-form-item :label="$t('breadcrumb.effectiveModule') + '：'">ALL</el-form-item>
    </el-form>
    <el-button size="small" @click="dialogVisible = true">{{$t('breadcrumb.uploadLicense')}}</el-button>
    <el-button size="small" @click="isShow = true">{{$t('breadcrumb.viewHistory')}}</el-button>
    <el-dialog :title="$t('header.head')" :visible.sync="dialogVisible">
      <el-upload action="">
        <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
    <el-table :data="tableData" v-if="isShow">
      <el-table-column :label="$t('breadcrumb.indexNumber')" type="index" />
      <el-table-column :label="$t('breadcrumb.customerName')" />
      <el-table-column :label="$t('breadcrumb.allNumber')" />
      <el-table-column :label="$t('breadcrumb.validityDate')" />
      <el-table-column :label="$t('breadcrumb.authorizationModule')" />
      <el-table-column :label="$t('breadcrumb.authorizationUpdateTime')" />
    </el-table>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "license-information",
    components:{Box},
    data(){
      return {
        dialogVisible:false,
        isShow:false,
        tableData:[{},{}]
      }
    },
    methods:{

    },
    created(){
      // this.$store.commit('setLoading',true);
    }
  }
</script>

<style scoped>

</style>
