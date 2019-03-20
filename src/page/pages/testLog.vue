<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.testLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "testLog",
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
