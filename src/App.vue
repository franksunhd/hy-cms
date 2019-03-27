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
  watch: {
    // 监听三级菜单 更换节点加减号
    $route() {
      this.$nextTick(() => {
        var node = document.querySelectorAll('#system-menu li.el-submenu');
        for (var i = 0; i < node.length; i++) {
          var classArr = node[i].getAttribute('class').split(' ');
          for (var j = 0; j < classArr.length; j++) {
            if (classArr[j] === 'is-opened' && node[i].childNodes[0].childNodes[0].childNodes[0]) {
              node[i].childNodes[0].childNodes[0].childNodes[0].className = 'el-icon-minus';
            }
          }
        }
      });
    }
  }
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
  }
</style>
