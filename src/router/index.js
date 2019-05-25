import Vue from "vue";
import Router from "vue-router";
// 首页
import Index from "@/page/Index";
// 登录页
import Login from "@/page/login";
// 404页面
import Page404 from "@/page/page404";
// error异常页面
import PageError from "@/page/pageError";
// Home页
const Home = () => import ("@/page/pages/Home");
//树形穿梭框
const selectTree = () => import ("@/components/selectTree");
// 系统管理-->系统设置
const systemSettings = () => import ("@/components/systemSettings");
// 系统管理-->系统设置-->许可证信息管理
const licenseInformation = () => import ("@/page/pages/system/system/licenseInformation");
// 系统管理-->系统设置-->系统管理-->平台信息设置
const platformInformation = () => import ("@/page/pages/system/system/platformInformation");
// 系统管理-->系统设置-->系统管理-->平台语言设置
const platformLanguage = () => import ("@/page/pages/system/system/platformLanguage");
// 系统管理-->系统设置-->系统管理-->数据字典管理
const dataDictionary = () => import ("@/page/pages/system/system/dataDictionary");
// 系统管理-->系统设置-->系统管理-->License到期通知
const licenseNotice = () => import ("@/page/pages/system/system/licenseNotice");
// 系统管理-->系统设置-->系统管理-->接口访问测试
const interfaceTest = () => import ("@/page/pages/system/system/interfaceTest");
// 系统管理-->系统设置-->用户管理-->用户维护
const userMaintenance = () => import ("@/page/pages/system/user/userMaintenance");
// 系统管理-->系统设置-->用户管理-->角色维护
const roleMaintenance = () => import ("@/page/pages/system/user/roleMaintenance");
// 系统管理-->系统设置-->用户管理-->组织维护
const organizeMaintenance = () => import ("@/page/pages/system/user/organizeMaintenance");
// 系统管理-->系统设置-->用户管理-->菜单维护
const functionMenuMaintenance = () => import ("@/page/pages/system/user/functionMenuMaintenance");
// 系统管理-->系统设置-->用户管理-->菜单维护-->新增/编辑
const functionMenuDetail = () => import ("@/page/pages/system/user/functionMenuDetail");
// 系统管理-->系统设置-->数据库管理-->数据库备份
const dataBaseBackUp = () => import ("@/page/pages/system/database/dataBaseBackUp");
// 系统管理-->系统设置-->数据库管理-->备份定时器
const backUpTimer = () => import ("@/page/pages/system/database/backUpTimer");
// 系统管理-->系统设置-->数据库管理-->数据库还原
const dataBaseRestore = () => import ("@/page/pages/system/database/dataBaseRestore");
// 系统管理-->系统设置-->设备采集设置-->节点组维护
const nodeGroupMaintenance = () => import ("@/page/pages/system/collector/nodeGroupMaintenance");
// 系统管理-->系统设置-->设备采集设置-->采集节点管理
const acquisitionNodeManagement = () => import ("@/page/pages/system/collector/acquisitionNodeManagement");
// 系统管理-->系统设置-->设备采集设置-->采集任务分配
const collectionTaskAssignment = () => import ("@/page/pages/system/collector/collectionTaskAssignment");
// 系统管理-->系统设置-->设备采集设置-->采集节点状态
const acquisitionNodeState = () => import ("@/page/pages/system/collector/acquisitionNodeState");
// 系统管理-->系统设置-->日志管理-->登录日志
const loginLog = () => import ("@/page/pages/system/log/loginLog");
// 系统管理-->系统设置-->日志管理-->操作日志
const operationLog = () => import ("@/page/pages/system/log/operationLog");
// 系统管理-->系统设置-->日志管理-->任务日志
const jobLog = () => import ("@/page/pages/system/log/jobLog");
// 系统管理-->系统设置-->日志管理-->通知日志
const notificationLog = () => import ("@/page/pages/system/log/notificationLog");
// 系统管理-->系统设置-->日志管理-->检测日志
const monitorLog = () => import ("@/page/pages/system/log/monitorLog");
// 系统管理-->系统监测
const systemSettingsMonitoring = () => import ("@/components/systemSettingsMonitoring");
// 系统管理-->系统监测-->WEB应用
const WebApplication = () => import ("@/page/pages/system/monitor/WebApplication");
// 系统管理-->系统监测-->数据库应用
const DatabaseApplication = () => import ("@/page/pages/system/monitor/DatabaseApplication");
// 系统管理-->系统监测-->采集器应用
const CollectorApplication = () => import ("@/page/pages/system/monitor/CollectorApplication");
// 设备发现-->设备类型管理
// 设备发现-->设备信息设置
// 设备发现-->设备发现设置
// 设备发现-->设备自动发现
// 设备发现-->设备自动发现（NEW）
// 设备发现-->设备手动发现（NEW）
const DeviceManualDetection = () => import ("@/page/pages/asset/discover/DeviceManualDetection");
// 设备发现-->设备手动发现（NEW）-->开始发现/发现进度页面
const BeganToSee = () => import ("@/page/pages/asset/discover/BeganToSee");
// 监测管理-->监测汇总
const monitoringAndControl = () => import ("@/page/pages/monitor/monitoringAndControl");
// 监测管理-->设备监测
const EquipmentMonitoring = () => import ("@/page/pages/monitor/EquipmentMonitoring");
// 监测管理-->设备监测-->监测阈值
const monitorThresholdValue = () => import ("@/page/pages/monitor/monitorThresholdValue");
// 监测管理-->监测状态搜索
const monitorStatusSearch = () => import ("@/page/pages/monitor/monitorStatusSearch");
// 告警管理-->告警汇总
const alarmManagement = () => import ("@/page/pages/alarm/alarmManagement");
// 告警管理-->当前告警
const alarmCurrent = () => import ("@/page/pages/alarm/alarmCurrent");
// 告警管理-->历史告警
const alarmHistory = () => import ("@/page/pages/alarm/alarmHistory");
// 告警管理-->告警设置
const alarmSettings = () => import ("@/components/alarmSettings");
// 告警管理-->告警设置-->基础设置-->告警组设置
const alarmGroupSettings = () => import ("@/page/pages/alarm/basicSettings/alarmGroupSettings");
// 告警管理-->告警设置-->基础设置-->告警规则设置
const alarmRuleSettings = () => import ("@/page/pages/alarm/basicSettings/alarmRuleSettings");
// 告警管理-->告警设置-->通知方式-->邮件设置
const emailSettings = () => import ("@/page/pages/alarm/noticeWaySettings/emailSettings");
// 告警管理-->告警设置-->通知方式-->短信设置
// 告警管理-->告警设置-->通知方式-->微信设置
// 告警管理-->告警设置-->通知方式-->Syslog设置
// 告警管理-->告警设置-->内容格式-->邮件内容
// 告警管理-->告警设置-->内容格式-->短信内容
// 告警管理-->告警设置-->内容格式-->微信内容
// 告警管理-->告警设置-->内容格式-->Syslog内容
// 资产管理-->资产汇总
// 资产管理-->设备资产
const assetDeviceMaintenance = () => import ("@/page/pages/asset/assetDeviceMaintenance");
// 资产管理-->业务资产
// 资产管理-->机房机架
// 资产管理-->保修管理
// 资产管理-->变更管理
// 机房管理-->机房配置
const ComputerConfiguration = () => import ("@/page/pages/serverRoom/ComputerConfiguration");
// 机房管理-->机柜配置
const RackConfiguration = () => import ("@/page/pages/rack/RackConfiguration");
Vue.use(Router);
var companyName = "YUser";
export default new Router({
	// 去掉地址中的井号
	/*mode: "history",*/
	routes: [
		// 解析“/”重定向到根目录
		{path: "/", redirect: "/" + companyName + "/index"},
		// 登录页
		{path: "/login", name: "Login", component: Login},
		// Home页
		{path: "/" + companyName, redirect: "/" + companyName + "/index"},
		{
			// Home页的页面框架（头部+左侧菜单导航）
			path: "/" + companyName, name: "index", component: Index, children: [
				// Home页的页面内容
				{path: "/" + companyName + "/index", name: "Home", component: Home},
				{
					// 系统管理-->系统设置
					path: "/" + companyName + "/systemSettings",
					// 重定向到：系统管理-->系统设置-->许可证信息管理
					redirect: "/" + companyName + "/systemSettings/licenseInformation",
					name: "systemSettings",
					component: systemSettings,
					children: [
						{
							// 系统管理-->系统设置-->许可证信息管理
							path: "/" + companyName + "/systemSettings/licenseInformation",
							name: "licenseInformation",
							component: licenseInformation
						},
						{
							// 系统管理-->系统设置-->系统管理-->平台信息设置
							path: "/" + companyName + "/systemSettings/platformInformation",
							name: "platformInformation",
							component: platformInformation
						},
						{
							// 系统管理-->系统设置-->系统管理-->平台语言设置
							path: "/" + companyName + "/systemSettings/platformLanguage",
							name: "platformLanguage",
							component: platformLanguage
						},
						{
							// 系统管理-->系统设置-->系统管理-->数据字典管理
							path: "/" + companyName + "/systemSettings/dataDictionary",
							name: "dataDictionary",
							component: dataDictionary
						},
						{
							// 系统管理-->系统设置-->系统管理-->License到期通知
							path: "/" + companyName + "/systemSettings/licenseNotice",
							name: "licenseNotice",
							component: licenseNotice
						},
						{
							// 系统管理-->系统设置-->系统管理-->接口访问测试
							path: "/" + companyName + "/systemSettings/interfaceTest",
							name: "interfaceTest",
							component: interfaceTest
						},
						{
							// 系统管理-->系统设置-->用户管理-->用户维护
							path: "/" + companyName + "/systemSettings/userMaintenance",
							name: "userMaintenance",
							component: userMaintenance
						},
						{
							// 系统管理-->系统设置-->用户管理-->角色维护
							path: "/" + companyName + "/systemSettings/roleMaintenance",
							name: "roleMaintenance",
							component: roleMaintenance
						},
						{
							// 系统管理-->系统设置-->用户管理-->组织维护
							path: "/" + companyName + "/systemSettings/organizeMaintenance",
							name: "organizeMaintenance",
							component: organizeMaintenance
						},
						{
							// 系统管理-->系统设置-->用户管理-->菜单维护
							path: "/" + companyName + "/systemSettings/functionMenuMaintenance",
							name: "functionMenuMaintenance",
							component: functionMenuMaintenance
						},
						{
							// 系统管理-->系统设置-->用户管理-->菜单维护-->新增/编辑
							path: "/" + companyName + "/systemSettings/functionMenuMaintenance/functionMenuDetail",
							name: "functionMenuDetail",
							component: functionMenuDetail
						},
						{
							// 系统管理-->系统设置-->数据库管理-->数据库备份
							path: "/" + companyName + "/systemSettings/dataBaseBackUp",
							name: "dataBaseBackUp",
							component: dataBaseBackUp
						},
						{
							// 系统管理-->系统设置-->数据库管理-->备份定时器
							path: "/" + companyName + "/systemSettings/backUpTimer",
							name: "backUpTimer",
							component: backUpTimer
						},
						{
							// 系统管理-->系统设置-->数据库管理-->数据库还原
							path: "/" + companyName + "/systemSettings/dataBaseRestore",
							name: "dataBaseRestore",
							component: dataBaseRestore
						},
						{
							// 系统管理-->系统设置-->设备采集设置-->节点组维护
							path: "/" + companyName + "/systemSettings/nodeGroupMaintenance",
							name: "nodeGroupMaintenance",
							component: nodeGroupMaintenance
						},
						{
							// 系统管理-->系统设置-->设备采集设置-->采集节点管理
							path: "/" + companyName + "/systemSettings/acquisitionNodeManagement",
							name: "acquisitionNodeManagement",
							component: acquisitionNodeManagement
						},
						{
							// 系统管理-->系统设置-->设备采集设置-->采集任务分配
							path: "/" + companyName + "/systemSettings/collectionTaskAssignment",
							name: "collectionTaskAssignment",
							component: collectionTaskAssignment
						},
						{
							// 系统管理-->系统设置-->设备采集设置-->采集节点状态
							path: "/" + companyName + "/systemSettings/acquisitionNodeState",
							name: "acquisitionNodeState",
							component: acquisitionNodeState
						},
						// 系统管理-->系统设置-->日志管理-->登录日志
						{path: "/" + companyName + "/systemSettings/loginLog", name: "loginLog", component: loginLog},
						// 系统管理-->系统设置-->日志管理-->操作日志
						{path: "/" + companyName + "/systemSettings/operationLog", name: "operationLog", component: operationLog},
						// 系统管理-->系统设置-->日志管理-->任务日志
						{path: "/" + companyName + "/systemSettings/jobLog", name: "jobLog", component: jobLog},
						// 系统管理-->系统设置-->日志管理-->通知日志
						{path: "/" + companyName + "/systemSettings/notificationLog", name: "notificationLog", component: notificationLog},
						// 系统管理-->系统设置-->日志管理-->检测日志
						{path: "/" + companyName + "/systemSettings/monitorLog", name: "monitorLog", component: monitorLog},
					]
				},
				{
					// 系统管理-->系统监测
					path: "/" + companyName + "/systemSettingsMonitoring",
					// 重定向到：系统管理-->系统监测-->WEB应用
					redirect: "/" + companyName + "/systemSettingsMonitoring/WebApplication",
					name: "systemSettingsMonitoring",
					component: systemSettingsMonitoring,
					children: [
						{
							// 系统管理-->系统监测-->WEB应用
							path: "/" + companyName + "/systemSettingsMonitoring/WebApplication",
							name: "WebApplication",
							component: WebApplication
						},
						{
							// 系统管理-->系统监测-->数据库应用
							path: "/" + companyName + "/systemSettingsMonitoring/DatabaseApplication",
							name: "DatabaseApplication",
							component: DatabaseApplication
						},
						{
							// 系统管理-->系统监测-->采集器应用
							path: "/" + companyName + "/systemSettingsMonitoring/CollectorApplication",
							name: "CollectorApplication",
							component: CollectorApplication
						},
					]
				},
				// 设备发现-->设备类型管理

				// 设备发现-->设备信息设置

				// 设备发现-->设备发现设置

				// 设备发现-->设备自动发现

				// 设备发现-->设备自动发现（NEW）

				// 设备发现-->设备手动发现（NEW）
				{path: "/" + companyName + "/DeviceManualDetection", name: "DeviceManualDetection", component: DeviceManualDetection},
				// 设备发现-->设备手动发现（NEW）-->开始发现/发现进度页面
				{path: "/" + companyName + "/DeviceManualDetection/BeganToSee", name: "BeganToSee", component: BeganToSee},
				// 监测管理-->监测汇总
				{path: "/" + companyName + "/monitoringAndControl", name: "monitoringAndControl", component: monitoringAndControl},
				// 监测管理-->设备监测
				{path: "/" + companyName + "/EquipmentMonitoring", name: "EquipmentMonitoring", component: EquipmentMonitoring},
				// 监测管理-->设备监测-->监测阈值
				{path: "/" + companyName + "/monitorThresholdValue", name: "monitorThresholdValue", component: monitorThresholdValue},
				// 监测管理-->监测状态搜索
				{path: "/" + companyName + "/monitorStatusSearch", name: "monitorStatusSearch", component: monitorStatusSearch},
				// 告警管理-->告警汇总
				{path: "/" + companyName + "/alarmManagement", name: "alarmManagement", component: alarmManagement},
				// 告警管理-->当前告警
				{path: "/" + companyName + "/alarmManagement/alarmCurrent", name: "alarmCurrent", component: alarmCurrent},
				// 告警管理-->历史告警
				{path: "/" + companyName + "/alarmManagement/alarmHistory", name: "alarmHistory", component: alarmHistory},
				// 告警管理-->告警设置
				{
					path: "/" + companyName + "/alarmSettings",
					// 重定向到：告警管理-->告警设置-->基础设置-->告警组设置
					redirect: "/" + companyName + "/alarmSettings/alarmGroupSettings",
					name: "alarmSettings",
					component: alarmSettings,
					children: [
						{
							// 告警管理-->告警设置-->基础设置-->告警组设置
							path: "/" + companyName + "/alarmSettings/alarmGroupSettings",
							name: "alarmGroupSettings",
							component: alarmGroupSettings
						},
						{
							// 告警管理-->告警设置-->基础设置-->告警规则设置
							path: "/" + companyName + "/alarmSettings/alarmRuleSettings",
							name: "alarmRuleSettings",
							component: alarmRuleSettings
						},
						{
							// 告警管理-->告警设置-->通知方式-->邮件设置
							path: "/" + companyName + "/alarmSettings/emailSettings",
							name: "emailSettings",
							component: emailSettings
						},
						// 告警管理-->告警设置-->通知方式-->短信设置
						// 告警管理-->告警设置-->通知方式-->微信设置
						// 告警管理-->告警设置-->通知方式-->Syslog设置
						// 告警管理-->告警设置-->内容格式-->邮件内容
						// 告警管理-->告警设置-->内容格式-->短信内容
						// 告警管理-->告警设置-->内容格式-->微信内容
						// 告警管理-->告警设置-->内容格式-->Syslog内容
					]
				},
				// 资产管理-->资产汇总
				// 资产管理-->设备资产
				{path: "/" + companyName + "/assetDeviceMaintenance", name: "assetDeviceMaintenance", component: assetDeviceMaintenance},
				// 资产管理-->业务资产
				// 资产管理-->机房机架
				// 资产管理-->保修管理
				// 资产管理-->变更管理
				// 机房管理-->机房配置
				{path: "/" + companyName + "/ComputerConfiguration", name: "ComputerConfiguration", component: ComputerConfiguration},
			// 机房管理-->机柜配置
				{path: "/" + companyName + "/RackConfiguration", name: "RackConfiguration", component: RackConfiguration},
				//树形穿梭
				{path: "/" + companyName + "/selectTree", name: "selectTree", component: selectTree},

				// error异常页
				{path: "/" + companyName + "/pageError", name: "PageError", component: PageError},
				// 404页
				{path: "*", name: "Page404", component: Page404}
			]
		}
	]
});
