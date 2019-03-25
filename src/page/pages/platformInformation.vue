<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.informationPlatform')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <el-form label-width="200px">
        <el-form-item :label="$t('informationPlatform.loginTitle') + '：'">
          <el-input class="inputWidth" />
        </el-form-item>
        <el-form-item :label="$t('informationPlatform.loginLogo') + '：'">
          <el-upload
            action=""
            list-type="picture">
            <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('informationPlatform.loginSwiper') + '：'">
          <el-upload
            action=""
            list-type="picture-card">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('informationPlatform.loginFooterInfo') + '：'">
          <el-input class="inputWidth" />
        </el-form-item>
        <el-form-item :label="$t('informationPlatform.homeTitle') + '：'">
          <el-input class="inputWidth" />
        </el-form-item>
        <el-form-item :label="$t('informationPlatform.homeLogo') + '：'">
          <el-upload
            action=""
            list-type="picture">
            <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button>{{$t('public.save')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "platform-information",
    components:{Box},
    data(){
      return {
        imageUrl:''
      }
    },
    methods:{

    },
    created(){

    }
  }
</script>

<style scoped>

</style>
