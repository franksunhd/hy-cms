<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.monitorManage')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.equipmentMonitoring')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.monitorThreshold')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--返回上一级-->
    <div class="padding20" style="padding-bottom: 10px;">
      <div class="grayBg">
        111
      </div>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  export default {
    name: "monitorThresholdValue",
    components:{Box},
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
