// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuex from 'vuex';
import api from './config/api.js';
import ElementUI from 'element-ui';
import i18n from './page/lang/index';
import pages from './components/pages';
import VueDND from 'awe-dnd';
import echarts from 'echarts';
import md5 from 'js-md5';
import * as custom from './assets/js/filters';
import tagsview from './assets/js/tagsview';
import getters from './assets/js/getters';
import vueBus from 'vue-bus';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.css';
import './assets/css/common.css';
import './assets/css/skin/base-default.css';
import 'babel-polyfill';
import './assets/css/fontStyle.css';


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
  name.$alert(message, '温馨提示', {
    confirmButtonText: '确定',
    type: 'warning',
    callback: action => {
      name.$store.commit("setLoading", false);
      name.$router.push({name: 'Login'});
      localStorage.removeItem('hy-language');
      localStorage.removeItem('hy-menu-id');
      localStorage.removeItem('hy-organization-id');
      localStorage.removeItem('hy-token');
      localStorage.removeItem('hy-user-id');
      localStorage.removeItem('hy-user-name');
    }
  });
};

const store = new Vuex.Store({
  state: {
    loading: false,
  },
  modules: {
    tagsview
  },
  getters,
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
    "$route": 'checkLogin'
  },
  methods: {
    // 检查是否登录
    checkLogin() {
      if (!this.getCookie('tokenID')) {
        this.$store.commit("setLoading", false);
        this.$router.push({name: 'Login'});
        localStorage.removeItem('hy-language');
        localStorage.removeItem('hy-menu-id');
        localStorage.removeItem('hy-organization-id');
        localStorage.removeItem('hy-token');
        localStorage.removeItem('hy-user-id');
        localStorage.removeItem('hy-user-name');
      }
    }
  }
});

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
