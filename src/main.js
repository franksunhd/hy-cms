// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuex from 'vuex';
// 配置接口
import api from './config/api.js';
// 引入elementUI框架
import ElementUI from 'element-ui';
// 引入国际化语言
import i18n from './page/lang/index';
// 引入分页
import pages from './components/common/pages';
// 左侧导航拖拽
import VueDND from 'awe-dnd';
// 引入echarts
import echarts from 'echarts';
// 引入md5加密
import md5 from 'js-md5';
// 引入过滤器
import * as custom from './assets/js/filters';
// bus传值
import vueBus from 'vue-bus';
// 设备监测 --> 右键组件 (暂时不用)
import VueContextMenu from '@xunlei/vue-context-menu'
// elementUI css样式
import 'element-ui/lib/theme-chalk/index.css';
// 全局格式化css样式
import './assets/css/base.css';
// 全局公用的css样式
import './assets/css/common.css';
// 默认皮肤
import './assets/css/skin/base-default.css';
// 解决vue ie兼容
import 'babel-polyfill';
// 字体图标库 字体编码引用
import './assets/css/fontStyle.css';
// 字体图标库 类名方式引用
import './assets/font/iconfont.css';

// 富文本编辑器
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

// 使用
Vue.use(VueContextMenu);
Vue.use(Vuex);
Vue.use(VueDND);
Vue.use(vueBus);
Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
});

Vue.config.productionTip = false;
Vue.prototype.getCookie = getCookie;
Vue.prototype.setCookie = setCookie;
Vue.prototype.delCookie = delCookie;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;
Vue.prototype.$md5 = md5;
Vue.component('pages', pages);
Object.keys(custom).forEach(key => {
	Vue.filter(key, custom[key])
});

// 用户过期
Vue.prototype.exclude = (name, message) => {
	var isReturn = document.body.getAttribute('data-return');
	if (isReturn == 'false' || isReturn === null) {
		document.body.setAttribute('data-return', true);
		name.$alert(message, name.$t('public.confirmTip'), {
			confirmButtonText: name.$t('public.confirm'),
			confirmButtonClass: 'alertBtn',
			type: 'warning',
			callback: action => {
				name.$store.commit("setLoading", false);
				name.$router.push({name: 'Login'});
				window.location.reload();
				localStorage.removeItem('hy-language');
				localStorage.removeItem('hy-menu-id');
				localStorage.removeItem('hy-organization-id');
				localStorage.removeItem('hy-token');
				localStorage.removeItem('hy-user-id');
				localStorage.removeItem('hy-user-name');
				//销毁刷新频率字典避免多次挂载
				localStorage.removeItem('RefreshRateMap');
			}
		});
	}

};

// vuex
const store = new Vuex.Store({
	state: {
		loading: false,
	},
	mutations: {
		setLoading(state, value) {
			state.loading = value;
		}
	}
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	i18n,
	components: {App},
	template: '<App/>',
	watch: {
		"$route": 'checkLicense'
	},
	methods: {
		// 检查是否登录
		checkLogin() {
			if (!localStorage.getItem('hy-token')) {
				this.$store.commit("setLoading", false);
				this.$router.push({name: 'Login'});
				window.location.reload();
				localStorage.removeItem('hy-language');
				localStorage.removeItem('hy-menu-id');
				localStorage.removeItem('hy-organization-id');
				localStorage.removeItem('hy-token');
				localStorage.removeItem('hy-user-id');
				localStorage.removeItem('hy-user-name');
				//销毁刷新频率字典避免多次挂载
				localStorage.removeItem('RefreshRateMap');
			}
		},
		// 检查license
		checkLicense() {
			var _t = this;
			if (localStorage.getItem('hy-license') === null
				|| localStorage.getItem('hy-license') === 'null'
				|| localStorage.getItem('hy-license') === false
				|| localStorage.getItem('hy-license') === 'false') {
				_t.$router.push({name: 'licenseExpired'});
			} else if (localStorage.getItem('hy-license') === true || localStorage.getItem('hy-license') === 'true') {
				_t.checkLogin();
			}
		}
	}
});

// 导出store对象 在api.js axios 中调用
export default {
	store:function () {
		return store;
	}
}

// 获取cookie
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

// 设置cookie 有效期为30天
function setCookie(name, value, days) {
	var exp = new Date();
	exp.setDate(exp.getDate() + days);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

// 删除 cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = this.getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
