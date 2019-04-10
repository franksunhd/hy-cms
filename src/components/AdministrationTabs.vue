<template>
  <Box class="administration-box">
    <!--整屏,超出滚动-->
    <div>

    </div>
  </Box>
</template>

<script>
  import Box from '../components/Box';
  export default {
    name: "AdministrationTabs",
    components:{Box},
    data() {
      return {

      }
    },
    props:{
      // 页面类型 监测管理(1) 和 告警管理(2) 共用
      // tagType:{
      //   type:Number
      // },
      // 页面Id 用于接口请求数据
      pagesId:{
        type:String
      }
    },
    methods: {

    },
    created() {
    }
  }
</script>

<style>
  .administration-box .box-wrap {
    padding: 30px 10px 0 10px;
  }
</style>
