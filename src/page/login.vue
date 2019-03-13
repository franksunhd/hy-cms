<template>
  <div class="login-box">
    <!--header-->
    <div class="login-header clearfix">
      <div class="fl">
        <img class="login-logo" src="../assets/img/logo.png" alt="logo">
        <span class="login-logoText">带外设备管理平台</span>
      </div>
      <div class="fr">
        <a class="login-collect" href="javascript:;" @click="addFavorite">加入收藏</a>
        <a class="login-home" href="javascript:;" @click="setHome">设为首页</a>
      </div>
    </div>
    <!--main-->
    <div class="login-main clearfix">
      <div class="fl" style="width: 50%;">
        <el-carousel height="400px">
          <el-carousel-item v-for="item in loginImg" :key="item">
            <img :src="item" alt="swiper">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="fl login-form">
        <p class="login-form-title">账号登录</p>
        <el-form>
          <el-form-item>
            <el-input class="login_input"
                      placeholder="账号"
                      v-model="username"
                      @input="inputUser('user',username)"
                      clearable/>
            <div class="errorTips activeColor" v-show="userError">
              <span v-text="userTip"></span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-input class="login_input" type="password"
                      autocomplete="new-password"
                      placeholder="密码"
                      clearable
                      @input="inputUser('pwd',password)"
                      v-model="password"
                      @keyup.enter.native="login($event)"/>
            <div class="errorTips activeColor" v-show="passError">
              <span v-text="passTip"></span>
            </div>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-input class="login_input"
                      style="width: 200px;"
                      v-model="code"
                      placeholder="验证码"
                      clearable/>
            <canvas id="comments-canvas" @click="draw" width="120" height="40"></canvas>
            <div class="errorTips activeColor" v-show="codeError">
              <span v-text="codeTip"></span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login_btn" @click="login($event)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--footer-->
    <div class="login-footer">
      版权所有 京ICP 0123456789 号
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data(){
      return {
        loginImg:[
          '../../static/img/01.jpg',
          '../../static/img/02.jpg',
          '../../static/img/03.jpg'
        ],
        username:'',
        password:'',
        code:'',
        codeNum:'',
        userError:false,
        passError:false,
        codeError:false,
        userTip:'',
        passTip:'',
        codeTip:'',
      }
    },
    methods:{
      // 输入校验
      inputUser(item,val) {
        if (item === 'user') {
          if (val.trim() === '') {
            this.userTip = '请输入用户名';
            this.userError = true;
          } else {
            this.userTip = '';
            this.userError = false;
          }
        } else {
          if (val.trim() === '') {
            this.passTip = '请输入密码';
            this.passError = true;
          } else {
            this.passTip = '';
            this.passError = false;
          }
        }
      },
      // 登录校验
      login(event){
        event.preventDefault();
        // 校验账户名
        if (this.username === '') {
          this.userTip = '请输入用户名';
          this.userError = true;
        } else {
          this.userTip = '';
          this.userError = false;
        }

        // 校验密码
        if (this.password === '') {
          this.passTip = '请输入密码';
          this.passError = true;
        } else {
          this.passTip = '';
          this.passError = false;
        }

        // 校验验证码
        if (this.code === '') {
          this.codeTip = '请输入验证码';
          this.codeError = true;
        } else if (this.code.toUpperCase() !== this.codeNum) {
          this.codeTip = '验证码输入错误';
          this.codeError = true;
        } else {
          this.codeTip = '';
          this.codeError = false;
        }

        if(this.username !== '' && this.password !== '' && this.code.toUpperCase() === this.codeNum){
          this.userTip = '';
          this.userError = false;
          this.passTip = '';
          this.passError = false;
          this.toLogin();
        }
      },
      // 去登录接口
      toLogin(){
        var _t = this;
        // 登录按钮点击之后重绘验证码
        this.draw();
      },
      draw(){
        var _t = this;
        var canvas = document.getElementById('comments-canvas');
        this.codeNum = _t.$canvas.canvas_draw(120,40,canvas);
        console.log(this.codeNum);
      },
      // 加入收藏
      addFavorite(){
        var event = window.event || event;
        if(document.all){
          //支持IE
          event.returnValue = false;
        }else{
          //IE不支持
          event.preventDefault();
        }
        var url = window.location.href;
        var title = '我的网站';
        try {
          window.external.addFavorite(url, title);
        }
        catch (e) {
          try {
            window.sidebar.addPanel(title, url, "");
          }
          catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n加入收藏失败，请使用Ctrl+D进行添加");
          }
        }
      },
      // 设为首页
      setHome(){
        var obj = this;
        var vrl = window.location;
        try {
          console.log(1)
            obj.style.behavior='url(#default#homepage)';
            obj.setHomePage(vrl);
        } catch(e){
          console.log(2)
          if(window.netscape) {
            try {
              netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
              alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage',vrl);
          }
        }
      }
    },
    mounted(){
      var canvas = document.getElementById('comments-canvas');
      this.codeNum = this.$canvas.canvas_draw(120,40,canvas);
      console.log(this.codeNum);
    }
  }
</script>

<style>
  .login-logo {
    width: 150px;
  }

  .login-logoText {
    font-size: 20px;
  }

  .login-header {
    line-height: 70px;
  }

  .login-collect {
    font-size: 16px;
    margin-right: 20px;
  }

  .login-home {
    font-size: 16px;
    margin-right: 100px;
  }

  .login-footer {
    height: 50px;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }

  .login-box li.el-carousel__indicator {
    padding: 0;
    line-height: 20px;
    height: 20px;
  }

  .login-box li.el-carousel__indicator.is-active .el-carousel__button {
    width: 20px;
    height: 20px;
  }

  .login-box li.el-carousel__indicator .el-carousel__button {
    background-color: #000;
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
  }

  .login-form {
    width: 400px;
    padding-left: 50px;
  }

  .login-form-title {
    font-size: 20px;
    margin-bottom: 50px;
  }

  .login-form .login_btn {
    width: 100%;
  }

  .login-form p.welcome {
    font-size: 24px;
    color: #ff9500;
    margin-bottom: 38px;
  }

  .login-form p.login-tip {
    text-align: left;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .login-form div.errorTips {
    margin: 0;
    padding: 0;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
    text-align: left;
    position: absolute;
    top:38px;
  }

  .login-form .login_form_item {
    position: relative;
    margin-bottom: 20px;
  }

  #comments-canvas {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

</style>
