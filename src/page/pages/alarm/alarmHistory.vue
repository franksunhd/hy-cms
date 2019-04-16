<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.alarmHistory')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  export default {
    name: "alarmHistory",
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
