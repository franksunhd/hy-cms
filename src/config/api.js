import axios from 'axios';
import ElementUI from 'element-ui';
import router from '../router';
import i18n from '../page/lang/index';
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
// 校验ip地址
var ipNumber = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
// 校验菜单路径
var menuHref = /^([{},a-zA-Z0-9.:#/?&_%\/-]+$)$/;

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
		if (success) {
			success(res.data);
		}
	}).catch(function (err) {
		var language = localStorage.getItem('hy-language') || 'zh_CN';
		var isReturn = document.body.getAttribute('data-return');
		if (isReturn === 'false' || isReturn === false || isReturn === null) {
			document.body.setAttribute('data-return', true);
			ElementUI.MessageBox.alert(i18n.messages[language].public.networkTimeOut,i18n.messages[language].public.resultTip,{
				confirmButtonText: i18n.messages[language].public.confirm,
				confirmButtonClass: 'alertBtn'
			}).then(()=>{
				router.replace({name:'Login'});
				window.location.reload();
				localStorage.removeItem('hy-language');
				localStorage.removeItem('hy-menu-id');
				localStorage.removeItem('hy-organization-id');
				localStorage.removeItem('hy-token');
				localStorage.removeItem('hy-user-id');
				localStorage.removeItem('hy-user-name');
				//销毁刷新频率字典避免多次挂载
				localStorage.removeItem('RefreshRateMap');
			}).catch(()=>{
				router.replace({name:'Login'});
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
	}
}
