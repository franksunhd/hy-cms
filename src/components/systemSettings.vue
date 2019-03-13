<template>
  <el-container class="systemSettings-box">
    <div>
      <el-aside v-show="isShow" class="systemSettings-navBar" width="210px">
        <systemSettingsNavBar />
        <a href="javascript:;"  @click="clickInset" id="systemSettings-navBar-inSet">内</a>
      </el-aside>
      <a href="javascript:;" @click="clickOutset" id="systemSettings-navBar-outSet">外</a>
    </div>
    <div id="systemSettings-routerView" class="systemSettings-routerView">
      <div style="padding-left: 20px;">
        <router-view/>
      </div>
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
        document.getElementById('systemSettings-routerView').style.paddingLeft = 0;
      },
      // 展开
      clickOutset(){
        this.isShow = true;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'none';
        document.getElementById('systemSettings-navBar-outSet').style.left = '235px';
        document.getElementById('systemSettings-routerView').style.paddingLeft = '210px';
      },
    },
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

  #systemSettings-navBar-inSet {
    position: fixed;
    top: 50%;
    left: 251px;
  }

  #systemSettings-navBar-outSet {
    position: fixed;
    top: 50%;
    left: 60px;
    display: none;
    z-index: 1001;
  }
</style>
