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
            <el-option v-for="(item,index) in languageList" :key="index" :label="item.languageName"
                       :value="item.languageCode"/>
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
        defaultLang: localStorage.getItem('hy-language'),
        username: '',
        messageNum: '0',
        dialogVisible: false,
        isCollapse: true,
        languageList: []
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
        var _t = this;
        _t.$api.put('system/language/userSet', _t.getCookie('hy-token'), {
          userId: _t.getCookie('hy-user-id'),
          languageMark: localStorage.getItem('hy-language')
        }, function (res) {
          switch (res.status) {
            case 200:
              localStorage.setItem('hy-language', val);
              // window.location.reload();
              break;
            default:
              break;
          }
        });

      },
      // 点击title
      homePage(){
        this.$router.push({name:'Home'});
      },
      // 获取用户信息
      getData() {
        var _t = this;
        _t.$api.get('login/userInfo', _t.getCookie('hy-token'), {}, function (res) {
          switch (res.status) {
            case 200:
              localStorage.setItem('hy-language', res.data.languageMark);
              localStorage.setItem('hy-organization-id', res.data.organizationId);
              _t.setCookie('hy-user-id', res.data.id);
              _t.username = res.data.displayName;
              break;
            default:
              break;
          }
        });
      },
      // 获取当前支持的语言
      getLanguage() {
        var _t = this;
        _t.$api.get('system/language/all', _t.getCookie('hy-token'), {}, function (res) {
          switch (res.status) {
            case 200:
              _t.languageList = res.data.list;
              break;
            default:
              break;
          }
        });
      },
      getDetr() {
        var _t = this;
        _t.$api.get('system/basedata/all', _t.getCookie('hy-token'), {
          dictionaryCode: 'base_01'
        }, function (res) {
          console.log(res.data)
        })
      },
      // 获取消息条数
      getMessage() {
        this.messageNum = 0
        console.log('message');
      }
    },
    watch: {
      messageNum: function () {
        var _t = this;
        setInterval(function () {
          // _t.getMessage();
        }, 1000);
      }
    },
    created() {
      this.getData();
      this.getLanguage();
      // this.getMessage();
      this.getDetr();
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
    width: 90px;
    top: -1px;
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
