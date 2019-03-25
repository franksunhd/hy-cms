<template>
  <el-container class="systemSettings-box">
    <div>
      <el-aside v-show="isShow" class="systemSettings-navBar" width="174px">
        <systemSettingsNavBar />
        <a href="javascript:;"  @click="clickInset" id="systemSettings-navBar-inSet">内</a>
      </el-aside>
      <a href="javascript:;" @click="clickOutset" id="systemSettings-navBar-outSet">外</a>
    </div>
    <div id="systemSettings-routerView" class="systemSettings-routerView">
      <router-view/>
    </div>
  </el-container>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';
  export default {
    name: "system-settings",
    components:{systemSettingsNavBar},
    data(){
      return {
        isShow:true,
        levelList: null,
      }
    },
    methods:{
      // 收缩
      clickInset(){
        this.isShow = false;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'inline-block';
        document.getElementById('systemSettings-navBar-outSet').style.left = '60px';
        document.getElementById('systemSettings-routerView').style.paddingLeft = '0px';
      },
      // 展开
      clickOutset(){
        this.isShow = true;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'none';
        document.getElementById('systemSettings-navBar-outSet').style.left = '235px';
        document.getElementById('systemSettings-routerView').style.paddingLeft = '174px';
      },
    },
  }
</script>

<style>
  .systemSettings-box {
    height: 100%;
  }

  .systemSettings-routerView {
    width: 100%;
    padding-left: 174px;
  }

  .systemSettings-navBar {
    position: absolute;
    top: 56px;
    left: 56px;
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
