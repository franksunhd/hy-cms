<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.dataDictionary')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form>
      <el-form-item label=""></el-form-item>
    </el-form>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "dataDictionary",
    components:{Box},
    data() {
      return {}
    },
    methods: {},
    created() {
    }
  }
</script>

<style scoped>

</style>
