<template>
  <el-container class="systemSettings-box">
    <el-aside class="systemSettings-navBar" width="210px">
      <systemSettingsNavBar />
    </el-aside>
    <el-main class="systemSettings-routerView">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';
  export default {
    name: "system-settings",
    components:{systemSettingsNavBar},
  }
</script>

<style>
  .systemSettings-routerView {
    padding-left: 210px;
  }

  .systemSettings-navBar {
    position: fixed;
    top: 60px;
    left: 60px;
    bottom: 0;
  }

  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  .systemSettings-navBar::-webkit-scrollbar {
    width: 5px;
    height: 3px;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  .systemSettings-navBar::-webkit-scrollbar-track{
    border-radius: 5px;
  }
  /*定义滑块，内阴影及圆角*/
  .systemSettings-navBar::-webkit-scrollbar-thumb{
    height: 20px;
    border-radius: 5px;
  }
</style>
