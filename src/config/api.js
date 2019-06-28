import axios from 'axios';
import ElementUI from 'element-ui';
import router from '../router';
import i18n from '../page/lang/index';
import store from '../main';
import 'element-ui/lib/theme-chalk/index.css';

//在../static/config.js中配置相应路径
var root = config.apiRoot;

// var root = "http://127.0.0.1/web";   //正式环境
// var root = "http://192.168.0.9/webapi";   //测试环境内网

// 监测阀值 设备logo地址
var deviceLogo = root;

// 校验手机号的正则
var mobileRegular = /^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/;
// 校验邮箱正则
var emailRegular = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
// 校验是否全部为数字
var isNumber = /^([0-9]+$)$/;
// 校验是否double类型数字
var isDouble = /^\d+(\.\d+)?$/;
// 校验ip地址
var ipNumber = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
// 校验菜单路径
var menuHref = /^([{},a-zA-Z0-9.:#/?&_%\/-]+$)$/;
// 允许上传的图片格式
var imgType = 'image/jpeg, image/jpg, image/png';
// 全局密码加密规则
var passwordRule = 'begin1$2%3=4#5$6end';
// 校验钱的格式 是否正确
var isMoneyNumber = /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/;
// 校验mac地址 是否正确
var isMacNumber = /^([A-Fa-f0-9]{2}[-,:]){5}[A-Fa-f0-9]{2}$/;

function apiAxios(method, url, params, success) {
	// 接口添加 时间戳参数 防止调用缓存
	params.timestamp = new Date().getTime();
	axios({
		method: method,
		url: url,
		data: method === 'POST' || method === 'PUT' ? params : null,
		params: method === 'GET' || method === 'DELETE' ? params : null,
		baseURL: root,
		withCredentials: false,  // cookie
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'token': localStorage.getItem('hy-token') || '',
		},
	}).then(function (res) {
		// license到期
		if (res.data.status === 1007) {
			localStorage.setItem('hy-license', false);
			router.push({name: 'licenseExpired'});
			localStorage.removeItem('hy-language');
			localStorage.removeItem('hy-menu-id');
			localStorage.removeItem('hy-organization-id');
			localStorage.removeItem('hy-token');
			localStorage.removeItem('hy-user-id');
			localStorage.removeItem('hy-user-name');
			//销毁刷新频率字典避免多次挂载
			localStorage.removeItem('RefreshRateMap');
		} else if (res.data.status === 1003 || res.data.status === 1004 || res.data.status === 1005 || res.data.status === 1006) {
			// 1003 无操作权限 1004 登录过期 1005 token过期 1006 token不通过
			var language = localStorage.getItem('hy-language') || 'zh_CN';
			var isReturn = document.body.getAttribute('data-return');
			if (isReturn === false || isReturn === 'false' || isReturn === null) {
				document.body.setAttribute('data-return', true);
				store.store().state.loading = false;
				ElementUI.MessageBox.alert(res.data.message, i18n.messages[language].public.confirmTip, {
					confirmButtonText: i18n.messages[language].public.confirm,
					confirmButtonClass: 'alertBtn',
					type: 'warning',
				}).then(() => {
					router.push({name: 'Login'});
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
			}
		} else {
			if (success) {
				success(res.data);
			}
		}
	}).catch(function (err) {
		if (err != undefined && err.response != undefined && err.response.status === 504) {
			//若HTTP请求的状态为504，并且访问路经除了设备、机房、机柜excel导入功能的toStartValidateData接口外，其他访问均执行超时提示
			if ((url === "asset/assetDevice/toStartValidateData" ||
				url === "asset/assetRack/toStartValidateData" ||
				url === "asset/serverRoom/toStartValidateData")) {
				return;
			} else {
				var language = localStorage.getItem('hy-language') || 'zh_CN';
				var isReturn = document.body.getAttribute('data-return');
				if (isReturn === 'false' || isReturn === false || isReturn === null) {
					document.body.setAttribute('data-return', true);
					ElementUI.MessageBox.alert(i18n.messages[language].public.networkTimeOut, i18n.messages[language].public.resultTip, {
						confirmButtonText: i18n.messages[language].public.confirm,
						confirmButtonClass: 'alertBtn'
					}).then(() => {
						router.replace({name: 'Login'});
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
						router.replace({name: 'Login'});
						// window.location.reload();
						localStorage.removeItem('hy-language');
						localStorage.removeItem('hy-menu-id');
						localStorage.removeItem('hy-organization-id');
						localStorage.removeItem('hy-token');
						localStorage.removeItem('hy-user-id');
						localStorage.removeItem('hy-user-name');
						//销毁刷新频率字典避免多次挂载
						localStorage.removeItem('RefreshRateMap');
					});
				}
			}
		}

		return;
	});
}

// 返回在vue模板中的调用接口
export default {
	// 查询
	get: function (url, params, success) {
		return apiAxios('GET', url, params, success);
	},
	// 修改
	post: function (url, params, success) {
		return apiAxios('POST', url, params, success);
	},
	// 更新
	put: function (url, parmas, success) {
		return apiAxios('PUT', url, parmas, success);
	},
	// 删除
	delete: function (url, params, success) {
		return apiAxios('DELETE', url, params, success);
	},
	// 手机正则
	mobileRegular: function () {
		return mobileRegular;
	},
	// 邮箱正则
	emailRegular: function () {
		return emailRegular;
	},
	// 数字正则
	isNumber: function () {
		return isNumber;
	},
	// double正则
	isDouble: function () {
		return isDouble;
	},
	// ip正则
	isIpNumber: function () {
		return ipNumber;
	},
	// 菜单路径
	menuHref: function () {
		return menuHref;
	},
	// 监测阀值设备logo地址
	deviceLogo: function () {
		return deviceLogo;
	},
	// 试听音频文件
	root: function () {
		return root;
	},
	// 图片类型
	imgType: function () {
		return imgType;
	},
	// 密码加密规则
	passwordRule: function () {
		return passwordRule;
	},
	// 校验 金额
	isMoneyNumber: function () {
		return isMoneyNumber;
	},
	// 校验mac地址
	isMacNumber: function () {
		return isMacNumber;
	}
}
