<template>
  <!--所有内容组件的加载区域-->
  <div id="appMain" class="app-main" v-loading.body.lock="loading" element-loading-text="拼命加载中">
    <div class="box-wrap">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: "box",
    props:['currentPage','crumbs'],
    computed:{
      loading(){
        return this.$store.state.loading;
      }
    }
  }
</script>

<style scoped>
  .app-main {
    height: 100%;
    min-height: 475px;
    box-sizing: border-box;
    overflow: hidden;
    /*position: relative;*/
  }

  .box-wrap {
    padding: 0;
  }
</style>
