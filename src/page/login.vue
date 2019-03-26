<template>
  <div class="login-box">
    <!--背景-->
    <el-carousel class="login-bg-box" arrow="never" indicator-position="none">
      <el-carousel-item v-for="item in loginImg" :key="item">
        <img class="login-swiper-img" :src="item" alt="swiper">
      </el-carousel-item>
    </el-carousel>
    <!--header-->
    <div class="login-header">
      <img class="login-logo" src="../assets/img/logo.png" alt="logo">
      <span class="login-logoText">带外设备管理平台</span>
    </div>
    <!--main-->
    <div class="login-form">
      <p class="login-form-title">账号登录</p>
      <div class="login-content-box">
        <div class="login-error-box" v-if="isError">
          <i class="el-icon-warning login-error-i"></i>
          <span>登录名、密码或者验证码不正确</span>
        </div>
        <el-form style="width: 340px;">
          <el-form-item style="margin-bottom: 10px;">
            <el-input class="login_input"
                      placeholder="账号"
                      v-model="username"
                      @input="inputUser('user',username)"
                      clearable/>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px;">
            <el-input class="login_input" type="password"
                      autocomplete="new-password"
                      placeholder="密码"
                      clearable
                      @input="inputUser('pwd',password)"
                      v-model="password"
                      @keyup.enter.native="login($event)"/>
          </el-form-item>
          <el-form-item style="position: relative;margin-bottom: 30px;">
            <el-input class="login_input"
                      v-model="code"
                      placeholder="验证码"
                      clearable/>
            <canvas id="comments-canvas" @click="draw" width="120" height="30"></canvas>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-button type="primary" class="login_btn" @click="login">登录</el-button>
          </el-form-item>
          <div class="login-foot-box">
            <a href="javascript:;">忘记密码?</a>
            <a href="javascript:;">立即注册</a>
          </div>
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
    data() {
      return {
        loginImg: [
          'static/img/login_bg.png',
          'static/img/login_bg.png',
          'static/img/login_bg.png'
        ],
        username: '',
        password: '',
        code: '',
        codeNum: '',
        isError: false,
        userTip: '',
        passTip: '',
        codeTip: '',
      }
    },
    methods: {
      // 输入校验
      inputUser(item, val) {
        if (item === 'user') {
          if (val.trim() === '') {
            this.userTip = '请输入用户名';
            this.isError = true;
          } else {
            this.userTip = '';
            this.isError = false;
          }
        } else {
          if (val.trim() === '') {
            this.passTip = '请输入密码';
            this.isError = true;
          } else {
            this.passTip = '';
            this.isError = false;
          }
        }
      },
      // 登录校验
      login(event) {
        event.preventDefault();
        // 校验账户名
        if (this.username === '') {
          this.userTip = '请输入用户名';
          this.isError = true;
        } else {
          this.userTip = '';
          this.isError = false;
        }

        // 校验密码
        if (this.password === '') {
          this.passTip = '请输入密码';
          this.isError = true;
        } else {
          this.passTip = '';
          this.isError = false;
        }

        // 校验验证码
        if (this.code === '') {
          this.codeTip = '请输入验证码';
          this.isError = true;
        } else if (this.code.toUpperCase() !== this.codeNum) {
          this.codeTip = '验证码输入错误';
          this.isError = true;
        } else {
          this.codeTip = '';
          this.isError = false;
        }

        if (this.username !== '' && this.password !== '' && this.code.toUpperCase() === this.codeNum) {
          this.userTip = '';
          this.isError = false;
          this.passTip = '';
          this.isError = false;
          this.toLogin();
        }
      },
      // 去登录接口
      toLogin() {
        var _t = this;
        // 登录按钮点击之后重绘验证码
        var params = new URLSearchParams();
        params.append('username', '123123');
        params.append('password', '123345');
        params.append('token', '123');
        _t.$api.post('system/user/goLoginSystem', params, function (res) {
          console.log(res);
        });
        this.draw();
      },
      draw() {
        var _t = this;
        var canvas = document.getElementById('comments-canvas');
        this.codeNum = _t.$canvas.canvas_draw(120, 30, canvas);
        console.log(this.codeNum);
      },
    },
    mounted() {
      var canvas = document.getElementById('comments-canvas');
      this.codeNum = this.$canvas.canvas_draw(120, 30, canvas);
      // console.log(this.codeNum);
      // console.log(this)
    }
  }
</script>

<style scoped>
  .login-box,
  .login-bg-box {
    height: 100%;
  }

  .login-header {
    position: fixed;
    top: 20px;
    left: 30px;
    right: 0;
    height: 60px;
    z-index: 1000;
  }

  .login-logo {
    width: 50px;
    height: 50px;
  }

  .login-logoText {
    font-size: 16px;
  }

  .login-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .login-form {
    width: 538px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    border-radius: 10px;
  }

  .login-form-title {
    margin-top: 30px;
    text-align: center;
    font-size: 22px;
    margin-bottom: 20px;
  }

  .login-content-box {
    padding: 0 100px;
  }

  .login-error-box {
    line-height: 36px;
    height: 36px;
    padding-left: 10px;
  }

  .login_btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
  }

  #comments-canvas {
    position: absolute;
    right: 0;
    bottom: 10px;
  }

  .login-foot-box {
    text-align: center;
    font-size: 12px;
    margin: 20px 0;
  }

  .login-foot-box a:nth-child(1) {
    margin-right: 10px;
  }

  .login-swiper-img {
    width: 100%;
    height: 100%;
  }
</style>
