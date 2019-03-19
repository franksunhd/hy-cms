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
// 平台语言设置
const platformLanguage = () => import ('@/page/pages/platformLanguage');
// 数据字典管理
const dataDictionary = () => import ('@/page/pages/dataDictionary');
// License到期通知
const licenseNotice = () => import ('@/page/pages/licenseNotice');
// 接口访问测试
const interfaceTest = () => import ('@/page/pages/interfaceTest');
// 用户维护
const userMaintenance = () => import ('@/page/pages/userMaintenance');
// 角色维护
const roleMaintenance = () => import ('@/page/pages/roleMaintenance');
// 组织维护
const organizeMaintenance = () => import ('@/page/pages/organizeMaintenance');
// 数据库备份
const dataBaseBackUp = () => import ('@/page/pages/dataBaseBackUp');
// 备份定时器
const backUpTimer = () => import ('@/page/pages/backUpTimer');
// 数据库还原
const dataBaseRestore = () => import ('@/page/pages/dataBaseRestore');

Vue.use(Router);
export default new Router({
  routes: [
    // 首页重定向
    {path: "/", redirect: "/YUser/index"},
    {path: "/YUser", redirect: "/YUser/index"},
    {path: '/YUser', name: 'index', component: Index,
      children:[
        {path: "/YUser/index", name: 'Home', component: Home},
        {path: "/YUser/systemSettings", redirect: "/YUser/systemSettings/licenseInformation", name: 'systemSettings', component: systemSettings,
          children:[
            {path: "/YUser/systemSettings/licenseInformation", name: 'licenseInformation', component: licenseInformation},
            {path: "/YUser/systemSettings/platformInformation", name: 'platformInformation', component: platformInformation},
            {path: "/YUser/systemSettings/platformLanguage", name: 'platformLanguage', component: platformLanguage},
            {path: "/YUser/systemSettings/dataDictionary", name: 'dataDictionary', component: dataDictionary},
            {path: "/YUser/systemSettings/licenseNotice", name: 'licenseNotice', component: licenseNotice},
            {path: "/YUser/systemSettings/interfaceTest", name: 'interfaceTest', component: interfaceTest},
            {path: "/YUser/systemSettings/userMaintenance", name: 'userMaintenance', component: userMaintenance},
            {path: "/YUser/systemSettings/roleMaintenance", name: 'roleMaintenance', component: roleMaintenance},
            {path: "/YUser/systemSettings/organizeMaintenance", name: 'organizeMaintenance', component: organizeMaintenance},
            {path: "/YUser/systemSettings/dataBaseBackUp", name: 'dataBaseBackUp', component: dataBaseBackUp},
            {path: "/YUser/systemSettings/backUpTimer", name: 'backUpTimer', component: backUpTimer},
            {path: "/YUser/systemSettings/dataBaseRestore", name: 'dataBaseRestore', component: dataBaseRestore},
          ]
        },
        {
          path: "/YUser/systemSettingsAlert", redirect: "/YUser/systemSettingsAlert/organizeMaintenance", name: 'systemSettingsAlert', component: systemSettings,
          children:[
            {path: "/YUser/systemSettingsAlert/organizeMaintenance", name: 'organizeMaintenance', component: organizeMaintenance},
          ]
        }
      ]
    },
    {path:'/login', name:'Login', component:Login}
  ]
});
