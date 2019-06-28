<template>
  <!--所有内容组件的加载区域-->
  <div
		id="appMain"
		class="app-main"
		v-loading.body.lock="loading"
		:element-loading-text="$t('public.loading')">
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
    box-sizing: border-box;
    overflow: hidden;
  }

  .box-wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
    padding: 50px 0 0 0;
  }
</style>
