<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      // skinColor:localStorage.getItem('skinColor') || '',
    }
  },
  mounted: function () {
    // 换肤
    switch (this.skinColor) {
      default:
        break;
    }
  },
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
  }
</style>
