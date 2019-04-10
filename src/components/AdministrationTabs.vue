<template>
  <p>
    <!--<span>页面类型:  {{tagType}}</span>-->
    <span>页面id: {{pagesId}}</span>
  </p>
</template>

<script>
  export default {
    name: "AdministrationTabs",
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

<style scoped>

</style>
