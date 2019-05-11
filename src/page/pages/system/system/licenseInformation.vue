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
      <el-form inline label-width="200px" class="marginBottom10">
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
    <div class="padding20 borderBottom licensenInfo-btn-box">
      <el-button size="small" @click="dialogVisible = true">{{$t('license.uploadLicense')}}</el-button>
      <el-button type="primary" size="small" @click="isShow = true">{{$t('license.viewHistory')}}</el-button>
    </div>
    <!--更新许可证书-->
    <el-dialog
      append-to-body
      class="licenseInformation-dialog"
      :title="$t('header.head')"
      :visible.sync="dialogVisible">
      <el-upload action="">
        <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="alertBtn" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="dialogVisible = false">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
    <!--查看证书历史-->
    <div class="padding20">
      <el-table :data="tableData" v-if="isShow" border stripe class="indexTableBox">
        <el-table-column width="90px" :label="$t('license.indexNumber')" type="index" header-align="left" align="left" />
        <el-table-column prop="1" min-width="170px" :label="$t('license.customerName')" header-align="left" align="left" />
        <el-table-column prop="2" min-width="120px" :label="$t('license.allNumber')" header-align="left" align="left" />
        <el-table-column prop="3" min-width="190px" :label="$t('license.validityDate')" header-align="left" align="left"/>
        <el-table-column prop="4" min-width="140px" :label="$t('license.authorizationModule')" header-align="left" align="left" />
        <el-table-column prop="5" min-width="160px" :label="$t('license.authorizationUpdateTime')" header-align="left" align="left" />
      </el-table>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  export default {
    name: "license-information",
    components:{Box},
    data(){
      return {
        dialogVisible:false,
        isShow:false,
        tableData:[
          {
            1:'你从为别玩碧波被窝我饿哦北欧文本你从为别玩碧波被窝对我饿哦北欧文本',
            2:'99999',
            3:'2019-99-99至9999-99-99',
            4:'我饿哦北欧文本你从为别玩碧波被窝对',
            5:''
          },
          {}
        ]
      }
    },
    methods:{

    },
    created(){
      // this.$store.commit('setLoading',true);
    }
  }
</script>

<style>
  .licenseInformation-dialog .el-dialog {
    width: 640px;
    height: 434px;
  }
</style>
