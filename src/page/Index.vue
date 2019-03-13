<template>
  <div class="Index-box">
    <el-container style="height: 100%;" direction="vertical">
      <!--头部-->
      <el-header>
        <div class="app-header clearfix">
          <div class="app-header-logo middle fl">
            <img src="../assets/img/logo.png" alt="logo"/>
            <span>控制台首页</span>
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
                <el-option label="中文" value="zh" />
                <el-option label="En" value="en" />
              </el-select>
            </li>
            <li>
              <span>{{$t('header.welcome')}}:</span>
              <span>{{username}}</span>
              <el-dropdown class="el-app-header-dropDown" @command="handleCommand">
              <span style="display: inline-block;">
                <img class="el-app-header-icon" style="border-radius: 50%;overflow: hidden;" src="../assets/img/default.jpg">
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
      </el-header>
      <el-container>
        <!--左侧导航-->
        <el-aside width="60px" class="app-aside">
          <!--功能导航-->
          <div class="app-aside-box">
            aside
          </div>

        </el-aside>
        <!--内容区域-->
        <el-main class="BoxName">
          <div id="BoxName" >
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!--修改密码弹出层-->
    <el-dialog :title="$t('header.head')" :visible.sync="dialogVisible">
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
  export default {
    name: "index",
    data(){
      return {
        defaultLang:localStorage.getItem('hyLanguage') || 'zh',
        username:'admin',
        messageNum:21,
        dialogVisible:false,
        isCollapse:true
      }
    },
    methods:{
      // 点击头像
      handleCommand(command){
        switch (command) {
          case 'head': // 修改头像
            this.dialogVisible = true;
            break;
          case 'pwd': // 修改密码
            break;
          case 'exit': // 退出登录
            break;
          default:
            break;
        }
      },
      changeLanguage(val){
        localStorage.setItem('hyLanguage',val);
        window.location.reload();
      }
    }
  }
</script>

<style>
  .app-header-logo img {
    width: 60px;
  }

  .app-header-logo > img,
  .app-header-logo > span {
    vertical-align: middle;
  }

  .app-header-navBar {
    line-height: 60px;
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
    font-size: 20px;
    text-align: center;
  }

  .el-app-header-icon {
    width: 50px;
    height: 50px;
  }

  .el-app-header-dropDown {
    position: relative;
    top: -2px;
    margin-left: 10px;
  }
</style>
