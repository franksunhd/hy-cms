<template>
  <div class="systemSettings-box">
    <div v-show="isShow" class="systemSettings-navBar">
      <systemSettingsNavBar/>
      <a href="javascript:;" @click="clickInset" id="systemSettings-navBar-inSet">内</a>
    </div>
    <a href="javascript:;" @click="clickOutset" id="systemSettings-navBar-outSet">外</a>
    <div id="systemSettings-routerView" class="systemSettings-routerView">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';

  export default {
    name: "system-settings",
    components: {systemSettingsNavBar},
    data() {
      return {
        isShow: true,
        levelList: null,
      }
    },
    methods: {
      // 收缩
      clickInset() {
        this.isShow = false;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'inline-block';
        document.getElementById('systemSettings-routerView').style.left = '0';
      },
      // 展开
      clickOutset() {
        this.isShow = true;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'none';
        document.getElementById('systemSettings-routerView').style.left = '174px';
      },
    },
  }
</script>

<style>
  .systemSettings-box {
    height: 100%;
  }

  .systemSettings-routerView {
    width: auto;
    position: absolute;
    top: 0;
    left: 174px;
    bottom: 0;
    right: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .systemSettings-navBar {
    width: 174px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  #systemSettings-navBar-inSet {
    position: fixed;
    top: 50%;
    left: 210px;
  }

  #systemSettings-navBar-outSet {
    position: fixed;
    top: 50%;
    left: 60px;
    display: none;
    z-index: 1001;
  }
</style>
