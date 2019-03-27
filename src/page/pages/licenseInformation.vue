<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.license')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <el-form inline label-width="200px">
        <el-form-item :label="$t('license.version') + '：'">3.0</el-form-item><br>
        <el-form-item :label="$t('license.customerName') + '：'">上海XXXXXXXXXXXXXXX证券营业部</el-form-item><br>
        <el-form-item :label="$t('license.LicenseGenerated') + '：'">
          <span style="width: 100px;display: inline-block;">2019-02-01</span>
        </el-form-item>
        <el-form-item :label="$t('license.validity') + '：'">2019-02-01</el-form-item><br>
        <el-form-item :label="$t('license.allNumber') + '：'">
          <span style="width: 100px;display: inline-block;">666</span>
        </el-form-item>
        <el-form-item :label="$t('license.hasNumber') + '：'">102</el-form-item><br>
        <el-form-item :label="$t('license.effectiveModule') + '：'">ALL</el-form-item>
      </el-form>
    </div>
    <div class="padding20 borderBottom">
      <el-button size="small" @click="dialogVisible = true">{{$t('license.uploadLicense')}}</el-button>
      <el-button size="small" @click="isShow = true">{{$t('license.viewHistory')}}</el-button>
    </div>
    <!--更新许可证书-->
    <el-dialog
      append-to-body
      :title="$t('header.head')"
      :visible.sync="dialogVisible">
      <el-upload action="">
        <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
    <!--查看证书历史-->
    <div class="padding20">
      <el-table :data="tableData" v-if="isShow" stripe>
        <el-table-column :label="$t('license.indexNumber')" type="index" header-align="center" align="center" />
        <el-table-column :label="$t('license.customerName')" header-align="center" align="center" />
        <el-table-column :label="$t('license.allNumber')" header-align="center" align="center" />
        <el-table-column :label="$t('license.validityDate')" header-align="center" align="center"/>
        <el-table-column :label="$t('license.authorizationModule')" header-align="center" align="center" />
        <el-table-column :label="$t('license.authorizationUpdateTime')" header-align="center" align="center" />
      </el-table>
    </div>
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
