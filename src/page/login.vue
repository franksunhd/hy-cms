<template>
	<div class="login-box">
		<!--背景-->
		<el-carousel class="login-bg-box" arrow="never" indicator-position="none">
			<el-carousel-item v-for="(item,index) in loginImg" :key="index">
				<img class="login-swiper-img" src="../../static/img/login_bg.jpg" alt="swiper">
			</el-carousel-item>
		</el-carousel>
		<!--header-->
		<div class="login-header">
			<img class="login-logo" src="../assets/img/logo_login.png" alt="logo">
			<span class="login-logoText">智能硬件管理平台</span>
		</div>
		<!--main-->
		<div class="login-form">
			<p class="login-form-title">账号登录</p>
			<div class="login-content-box">
				<div class="login-error-box" v-if="isError">
					<i class="el-icon-warning"></i>
					<span>{{loginTip}}</span>
				</div>
				<el-form>
					<el-form-item style="margin-bottom: 10px;">
						<el-input
							class="login_input"
							placeholder="账号"
							v-model="username"
							hy_name="username"
							@input="inputUser"/>
					</el-form-item>
					<el-form-item style="margin-bottom: 10px;">
						<el-input
							class="login_input" type="password"
							autocomplete="new-password"
							placeholder="密码"
							hy_name="password"
							@input="inputUser"
							maxlength="20"
							v-model="password"
							@keyup.enter.native="login($event)"/>
					</el-form-item>
					<!--
					<el-form-item style="position: relative;margin-bottom: 30px;">
						<el-input
							class="login_input"
							v-model="code"
							maxlength="4"
							placeholder="验证码"
							hy_name="code"
							@keyup.enter.native="login($event)"/>
						<img id="comments-canvas" @click="getCode" :src="codeImg">
					</el-form-item>
					-->
					<el-form-item style="margin-bottom: 0;">
						<el-button hy_name="submit" type="primary" class="login_btn" @click="login">登录</el-button>
					</el-form-item>
					<div class="login-foot-box">
						<!-- 这里没有功能实现，先注释掉
						  <a href="javascript:;">忘记密码?</a>
						  <a href="javascript:;">立即注册</a>
						-->
					</div>
				</el-form>
			</div>
		</div>
		<!--footer-->
		<div class="login-footer">
			博新融通（北京）科技有限公司
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
				_t.$api.post('login', {
					username: _t.username.trim(),
					password: _t.$md5('begin1$2%3=4#5$6end' + _t.$md5(_t.password.trim())),
					code: _t.code,
					sn: _t.code_SN
				}, function (res) {
					switch (res.status) {
						case 200: // 成功
							localStorage.setItem('hy-token', res.data.token);
							_t.$router.push({name: 'Home'});
							break;
						case 1000: // 登录失败
						case 1001: // 登录请求异常
						case 1002: // 未登录状态
						case 1003: // 无操作权限
							_t.loginTip = res.message;
							_t.isError = true;
							break;
						default:
							break;
					}
					_t.getCode();
				});
			},
			// 获取验证码
			getCode() {
				var _t = this;
				_t.$api.get('random/code', {}, function (res) {
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
		font-size: 14px;
		margin-left: 14px;
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
		width: 510px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1001;
		border-radius: 10px;
	}

	.login-form-title {
		margin-top: 30px;
		text-align: center;
		font-size: 22px;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.login-content-box {
		padding: 0 100px;
	}

	.login-error-box {
		line-height: 36px;
		height: 36px;
		padding-left: 10px;
		margin-bottom: 10px;
	}

	.login_btn {
		width: 100%;
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		margin-top: 10px;
	}

	#comments-canvas {
		position: absolute;
		right: 0;
		bottom: 4px;
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
