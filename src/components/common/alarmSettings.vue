<template>
  <div class="alarmSettings-box">
    <div v-show="isShow" class="alarmSettings-navBar">
      <systemSettingsNavBar/>
      <a href="javascript:;" @click="clickInset" id="alarmSettings-navBar-inSet">
        <span class="iconfont" style="font-size: 14px;">&#xe68b;</span>
      </a>
    </div>
    <a href="javascript:;" @click="clickOutset" id="alarmSettings-navBar-outSet">
      <span class="iconfont">&#xe69d;</span>
    </a>
    <div id="alarmSettings-routerView" class="alarmSettings-routerView">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';

  export default {
    name: "alarm-settings",
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
        document.getElementById('alarmSettings-navBar-outSet').style.display = 'inline-block';
        document.getElementById('alarmSettings-routerView').style.left = '0';
      },
      // 展开
      clickOutset() {
        this.isShow = true;
        document.getElementById('alarmSettings-navBar-outSet').style.display = 'none';
        document.getElementById('alarmSettings-routerView').style.left = '174px';
      },
    },
  }
</script>

<style>
  .alarmSettings-box {
    height: 100%;
  }

  .alarmSettings-routerView {
    width: auto;
    position: absolute;
    top: 0;
    left: 174px;
    bottom: 0;
    right: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .alarmSettings-navBar {
    width: 174px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  #alarmSettings-navBar-inSet,
  #alarmSettings-navBar-outSet {
    height: 40px;
    width: 14px;
    top: 50%;
    text-align: center;
    line-height: 40px;
    position: fixed;
  }

  #alarmSettings-navBar-inSet {
    left: 216px;
    border-radius: 15px 0 0 15px;
  }

  #alarmSettings-navBar-outSet {
    left: 56px;
    display: none;
    z-index: 1001;
    border-radius: 0 15px 15px 0;
  }
</style>
