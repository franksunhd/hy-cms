<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.informationPlatform')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form label-width="200px">
      <el-form-item label="登录页标题：">
        <el-input class="inputWidth" />
      </el-form-item>
      <el-form-item label="登录页Logo：">
        <el-upload
          action=""
          list-type="picture">
          <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="登录页轮播图：">
        <el-upload
          action=""
          list-type="picture-card">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="登录页页脚信息：">
        <el-input class="inputWidth" />
      </el-form-item>
      <el-form-item label="后台页面头部标题：">
        <el-input class="inputWidth" />
      </el-form-item>
      <el-form-item label="后台页面头部Logo：">
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
