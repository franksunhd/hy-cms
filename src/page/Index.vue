<template>
	<div class="Index-box">
		<!--头部-->
		<div class="app-header clearfix">
			<div class="app-header-logo middle fl">
				<div class="displayInlineBlock logo-box">
					<img :src="logoImg" onerror="javascript:this.src='./static/sys/logo/logo.png';" alt="logo"/>
				</div>
				<span @click="homePage" style="cursor: pointer;margin-left: 10px;">{{$t('header.title')}}</span>
			</div>
			<ul class="app-header-navBar clearfix fr">
				<!--
				<li>
					<el-badge :value="messageNum">
						<a href="javascript:;" @click="toCurrentAlarmPage">{{$t('header.message')}}</a>
					</el-badge>
				</li>
				<li>
					<a href="javascript:;">{{$t('header.document')}}</a>
				</li>
				-->
				<li>
					<el-select class="el-app-header-select" v-model="defaultLang" @change="changeLanguage">
						<el-option
							v-for="(item,index) in languageList"
							:key="index" :label="item.languageName"
							:value="item.languageCode"/>
					</el-select>
				</li>
				<li class="clearfix">
					<span class="userName-span" v-if="displayName === ''|| displayName === null">{{queryInfo.userName}}</span>
					<span class="userName-span" v-else>{{displayName}}</span>
					<el-dropdown class="el-app-header-dropDown fr" @command="handleCommand">
						<span class="displayInlineBlock">
							<img class="el-app-header-icon" style="border-radius: 50%;overflow: hidden;"
									 src="../assets/img/avatars.png">
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="head">{{$t('header.ModifyTheInformation')}}</el-dropdown-item>
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
		<!--修改基本信息弹出层-->
		<el-dialog
			class="userHeader-photo-box"
			append-to-body
			:title="$t('header.ModifyTheInformation')"
			:before-close="getInformationClose"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="queryInfo" label-position="right" label-width="140px">
				<el-form-item class="star" :label="$t('header.userName')+'：'">
					<el-input @blur="ruleDisplayName(queryInfo.displayName)" v-model="queryInfo.displayName" id="inputName"
										class="width200"/>
					<span class="isNotNull" v-if="queryInfo.displayNameFlag">{{queryInfo.displayNameFlagTip}}</span>
				</el-form-item>
				<el-form-item :label="$t('header.mobileNum')+'：'">
					<el-input maxlength="11" @blur="ruleMobile(queryInfo.mobile)" v-model="queryInfo.mobile" id="inputMobile"
										class="width200"/>
					<span class="isNotNull" v-if="queryInfo.mobileFlag">{{queryInfo.mobileFlagTip}}</span>
				</el-form-item>
				<el-form-item :label="$t('header.emails')+'：'">
					<el-input @blur="ruleEmail(queryInfo.email)" v-model="queryInfo.email" id="inputEmail" class="width200"/>
					<span class="isNotNull" v-if="queryInfo.emailsFlag">{{queryInfo.emailsFlagTip}}</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="getInformationSub">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="getInformationClose">{{$t('public.close')}}</el-button>
			</span>
		</el-dialog>
		<!--修改密码弹出层-->
		<el-dialog
			class="userHeader-password-box"
			append-to-body
			:title="$t('header.pwd')"
			:before-close="resetCatchPassWord"
			:visible.sync="dialogVisiblePassWord"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="formItem" label-width="150px">
				<!--用户名-->
				<el-form-item :label="$t('header.userName')+'：'">
					<span>{{formItem.displayName}}</span>
				</el-form-item>
				<!--登录账号-->
				<el-form-item :label="$t('header.LoginAccount')+'：'">
					<span>{{formItem.username}}</span>
				</el-form-item>
				<!--旧登录密码-->
				<el-form-item class="star" :label="$t('header.OldLoginPassword')+'：'">
					<el-input @blur="getPassWord(formItem.oldPassword)" v-model="formItem.oldPassword" type="password"
										class="width200" id="form_oldPassword"/>
					<span class="isNotNull" v-if="formItem.oldPasswordFlag">{{formItem.oldPasswordFlagTip}}</span>
					<span></span>
				</el-form-item>
				<!--新登录密码-->
				<el-form-item class="star" :label="$t('header.NewLoginPassword')+'：'">
					<el-input @blur="rulePassword('new')" type="password" id="form_newPassword" class="width200"
										v-model="formItem.newPassword"/>
					<span class="isNotNull" v-if="formItem.newPasswordFlag">{{formItem.newPasswordFlagTip}}</span>
				</el-form-item>
				<!--确认新登录密码-->
				<el-form-item class="star" :label="$t('header.ConfirmTheNewLoginPassword')+'：'">
					<el-input @blur="rulePassword('affirm')" type="password" id="form_affirmPassword" class="width200"
										v-model="formItem.affirmPassword"/>
					<span class="isNotNull" v-if="formItem.affirmPasswordFlag">{{formItem.affirmPasswordFlagTip}}</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="alertBtn" @click="getSubPassWord">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetCatchPassWord">{{$t('public.close')}}</el-button>
			</span>
		</el-dialog>
		<!--声音告警的播放器定义-->
		<audio style="display: none;" id="headMessageAudio" controls="controls" autoplay>
			<source src="#" type="audio/mp3"/>
		</audio>
		<!--页面弹窗告警信息弹出层-->
		<el-dialog
			class="headMessagePopuWin-dialog"
			append-to-body
			:title="headMessagePopuWinTitle"
			:visible.sync="headMessagePopuWinDialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<div class="messageItem"
					 v-for="item,index in headMessagePopuWinDataList">
				<div class="messageItemTitle">告警信息{{index+1}}</div>
				<div>
					<el-table :data="item.list" :span-method="messageColumnSpanMethod" :row-class-name="messageRowClassName"
										border :show-header="false">
						<el-table-column width="230px" prop="key"/>
						<el-table-column prop="value"/>
					</el-table>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="headMessagePopuWinDialogVisible = false"
									 size="small">{{$t('public.close')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import appSide from '../components/common/appSide';
	import {dateFilter, dateFilterChangeHour} from "../assets/js/filters";
	import {isMobilePhone, isEmail, isNotNull} from "../assets/js/validator";

	export default {
		name: "index",
		components: {appSide},
		data() {
			return {
				rootUrl: this.$api.root(),
				logoImg: this.$api.root() + '/static/sys/logo/logo.png',
				defaultLang: localStorage.getItem('hy-language'), // 默认语言
				displayName: '', // 显示的用户名
				messageNum: '0', // 消息提示
				// 修改密码 表单
				formItem: {
					displayName: '', // 用户名称
					username: '', // 登录账号
					oldPassword: '', // 旧登录密码
					oldPasswordFlag: false, // 旧密码校验标识
					oldPasswordFlagTip: '', // 旧密码校验提示
					newPassword: '', // 新登录密码
					newPasswordFlag: false, // 新密码校验标识
					newPasswordFlagTip: '', // 新密码校验提示
					affirmPassword: '', // 确认新登录密码
					affirmPasswordFlag: false, // 确认新密码校验标识
					affirmPasswordFlagTip: '', // 确认新密码校验提示
				},
				// 修改信息 表单
				queryInfo: {
					displayName: '', // 用户名称
					displayNameFlag: false, // 用户名称校验标识
					displayNameFlagTip: '', // 用户名称错误提示
					userName: '', // 登录账号
					mobile: '', // 手机号
					mobileFlag: false, // 手机号码校验标识
					mobileFlagTip: '', // 手机号码错误提示
					email: '', // 电子邮箱
					emailsFlag: false, // 电子邮箱校验标识
					emailsFlagTip: '',
				},
				//修改头像弹出层
				dialogVisible: false,
				//修改密码弹出层
				dialogVisiblePassWord: false,
				isCollapse: true,
				languageList: [], // 语言列表
				refreshRateMap: {}, // 刷新评率字典
				lastTime: new Date().getTime(),
				//记录登录后已做出提示的信息的map集合，用于判断是否已经提示过
				messagePromptedMap: {},
				messageList: [],
				audioSrc: '',
				audioPrompted: false, //记录是否已经声音提示
				headMessagePopuWinTitle: '',
				headMessagePopuWinDialogVisible: false,
				headMessagePopuWinDataList: [],
				notifyMap: {}, //记录通知的notification集合
				timer: null,
			}
		},
		methods: {
			// 点击头像
			handleCommand(command) {
				var _t = this;
				switch (command) {
					case 'head': // 修改信息
						_t.getInformation();
						break;
					case 'pwd': // 修改密码
						_t.getQueryData();
						break;
					case 'exit': // 退出登录
						_t.$confirm(_t.$t('header.logOutTip'), _t.$t('public.confirmTip'), {
							confirmButtonText: _t.$t('public.confirm'),
							cancelButtonText: _t.$t('public.close'),
							type: 'warning',
							confirmButtonClass: 'alertBtn',
							cancelButtonClass: 'alertBtn'
						}).then(() => {
							_t.$store.commit("setLoading", false);
							_t.$router.push({name: 'Login'});
							window.location.reload();
							localStorage.removeItem('hy-language');
							localStorage.removeItem('hy-menu-id');
							localStorage.removeItem('hy-organization-id');
							localStorage.removeItem('hy-token');
							localStorage.removeItem('hy-user-id');
							localStorage.removeItem('hy-user-name');
							//销毁刷新频率字典避免多次挂载
							localStorage.removeItem('RefreshRateMap');
						}).catch(() => {
							return;
						});
						break;
					default:
						break;
				}
			},
			/**
			 * 修改信息
			 */
			// 获取修改信息
			getInformation() {
				var _t = this;
				_t.dialogVisible = true;
				var userId = localStorage.getItem('hy-user-id');
				_t.$api.get('system/user/' + userId, {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								_t.queryInfo.displayName = res.data.displayName; // 用户名称
								_t.queryInfo.userName = res.data.username; // 登录账号
								_t.queryInfo.mobile = res.data.mobile; // 手机号码
								_t.queryInfo.email = res.data.email; // 电子邮箱
							}
							break;
						default:
							break;
					}
				})
			},
			// 校验用户名称字段
			ruleDisplayName(value) {
				var _t = this;
				if (value === null || value.trim() === '') {
					_t.queryInfo.displayNameFlag = true;
					_t.queryInfo.displayNameFlagTip = _t.$t('public.isNotNull');
					document.getElementById('inputName').style.borderColor = '#fb6041';
				} else {
					_t.queryInfo.displayNameFlag = false;
					_t.queryInfo.displayNameFlagTip = '';
					document.getElementById('inputName').style.borderColor = '#DCDFE6';
				}
			},
			// 校验手机号字段
			ruleMobile(value) {
				var _t = this;
				// 可以为空 有值时需要校验格式
				if (value !== null && value.trim() !== '') {
					if (!value.toString().match(_t.$api.mobileRegular())) {
						_t.queryInfo.mobileFlag = true;
						_t.queryInfo.mobileFlagTip = _t.$t('public.mobileFormatTip');
						document.getElementById('inputMobile').style.borderColor = '#fb6041';
					} else {
						_t.queryInfo.mobileFlag = false;
						_t.queryInfo.mobileFlagTip = '';
						document.getElementById('inputMobile').style.borderColor = '#DCDFE6';
					}
				} else {
					_t.queryInfo.mobileFlag = false;
					_t.queryInfo.mobileFlagTip = '';
					document.getElementById('inputMobile').style.borderColor = '#DCDFE6';
				}
			},
			// 校验邮箱字段
			ruleEmail(value) {
				var _t = this;
				// 可以为空 有值时需要校验格式
				if (value !== null && value.trim() !== '') {
					if (_t.$api.emailRegular().test(value.trim()) === false) {
						_t.queryInfo.emailsFlag = true;
						_t.queryInfo.emailsFlagTip = _t.$t('public.emailFormatTip');
						document.getElementById('inputEmail').style.borderColor = '#fb6041';
					} else {
						_t.queryInfo.emailsFlag = false;
						_t.queryInfo.emailsFlagTip = '';
						document.getElementById('inputEmail').style.borderColor = '#DCDFE6';
					}
				} else {
					_t.queryInfo.emailsFlag = false;
					_t.queryInfo.emailsFlagTip = '';
					document.getElementById('inputEmail').style.borderColor = '#DCDFE6';
				}
			},
			// 重置关闭修改 弹出层
			getInformationClose() {
				var _t = this;
				_t.dialogVisible = false;
				_t.queryInfo.displayName = ''; // 用户名称
				_t.queryInfo.displayNameFlag = false; // 用户名称校验标识
				_t.queryInfo.displayNameFlagTip = ''; // 用户名称错误提示
				_t.queryInfo.mobile = ''; // 手机号
				_t.queryInfo.mobileFlag = false; // 手机号码校验标识
				_t.queryInfo.mobileFlagTip = ''; // 手机号码错误提示
				_t.queryInfo.email = ''; // 电子邮箱
				_t.queryInfo.emailsFlag = false; // 电子邮箱校验标识
				_t.queryInfo.emailsFlagTip = '';
				document.getElementById('inputName').style.borderColor = '#DCDFE6';
				document.getElementById('inputMobile').style.borderColor = '#DCDFE6';
				document.getElementById('inputEmail').style.borderColor = '#DCDFE6';
			},
			//确认修改信息提交
			getInformationSub() {
				var _t = this;
				// 校验用户名称
				_t.ruleDisplayName(_t.queryInfo.displayName);
				// 校验手机号
				_t.ruleMobile(_t.queryInfo.mobile);
				// 校验邮箱
				_t.ruleEmail(_t.queryInfo.email);
				if (_t.queryInfo.displayNameFlag === false
					&& _t.queryInfo.mobileFlag === false
					&& _t.queryInfo.emailsFlag === false) {
					_t.$api.put('system/user/updateUserInfo', {
						systemUser: {
							id: localStorage.getItem('hy-user-id'),
							displayName: _t.queryInfo.displayName === null ? null : (_t.queryInfo.displayName.trim() === '' ? null : _t.queryInfo.displayName.trim()),
							email: _t.queryInfo.email === null ? null : (_t.queryInfo.email.trim() === '' ? null : _t.queryInfo.email.trim()),
							mobile: _t.queryInfo.mobile === null ? null : (_t.queryInfo.mobile.trim() === '' ? null : _t.queryInfo.mobile.trim()),
							languageMark: localStorage.getItem('hy-language'),
						}
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.displayName = _t.queryInfo.displayName;
								localStorage.setItem('hy-user-name', _t.queryInfo.displayName);
								_t.getInformationClose();
								break;
							case 2006: //修改失败
								_t.$alert(_t.$t('header.ModifyTheFailure'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getInformationClose();
								}).catch(() => {
									_t.getInformationClose();
								});
								break;
							case 2100: // 已存在修改内容
								var msg = JSON.parse(res.message);
								// 判断用户名称
								if (msg.displayName && msg.displayName == 0) {
									_t.queryInfo.displayNameFlag = true;
									_t.queryInfo.displayNameFlagTip = _t.$t('header.TheUserNameAlreadyExists');
									document.getElementById('inputName').style.borderColor = '#fb6041';
								}
								// 判断手机号码重复
								if (msg.mobile && msg.mobile == 0) {
									_t.queryInfo.mobileFlag = true;
									_t.queryInfo.mobileFlagTip = _t.$t('header.ThePhoneNumberAlreadyExists');
									document.getElementById('inputMobile').style.borderColor = '#fb6041';
								}
								// 判读邮箱重复
								if (msg.email && msg.email == 0) {
									_t.queryInfo.emailsFlag = true;
									_t.queryInfo.emailsFlagTip = _t.$t('header.ThisMailboxAlreadyExists');
									document.getElementById('inputEmail').style.borderColor = '#fb6041';
								}
								break;
							default:
								break;
						}
					});
				}
			},
			/**
			 * 修改密码
			 */
			// 修改密码 用户信息回显
			getQueryData() {
				var _t = this;
				_t.dialogVisiblePassWord = true;
				var userId = localStorage.getItem('hy-user-id');
				_t.$api.get('system/user/' + userId, {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								_t.formItem.displayName = res.data.displayName;
								_t.formItem.username = res.data.username;
							}
							break;
						default:
							break;
					}
				})
			},
			//修改密码校验
			getPassWord(val) {
				var _t = this;
				if (val !== null && val.trim() !== '') {
					_t.$api.get('system/user/judgeOldPassword', {
						jsonString: JSON.stringify({
							systemUser: {
								id: localStorage.getItem('hy-user-id'),
								oldPassword: _t.$md5(_t.$api.passwordRule() + _t.$md5(val.trim())),
							}
						})
					}, function (res) {
						switch (res.status) {
							case 200:
								// 返回成功 通过 取消全部校验信息
								_t.formItem.oldPasswordFlag = false; // 旧密码校验标识
								document.getElementById('form_oldPassword').style.borderColor = '#DCDFE6';
								break;
							case 2101: //密码校验
								_t.formItem.oldPasswordFlag = true;
								_t.formItem.oldPasswordFlagTip = res.message;
								document.getElementById('form_oldPassword').style.borderColor = '#fb6041';
								break;
							default:
								_t.resetCatchPassWord();
								break;
						}
					});
				} else {
					_t.formItem.oldPasswordFlag = true;
					_t.formItem.oldPasswordFlagTip = _t.$t('public.isNotNull');
					document.getElementById('form_oldPassword').style.borderColor = '#fb6041';
				}
			},
			// 重置修改密码
			resetCatchPassWord() {
				var _t = this;
				_t.dialogVisiblePassWord = false;
				_t.formItem.displayName = ''; // 用户名称
				_t.formItem.username = ''; // 登录账号
				_t.formItem.oldPassword = ''; // 旧登录密码
				_t.formItem.oldPasswordFlag = false; // 旧密码校验标识
				_t.formItem.oldPasswordFlagTip = ''; // 旧密码校验提示
				_t.formItem.newPassword = ''; // 新登录密码
				_t.formItem.newPasswordFlag = false; // 新密码校验标识
				_t.formItem.newPasswordFlagTip = ''; // 新密码校验提示
				_t.formItem.affirmPassword = ''; // 确认新登录密码
				_t.formItem.affirmPasswordFlag = false; // 确认新密码校验标识
				_t.formItem.affirmPasswordFlagTip = ''; // 确认新密码校验提示
				document.getElementById('form_oldPassword').style.borderColor = '#DCDFE6';
				document.getElementById('form_newPassword').style.borderColor = '#DCDFE6';
				document.getElementById('form_affirmPassword').style.borderColor = '#DCDFE6';
			},
			// 新密码失去焦点时校验
			rulePassword(item) {
				var _t = this;
				if (item === 'new') {
					// 新密码 为空
					if (_t.formItem.newPassword === null || _t.formItem.newPassword.trim() === '') {
						_t.formItem.newPasswordFlag = true;
						_t.formItem.newPasswordFlagTip = _t.$t('public.isNotNull');
						document.getElementById('form_newPassword').style.borderColor = '#fb6041';
					} else {
						// 不为空
						if (_t.formItem.newPassword.trim() === _t.formItem.oldPassword.trim()) {
							// 新密码和旧密码一致
							_t.formItem.newPasswordFlag = true;
							_t.formItem.newPasswordFlagTip = _t.$t('header.changeDiffWithNewPassword');
							document.getElementById('form_newPassword').style.borderColor = '#fb6041';
						} else {
							// 新密码和确认新密码不一致
							if (_t.formItem.newPassword.trim() !== _t.formItem.affirmPassword.trim() && _t.formItem.affirmPassword.trim() !== '') {
								_t.formItem.newPasswordFlag = true;
								_t.formItem.newPasswordFlagTip = _t.$t('header.changeDiff');
								document.getElementById('form_newPassword').style.borderColor = '#fb6041';
							} else {
								// 新密码和确认新密码一致
								_t.formItem.newPasswordFlag = false;
								_t.formItem.newPasswordFlagTip = '';
								document.getElementById('form_newPassword').style.borderColor = '#DCDFE6';
								_t.formItem.affirmPasswordFlag = false;
								_t.formItem.affirmPasswordFlagTip = '';
								document.getElementById('form_affirmPassword').style.borderColor = '#DCDFE6';
							}
						}
					}
				} else if (item === 'affirm') {
					if (_t.formItem.affirmPassword === null || _t.formItem.affirmPassword.trim() === '') {
						// 确认新密码 为空
						_t.formItem.affirmPasswordFlag = true;
						_t.formItem.affirmPasswordFlagTip = _t.$t('public.isNotNull');
						document.getElementById('form_affirmPassword').style.borderColor = '#fb6041';
					} else {
						// 确认新密码 不为空
						if (_t.formItem.affirmPassword.trim() === _t.formItem.oldPassword.trim()) {
							// 确认新密码和旧密码一致
							_t.formItem.affirmPasswordFlag = true;
							_t.formItem.affirmPasswordFlagTip = _t.$t('public.isNotNull');
							document.getElementById('form_affirmPassword').style.borderColor = '#fb6041';
						} else {
							// 确认新密码和旧密码不一致
							if (_t.formItem.newPassword.trim() !== _t.formItem.affirmPassword.trim() && _t.formItem.newPassword.trim() !== '') {
								_t.formItem.affirmPasswordFlag = true;
								_t.formItem.affirmPasswordFlagTip = _t.$t('header.changeDiff');
								document.getElementById('form_affirmPassword').style.borderColor = '#fb6041';
							} else {
								// 确认新密码和旧密码 一致
								_t.formItem.newPasswordFlag = false;
								_t.formItem.newPasswordFlagTip = '';
								document.getElementById('form_newPassword').style.borderColor = '#DCDFE6';
								_t.formItem.affirmPasswordFlag = false;
								_t.formItem.affirmPasswordFlagTip = '';
								document.getElementById('form_affirmPassword').style.borderColor = '#DCDFE6';
							}
						}
					}
				}
			},
			//点击确认修改密码
			getSubPassWord() {
				var _t = this;
				// 密码校验
				// 旧密码不能为空
				if (_t.formItem.oldPassword === null || _t.formItem.oldPassword.trim() === '') {
					_t.formItem.oldPasswordFlag = true;
					_t.formItem.oldPasswordFlagTip = _t.$t('public.isNotNull');
					document.getElementById('form_oldPassword').style.borderColor = '#fb6041';
				} else {
					_t.formItem.oldPasswordFlag = false;
					_t.formItem.oldPasswordFlagTip = '';
					document.getElementById('form_oldPassword').style.borderColor = '#DCDFE6';
				}
				// 新密码
				if (_t.formItem.newPassword === null || _t.formItem.newPassword.trim() === '') {
					_t.formItem.newPasswordFlag = true;
					_t.formItem.newPasswordFlagTip = _t.$t('public.isNotNull');
					document.getElementById('form_newPassword').style.borderColor = '#fb6041';
				} else {
					_t.formItem.newPasswordFlag = false;
					_t.formItem.newPasswordFlagTip = '';
					document.getElementById('form_newPassword').style.borderColor = '#DCDFE6';
				}
				// 确认新密码
				if (_t.formItem.affirmPassword === null || _t.formItem.affirmPassword.trim() === '') {
					_t.formItem.affirmPasswordFlag = true;
					_t.formItem.affirmPasswordFlagTip = _t.$t('public.isNotNull');
					document.getElementById('form_affirmPassword').style.borderColor = '#fb6041';
				} else {
					_t.formItem.affirmPasswordFlag = false;
					_t.formItem.affirmPasswordFlagTip = '';
					document.getElementById('form_affirmPassword').style.borderColor = '#DCDFE6';
				}
				// 三项均不为空 校验格式
				if (_t.formItem.newPassword.trim() !== '' && _t.formItem.oldPassword.trim() !== '' && _t.formItem.affirmPassword.trim() !== '') {
					// 校验新密码不能和旧密码一致
					if (_t.formItem.newPassword.trim() === _t.formItem.oldPassword.trim()) {
						// 新密码和旧密码一致
						_t.formItem.newPasswordFlag = true;
						_t.formItem.newPasswordFlagTip = _t.$t('header.changeDiffWithNewPassword');
						document.getElementById('form_newPassword').style.borderColor = '#fb6041';
					} else {
						// 新密码和旧密码不一致
						_t.formItem.newPasswordFlag = false;
						_t.formItem.newPasswordFlagTip = '';
						document.getElementById('form_newPassword').style.borderColor = '#DCDFE6';
						// 校验确认新密码不能和就密码一致
						if (_t.formItem.affirmPassword.trim() === _t.formItem.oldPassword.trim()) {
							// 确认新密码和旧密码一致
							_t.formItem.affirmPasswordFlag = true;
							_t.formItem.affirmPasswordFlagTip = _t.$t('header.changeDiffWithNewPassword');
							document.getElementById('form_affirmPassword').style.borderColor = '#fb6041';
						} else {
							// 确认新密码和旧密码不一致
							_t.formItem.affirmPasswordFlag = false;
							_t.formItem.affirmPasswordFlagTip = '';
							document.getElementById('form_affirmPassword').style.borderColor = '#DCDFE6';
							// 判断新密码和确认新密码是否一致
							if (_t.formItem.newPassword.trim() !== _t.formItem.affirmPassword.trim()) {
								// 校验新密码和确认密码一致问题
								_t.formItem.newPasswordFlag = true;
								_t.formItem.newPasswordFlagTip = _t.$t('header.changeDiff');
								_t.formItem.affirmPasswordFlag = true;
								_t.formItem.affirmPasswordFlagTip = _t.$t('header.changeDiff');
								document.getElementById('form_newPassword').style.borderColor = '#fb6041';
								document.getElementById('form_affirmPassword').style.borderColor = '#fb6041';
							} else {
								_t.formItem.newPasswordFlag = false;
								_t.formItem.newPasswordFlagTip = '';
								document.getElementById('form_newPassword').style.borderColor = '#DCDFE6';
								_t.formItem.affirmPasswordFlag = false;
								_t.formItem.affirmPasswordFlagTip = '';
								document.getElementById('form_affirmPassword').style.borderColor = '#DCDFE6';
							}
						}
					}
					// 校验通过 可以提交
					if (_t.formItem.oldPasswordFlag === false
						&& _t.formItem.newPasswordFlag === false
						&& _t.formItem.affirmPasswordFlag === false) {
						_t.$api.put('system/user/updateUserPassword', {
							systemUser: {
								id: localStorage.getItem('hy-user-id'),
								oldPassword: _t.$md5(_t.$api.passwordRule() + _t.$md5(_t.formItem.oldPassword.trim())),
								newPassword: _t.$md5(_t.$api.passwordRule() + _t.$md5(_t.formItem.newPassword.trim())),
								affirmPassword: _t.$md5(_t.$api.passwordRule() + _t.$md5(_t.formItem.affirmPassword.trim())),
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									// 密码修改成功 推出重新登录
									_t.$confirm(_t.$t('header.changePasswordSuccess') + '!', _t.$t('public.confirmTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										cancelButtonText: _t.$t('public.close'),
										type: 'warning',
										confirmButtonClass: 'alertBtn',
										cancelButtonClass: 'alertBtn'
									}).then(() => {
										_t.$store.commit("setLoading", false);
										_t.$router.push({name: 'login'});
										window.location.reload();
										localStorage.removeItem('hy-language');
										localStorage.removeItem('hy-menu-id');
										localStorage.removeItem('hy-organization-id');
										localStorage.removeItem('hy-token');
										localStorage.removeItem('hy-user-id');
										localStorage.removeItem('hy-user-name');
										//销毁刷新频率字典避免多次挂载
										localStorage.removeItem('RefreshRateMap');
									}).catch(() => {
										_t.$router.push({name: 'login'});
										window.location.reload();
										localStorage.removeItem('hy-language');
										localStorage.removeItem('hy-menu-id');
										localStorage.removeItem('hy-organization-id');
										localStorage.removeItem('hy-token');
										localStorage.removeItem('hy-user-id');
										localStorage.removeItem('hy-user-name');
										//销毁刷新频率字典避免多次挂载
										localStorage.removeItem('RefreshRateMap');
									});
									break;
								case  2101: //您输入的旧密码与原密码不一致
									_t.formItem.oldPasswordFlag = true;
									_t.formItem.oldPasswordFlagTip = res.message;
									document.getElementById('form_oldPassword').style.borderColor = '#fb6041';
									break;
								default:
									_t.resetCatchPassWord();
									break;
							}
						});
					}
				}
			},
			// 切换语言
			changeLanguage(val) {
				var _t = this;
				_t.$api.put('system/language/userSet', {
					userId: localStorage.getItem('hy-user-id'),
					languageMark: _t.defaultLang
				}, function (res) {
					switch (res.status) {
						case 200:
							localStorage.setItem('hy-language', val);
							window.location.reload();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							break;
					}
				});
			},
			// 点击title回到首页
			homePage() {
				this.$router.push({name: 'Home'});
			},
			//跳转到当前告警页面
			toCurrentAlarmPage() {
				this.$router.push({name: 'alarmCurrent'});
			},
			// 获取用户信息
			getData() {
				var _t = this;
				_t.$api.get('login/userInfo', {}, function (res) {
					switch (res.status) {
						case 200:
							localStorage.setItem('hy-user-name', res.data.displayName);
							localStorage.setItem('hy-language', res.data.languageMark);
							localStorage.setItem('hy-organization-id', res.data.organizationId);
							localStorage.setItem('hy-user-id', res.data.id);
							_t.queryInfo.userName = res.data.username;
							_t.displayName = res.data.displayName;
							_t.defaultLang = res.data.languageMark;
							//用户信息拿回来之后开始获取刷新频率进行页面定时器的设置
							_t.getRefreshRateMap();
							// 拿到用户信息之后组件传值 调取便捷菜案
							_t.$bus.emit('getMenu', true);
							_t.$bus.emit('getMenuData', true);
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							break;
					}
				});
			},
			// 获取当前支持的语言
			getLanguage() {
				var _t = this;
				_t.$api.get('system/language/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.languageList = res.data.list === null ? [] : res.data.list;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							break;
					}
				});
			},
			//获取页面的相关刷新频率
			getRefreshRateMap() {
				var _t = this;
				_t.$api.get('system/basedata/refreshRateMap', {
					jsonString: JSON.stringify({
						languageMark: localStorage.getItem('hy-language')
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.refreshRateMap = res.data.RefreshRate;
							localStorage.setItem('RefreshRateMap', JSON.stringify(_t.refreshRateMap));

							//执行定时获取通知消息
							_t.messageInterval();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.refreshRateMap = {};
							break;
					}
				});
			},
			// 消息定时获取
			messageInterval() {
				var _t = this;
				//获取设备发现接口的频率
				var rate = 5 * 60; //默认5分钟
				if (null != _t.refreshRateMap && undefined != _t.refreshRateMap) {
					var rateMap = _t.refreshRateMap['RefreshRate-Message'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5 * 60; //都为空时默认5分钟
						}
					}
				}
				// 定时器防止密集访问
				_t.timer = setInterval(() => {
					var nowTime = new Date().getTime();
					//允许 10 毫秒的误差
					if ((nowTime - _t.lastTime) >= (rate * 1000 - 10)) {
						//记录当前执行的时间
						_t.lastTime = nowTime;

						_t.getMessage();
					}
				}, rate * 1000);
			},
			// 获取消息列表
			getMessage() {
				var _t = this;
				_t.audioPrompted = false; //初始本次获取的音频文件未播放
				_t.$api.get('alarm/noticeSoundOrPopupwin/pagelist', {
					jsonString: JSON.stringify({
						alarmNoticeSoundOrPopupwin: {
							//从本地缓存中读取当前登录用户的ID
							userId: localStorage.getItem('hy-user-id'),
							//读取状态【0待读取，1已读取】
							readStatus: 0,
							//设置查询的开始时间为当前时间之前的2个小时
							createTimeStart: dateFilterChangeHour(new Date().getTime(), -2),
							//设置查询的结束时间为当前时间
							createTimeEnd: dateFilter(new Date().getTime())
						},
						currentPage: 1,
						pageSize: 20
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var resData = res.data;
							_t.messageList = resData.list === null ? [] : resData.list;
							_t.messageNum = 0;//默认消息数量为0
							if (undefined != _t.messageList && null != _t.messageList && _t.messageList.length > 0) {
								_t.messageNum = _t.messageList.length;
								//记录一下音频消息的Id
								var soundList = new Array();
								//记录一下弹窗消息的Id
								var winList = new Array();
								for (var i = 0; i < _t.messageList.length; i++) {
									var message = _t.messageList[i];

									var _map = _t.messagePromptedMap[message.id];
									if (undefined != _map && null != _map) {
										//退出循环
										continue;
									}
									//增加到已提示map集合
									_t.messagePromptedMap[message.id] = message;
									if ('3' == message.noticeWay || 3 == message.noticeWay) {
										//记录音频消息的ID
										soundList.push(message.id);
										//组装音频文件路径
										_t.audioSrc = _t.rootUrl + message.soundPath;
										//同一次获取的声音提示列表，播放一次就好，以免连续有一堆声音提示时一直播放惹用户反感
										if (!_t.audioPrompted) {
											//获取audio媒体
											var audio = document.getElementById("headMessageAudio");
											audio.pause();
											//设置新的音频文件
											audio.src = _t.audioSrc;
											//进行重新加载
											audio.load();
											_t.audioPrompted = true; //标记本次获取的数据已经播放过声音
										}
									} else if ('4' == message.noticeWay || 4 == message.noticeWay) {
										//记录一下弹窗消息的Id
										winList.push(message.id);

										//展示页面弹窗的告警信息
										_t.showAlarmContent(message.id);
										/*
                                        var notify = _t.$notify({
                                            title: '警告',
                                            message: "<a id='message_" + message.id + "' href='javascript:;' title='点击查看“" +message.alarmAbstract + "”'>" +message.alarmAbstract + "</a>",
                                            dangerouslyUseHTMLString: true,
                                            position: 'bottom-right',
                                            type: 'warning',
                                            offset: 50,
                                            duration: 0
                                        });

                                        _t.notifyMap[message.id] = notify;

                                        document.getElementById("message_"+message.id).onclick = function () {
                                            var domId = this.id;
                                            var messageId = domId.substring(domId.indexOf('_')+1);

                                            //展示页面弹窗的告警信息
                                            _t.showAlarmContent(messageId);

                                            //关掉本notification的弹窗
                                            _t.notifyMap[messageId].close();

                                            _t.setMessageReadStatus(null, messageId);
                                        }
                                        */
									}
								}
								if (null != soundList && soundList.length > 0) {
									_t.setMessageReadStatus(soundList, null);
								}
								if (null != winList && winList.length > 0) {
									_t.setMessageReadStatus(winList, null);
								}
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.messageList = [];
							break;
					}
				});
			},
			//设置消息为已读
			setMessageReadStatus(soundList, winId) {
				var _t = this;
				var ids = new Array();
				if (soundList) {
					soundList.forEach((val) => {
						ids.push(val);
					});
				}
				if (winId) {
					ids.push(winId);
				}
				_t.$api.post('alarm/noticeSoundOrPopupwin/setRead', {
					ids: ids
				}, function (res) {
					switch (res.status) {
						case 200:
							/*
                            _t.$message({
                                message: '告警提示信息已经成功设置为已读！',
                                type: 'success'
                            });
                            */
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							break;
					}
				});
			},
			//展示告警内容
			showAlarmContent(id) {
				var _t = this;
				//告警ID为空时退出方法
				if (null == id || undefined == id) {
					return;
				}
				var _map = _t.messagePromptedMap[id];
				if (undefined != _map && null != _map) {
					//设置弹窗的标题
					_t.headMessagePopuWinTitle = "设备告警";

					//解析 result 字段中的 json 串
					var resultContentArr = JSON.parse(_map.popuwinContent);
					var listArr = new Array();

					var closeObj = resultContentArr['close'];
					if (null != closeObj && undefined != closeObj) {
						listArr.push({key: "关闭操作", value: "colspan-close"});
						listArr = listArr.concat(_t.messagePackaging(closeObj));
					}
					var reportObj = resultContentArr['report'];
					if (null != reportObj && undefined != reportObj) {
						listArr.push({key: "报修操作", value: "colspan-report"});
						listArr = listArr.concat(_t.messagePackaging(reportObj));
					}
					var commentObj = resultContentArr['comment'];
					if (null != commentObj && undefined != commentObj) {
						listArr.push({key: "评注操作", value: "colspan-comment"});
						listArr = listArr.concat(_t.messagePackaging(commentObj));
					}
					var confirmObj = resultContentArr['confirm'];
					if (null != confirmObj && undefined != confirmObj) {
						listArr.push({key: "报修确认", value: "colspan-confirm"});
						listArr = listArr.concat(_t.messagePackaging(confirmObj));
					}
					var alarmObj = resultContentArr['alarm'];
					if (null != alarmObj && undefined != alarmObj) {
						listArr.push({key: "告警信息", value: "colspan-alarm"});
						listArr = listArr.concat(_t.messagePackaging(alarmObj));
					}
					var deviceObj = resultContentArr['device'];
					if (null != deviceObj && undefined != deviceObj) {
						listArr.push({key: "设备信息", value: "colspan-device"});
						listArr = listArr.concat(_t.messagePackaging(deviceObj));
					}

					//设置弹窗的数据
					_t.headMessagePopuWinDataList.push({"name": "", "createTime": _map.createTime, "list": listArr});

					//显示告警内容弹窗
					_t.headMessagePopuWinDialogVisible = true;
				}
			},
			//消息的组装
			messagePackaging(_msg) {
				if (null == _msg || undefined == _msg) {
					return;
				}
				var listArr = new Array();
				for (var _key in _msg) {
					var _obj = new Object();
					_obj.key = _key;
					_obj.value = _msg[_key];
					listArr.push(_obj);
				}
				return listArr;
			},
			//消息行的合并列
			messageColumnSpanMethod({row, column, rowIndex, columnIndex}) {
				if ('colspan-close' == row.value || 'colspan-report' == row.value ||
					'colspan-comment' == row.value || 'colspan-confirm' == row.value ||
					'colspan-alarm' == row.value || 'colspan-device' == row.value) {
					return {
						rowspan: 1,
						colspan: 2
					};
				} else {
					return {
						rowspan: 1,
						colspan: 1
					};
				}
			},
			//消息行的内容hightlight
			messageRowClassName({row, rowIndex}) {
				if ('colspan-close' == row.value || 'colspan-report' == row.value ||
					'colspan-comment' == row.value || 'colspan-confirm' == row.value ||
					'colspan-alarm' == row.value || 'colspan-device' == row.value) {
					return 'highlight-row';
				}
				return 'common-row';
			},
		},
		created() {
			var _t = this;
			_t.$store.commit('setLoading', true);
			_t.getData();
			_t.getLanguage();
			// 系统支持语言改变之后重新获取语言列表
			_t.$bus.on('getLanguage', (val) => {
				if (val) {
					_t.getLanguage();
				}
			});
		},
		beforeDestroy() {
			var _t = this;
			// 销毁定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style scoped>
	.userName-span {
		height: 50px;
		line-height: 50px;
		display: inline-block;
		min-width: 30px;
	}
</style>
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

	.app-header-logo > .logo-box {
		height: 52px;
		padding: 4px 6px;
	}

	.app-header-logo > .logo-box img {
		height: 100%;
	}

	.app-header-logo > .logo-box,
	.app-header-logo > span {
		vertical-align: middle;
	}

	.app-header-navBar {
		line-height: 52px;
	}

	.app-header-navBar li {
		float: left;
		margin-right: 20px;
		max-height: 52px;
	}

	.app-header-navBar li:first-child {
		margin-right: 10px;
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

	.userHeader-photo-box .el-dialog {
		width: 500px;
		height: 400px;
	}

	.userHeader-password-box .el-dialog {
		width: 500px;
		height: 400px;
	}

	.headMessagePopuWin-dialog .el-dialog {
		width: 800px;
		height: 550px;
	}

	.headMessagePopuWin-dialog .el-dialog .messageItem {
		border: 2px solid #f6f8fa;
		padding: 5px;
		margin-bottom: 20px;
		box-shadow: 2px 2px 10px #e6e6e6;
	}

	.headMessagePopuWin-dialog .el-dialog .messageItemTitle {
		font-size: 18px;
		border-image: initial;
		margin: 5px auto;
		padding: 5px 0px !important;
		text-align: left;
		font-weight: bold;
	}

	.headMessagePopuWin-dialog .el-table .highlight-row {
		background: #f6f8fa;
	}

	.headMessagePopuWin-dialog .el-table .highlight-row td {
		height: auto !important;
		line-height: initial !important;
		font-weight: bold;
	}

	.headMessagePopuWin-dialog .el-table .common-row {
		background: #FFF;
	}

	.headMessagePopuWin-dialog .el-table .common-row td {
		height: auto !important;
		line-height: initial !important;
	}

	.headMessagePopuWin-dialog .el-table .common-row td:first-child div.cell {
		text-indent: 20px;
	}

	.headMessagePopuWin-dialog .el-table .common-row td:last-child div.cell {
		white-space: inherit !important;
	}
</style>
