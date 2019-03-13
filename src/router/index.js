import Vue from 'vue';
import Router from 'vue-router';
// 首页
import Index from '@/page/Index';
// 登录页
import Login from '@/page/login';
// Home页
const Home = () => import ('@/page/pages/Home');
// 系统设置页面
const systemSettings = () => import ('@/components/systemSettings');
// 许可证信息管理
const licenseInformation = () => import ('@/page/pages/licenseInformation');
// 平台信息设置
const platformInformation = () => import ('@/page/pages/platformInformation');
// License到期通知
const licenseNotice = () => import ('@/page/pages/licenseNotice');

Vue.use(Router);
export default new Router({
  routes: [
    // 首页重定向
    {path: "/", redirect: "/YUser/index"},
    {path: "/YUser", redirect: "/YUser/index"},
    {path: '/YUser', name: 'index', component: Index,
      children:[
        {path: "/YUser/index", name: 'Home', component: Home},
        {path: "/YUser/systemSettings", redirect: "/YUser/systemSettings/licenseInformation"},
        {path: "/YUser/systemSettings", name: 'systemSettings', component: systemSettings,
          children:[
            {path: "/YUser/systemSettings/licenseInformation", name: 'licenseInformation', component: licenseInformation},
            {path: "/YUser/systemSettings/platformInformation", name: 'platformInformation', component: platformInformation},
            {path: "/YUser/systemSettings/licenseNotice", name: 'licenseNotice', component: licenseNotice}
          ]
        }
      ]
    },
    {path:'/login', name:'Login', component:Login}
  ]
});
