<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.monitorLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../../components/common/Box';
  import {getParent, uniqArr, getChildren,unique} from '../../../../assets/js/recursive';

  export default {
    name: "monitorLog",
    components: {Box},
    data() {
      return {

      }
    },
    methods: {

    },
    created() {
    }
  }
</script>

<style scoped>

</style>
