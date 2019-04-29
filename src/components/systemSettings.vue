<template>
  <div class="systemSettings-box">
    <div v-show="isShow" class="systemSettings-navBar">
      <systemSettingsNavBar/>
      <a href="javascript:;" @click="clickInset" id="systemSettings-navBar-inSet">
        <span class="iconfont">&#xe68b;</span>
      </a>
    </div>
    <a href="javascript:;" @click="clickOutset" id="systemSettings-navBar-outSet">
      <span class="iconfont">&#xe69d;</span>
    </a>
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

  #systemSettings-navBar-inSet,
  #systemSettings-navBar-outSet {
    height: 40px;
    width: 20px;
    top: 50%;
    text-align: center;
    line-height: 40px;
    position: fixed;
  }

  #systemSettings-navBar-inSet {
    left: 210px;
    border-radius: 15px 0 0 15px;
  }

  #systemSettings-navBar-outSet {
    left: 56px;
    display: none;
    z-index: 1001;
    border-radius: 0 15px 15px 0;
  }
</style>
