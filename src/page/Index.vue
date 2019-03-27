<template>
  <div class="Index-box">
    <!--头部-->
    <div class="app-header clearfix">
      <div class="app-header-logo middle fl">
        <img src="../assets/img/logo.png" alt="logo"/>
        <span @click="homePage" style="cursor: pointer;margin-left: 10px;">控制台首页</span>
      </div>
      <ul class="app-header-navBar fr">
        <li>
          <el-badge :value="messageNum">
            <a href="javascript:;">{{$t('header.message')}}</a>
          </el-badge>
        </li>
        <li>
          <a href="javascript:;">{{$t('header.document')}}</a>
        </li>
        <li>
          <el-select class="el-app-header-select" v-model="defaultLang" @change="changeLanguage">
            <el-option label="中文" value="zh_CN"/>
            <el-option label="En" value="en"/>
          </el-select>
        </li>
        <li>
          <span>{{$t('header.welcome')}}:</span>
          <span>{{username}}</span>
          <el-dropdown class="el-app-header-dropDown" @command="handleCommand">
              <span style="display: inline-block;">
                <img class="el-app-header-icon" style="border-radius: 50%;overflow: hidden;"
                     src="../assets/img/default.jpg">
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="head">{{$t('header.head')}}</el-dropdown-item>
              <el-dropdown-item command="pwd">{{$t('header.pwd')}}</el-dropdown-item>
              <el-dropdown-item command="exit">{{$t('header.logOut')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <!--左侧导航-->
    <appSide/>
    <!--内容区域-->
    <div id="BoxName" class="BoxName">
      <router-view/>
    </div>
    <!--修改头像弹出层-->
    <el-dialog
      append-to-body
      :title="$t('header.head')"
      :visible.sync="dialogVisible">
      <el-upload action="">
        <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">{{$t('public.close')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import appSide from './pages/appSide';
  export default {
    name: "index",
    components: {appSide},
    data() {
      return {
        defaultLang: localStorage.getItem('hy-language') || 'zh_CN)',
        username: 'admin',
        messageNum: 21,
        dialogVisible: false,
        isCollapse: true
      }
    },
    methods: {
      // 点击头像
      handleCommand(command) {
        switch (command) {
          case 'head': // 修改头像
            this.dialogVisible = true;
            break;
          case 'pwd': // 修改密码
            break;
          case 'exit': // 退出登录
            this.$router.push({name: 'Login'});
            break;
          default:
            break;
        }
      },
      // 切换语言
      changeLanguage(val) {
        localStorage.setItem('hy-language', val);
        window.location.reload();
      },
      // 点击title
      homePage(){
        this.$router.push({name:'Home'});
      }
    },
    created() {
      document.getElementsByTagName("title")[0].innerText = '带外设备管理平台';
    }
  }
</script>

<style>
  .app-header {
    height: 52px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1030;
    font-size: 16px;
  }

  .app-aside {
    overflow: visible;
  }

  .app-header-logo img {
    width: 56px;
    height: 52px;
  }

  .app-header-logo > img,
  .app-header-logo > span {
    vertical-align: middle;
  }

  .app-header-navBar {
    line-height: 52px;
  }

  .app-header-navBar li {
    float: left;
    margin-right: 20px;
  }

  .app-header-navBar li:first-child {
    margin-right: 50px;
  }

  .el-app-header-select {
    width: 50px;
  }

  .el-app-header-select .el-input__suffix {
    display: none;
  }

  .el-app-header-select .el-input--suffix .el-input__inner {
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    border: none;
    font-size: 16px;
    text-align: center;
  }

  .el-app-header-icon {
    width: 40px;
    height: 40px;
  }

  .el-app-header-dropDown {
    position: relative;
    top: -2px;
    margin-left: 10px;
  }

  .BoxName {
    position: absolute;
    top: 52px;
    left: 56px;
    right: 0;
    bottom: 0;
    z-index: 999;
    width: auto;
    overflow: hidden;
  }
</style>
