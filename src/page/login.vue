<template>
  <div class="login-box">
    <!--背景-->
    <el-carousel class="login-bg-box" arrow="never" indicator-position="none">
      <el-carousel-item v-for="(item,index) in loginImg" :key="index">
        <img class="login-swiper-img" src="../../static/img/login_bg.png" alt="swiper">
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
          <span>{{loginTip}}</span>
        </div>
        <el-form style="width: 340px;">
          <el-form-item style="margin-bottom: 10px;">
            <el-input class="login_input"
                      placeholder="账号"
                      v-model="username"
                      @input="inputUser"/>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px;">
            <el-input class="login_input" type="password"
                      autocomplete="new-password"
                      placeholder="密码"
                      @input="inputUser"
                      maxlength="20"
                      v-model="password"
                      @keyup.enter.native="login($event)"/>
          </el-form-item>
          <el-form-item style="position: relative;margin-bottom: 30px;">
            <el-input class="login_input"
                      v-model="code"
                      maxlength="4"
                      placeholder="验证码"/>
            <img id="comments-canvas" @click="getCode" :src="codeImg">
            <!--<canvas  @click="draw" width="120" height="30"></canvas>-->
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
        loginImg: [{}, {}, {}],
        username: '',
        password: '',
        code: '',
        codeImg: '',
        code_SN: '',
        isError: false,
        loginTip: '登录名、密码或者验证码不正确'
      }
    },
    methods: {
      // 输入校验
      inputUser() {
        if (this.username.trim() === '' && this.password.trim() === '') {
          this.isError = true;
        } else {
          this.isError = false;
        }
      },
      // 登录校验
      login(event) {
        event.preventDefault();
        // 校验账户名
        if (this.username === '' || this.password === '') {
          this.isError = true;
        } else if (this.username !== '' && this.password !== '') {
          this.isError = false;
          this.toLogin();
        } else {
          this.isError = false;
        }
      },
      // 去登录接口
      toLogin() {
        var _t = this;
        _t.$api.post('login', '', {
          username: _t.username.trim(),
          password: _t.$md5('begin1$2%3=4#5$6end' + _t.$md5(_t.password.trim())),
          code: _t.code,
          sn: _t.code_SN
        }, function (res) {
          switch (res.status) {
            case 200: // 成功
              _t.setCookie('hy-token', res.data.token);
              _t.$router.push({name: 'Home'});
              break;
            case 3004: // 登录失败
              _t.loginTip = res.message;
              _t.isError = true;
              break;
            default:
              _t.loginTip = res.message;
              _t.isError = true;
              break;
          }
          _t.getCode();
        });
      },
      // 获取验证码
      getCode() {
        var _t = this;
        _t.$api.get('random/code', '', {}, function (res) {
          switch (res.status) {
            case 200:
              _t.code_SN = res.data.sn;
              _t.codeImg = res.data.codeBase64;
              break;
            default:
              break;
          }
        });
      }
    },
    created() {
      this.getCode();
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
    bottom: 12px;
    cursor: pointer;
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
