import Vue from 'vue';
import Router from 'vue-router';
// 首页
import Index from '@/page/Index';
// 登录页
import Login from '@/page/login';
// Home页
const Home = () => import ('@/page/pages/Home');
//树形穿梭框
const selectTree = () => import ('@/components/selectTree');
// 系统设置页面
const systemSettings = () => import ('@/components/systemSettings');
// 系统监测页面
const systemSettingsMonitoring = () => import ('@/components/systemSettingsMonitoring');
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
// 节点组维护
const nodeGroupMaintenance = () => import ('@/page/pages/nodeGroupMaintenance');
// 功能菜单维护
const functionMenuMaintenance = () => import ('@/page/pages/functionMenuMaintenance');
// 采集节点管理
const acquisitionNodeManagement = () => import ('@/page/pages/acquisitionNodeManagement');
// 采集任务分配
const collectionTaskAssignment = () => import ('@/page/pages/collectionTaskAssignment');
// 采集节点状态
const acquisitionNodeState = () => import ('@/page/pages/acquisitionNodeState');
// 登录日志
const loginLog = () => import ('@/page/pages/loginLog');
// 操作日志
const operationLog = () => import ('@/page/pages/operationLog');
// 任务日志
const jobLog = () => import ('@/page/pages/jobLog');
// 通知日志
const notificationLog = () => import ('@/page/pages/notificationLog');
// 检测日志
const testLog = () => import ('@/page/pages/testLog');
// web应用
const WebApplication = () => import ('@/page/pages/WebApplication');
// 数据库应用
const DatabaseApplication = () => import ('@/page/pages/DatabaseApplication');
//采集器应用
const CollectorApplication = () => import ('@/page/pages/CollectorApplication');
//设备手动发现
const DeviceManualDetection = () => import ('@/page/pages/DeviceManualDetection');
//开始发现
const BeganToSee = () => import ('@/page/pages/BeganToSee');
//监测管理
const monitoringAndControl = () => import ('@/page/pages/monitoringAndControl');
// 告警管理
const alarmManagement = () => import ('@/page/pages/alarmManagement');
// 当前告警
const alarmCurrent = () => import ('@/page/pages/alarmCurrent');

Vue.use(Router);
export default new Router({
  routes: [
    // 首页重定向
    {path: "/", redirect: "/YUser/index"},
    {path: "/YUser", redirect: "/YUser/index"},
    {
      path: '/YUser', name: 'index', component: Index, children: [
        {path: "/YUser/index", name: 'Home', component: Home},
        {
          path: "/YUser/systemSettings",
          redirect: "/YUser/systemSettings/licenseInformation",
          name: 'systemSettings',
          component: systemSettings,
          children: [
            {
              path: "/YUser/systemSettings/licenseInformation",
              name: 'licenseInformation',
              component: licenseInformation
            },
            {
              path: "/YUser/systemSettings/platformInformation",
              name: 'platformInformation',
              component: platformInformation
            },
            {path: "/YUser/systemSettings/platformLanguage", name: 'platformLanguage', component: platformLanguage},
            {path: "/YUser/systemSettings/dataDictionary", name: 'dataDictionary', component: dataDictionary},
            {path: "/YUser/systemSettings/licenseNotice", name: 'licenseNotice', component: licenseNotice},
            {path: "/YUser/systemSettings/interfaceTest", name: 'interfaceTest', component: interfaceTest},
            {path: "/YUser/systemSettings/userMaintenance", name: 'userMaintenance', component: userMaintenance},
            {path: "/YUser/systemSettings/roleMaintenance", name: 'roleMaintenance', component: roleMaintenance},
            {
              path: "/YUser/systemSettings/organizeMaintenance",
              name: 'organizeMaintenance',
              component: organizeMaintenance
            },
            {path: "/YUser/systemSettings/dataBaseBackUp", name: 'dataBaseBackUp', component: dataBaseBackUp},
            {path: "/YUser/systemSettings/backUpTimer", name: 'backUpTimer', component: backUpTimer},
            {path: "/YUser/systemSettings/dataBaseRestore", name: 'dataBaseRestore', component: dataBaseRestore},
            {
              path: "/YUser/systemSettings/nodeGroupMaintenance",
              name: 'nodeGroupMaintenance',
              component: nodeGroupMaintenance
            },
            {
              path: "/YUser/systemSettings/functionMenuMaintenance",
              name: 'functionMenuMaintenance',
              component: functionMenuMaintenance
            },
            {
              path: "/YUser/systemSettings/acquisitionNodeManagement",
              name: 'acquisitionNodeManagement',
              component: acquisitionNodeManagement
            },
            {
              path: "/YUser/systemSettings/collectionTaskAssignment",
              name: 'collectionTaskAssignment',
              component: collectionTaskAssignment
            },
            {
              path: "/YUser/systemSettings/acquisitionNodeState",
              name: 'acquisitionNodeState',
              component: acquisitionNodeState
            },
            {path: "/YUser/systemSettings/loginLog", name: 'loginLog', component: loginLog},
            {path: "/YUser/systemSettings/operationLog", name: 'operationLog', component: operationLog},
            {path: "/YUser/systemSettings/jobLog", name: 'jobLog', component: jobLog},
            {path: "/YUser/systemSettings/notificationLog", name: 'notificationLog', component: notificationLog},
            {path: "/YUser/systemSettings/testLog", name: 'testLog', component: testLog},
          ]
        },
        {
          path: "/YUser/systemSettingsMonitoring",
          redirect: "/YUser/systemSettingsMonitoring/WebApplication",
          name: 'systemSettingsMonitoring',
          component: systemSettingsMonitoring,
          children: [
            {path: "/YUser/systemSettingsMonitoring/WebApplication", name: 'WebApplication', component: WebApplication},
            {
              path: "/YUser/systemSettingsMonitoring/DatabaseApplication",
              name: 'DatabaseApplication',
              component: DatabaseApplication
            },
            {
              path: "/YUser/systemSettingsMonitoring/CollectorApplication",
              name: 'CollectorApplication',
              component: CollectorApplication
            },
          ]
        },
        {path: "/YUser/DeviceManualDetection", name: "DeviceManualDetection", component: DeviceManualDetection},
        {path: "/YUser/DeviceManualDetection/BeganToSee", name: "BeganToSee", component: BeganToSee},
        {path: "/YUser/monitoringAndControl", name: "monitoringAndControl", component: monitoringAndControl},
        {path: "/YUser/alarmManagement", name: "alarmManagement", component: alarmManagement},
        {path: "/YUser/alarmManagement/alarmCurrent", name: "alarmCurrent", component: alarmCurrent},
        
        
        //树形穿梭
        {path:'/YUser/selectTree',name:'selectTree',component:selectTree},
      ]
    },
    {path: '/login', name: 'Login', component: Login},
  ]
});
