<template>
	<Box class="grayBg homeBox">
		<div class="home-main">
			<p class="home-main-title">{{$t('homePage.formComputerRoomEquipment')}}</p>
			<!--四项统计-->
			<el-row :gutter="20">
				<el-col :span="6">
					<div class="home-main-alert-box home-shadowBox displayFlex-self"
							 style="cursor: pointer" @click="toAassetDeviceMaintenancePage">
						<span class="iconfontPrimaryBg">
							<span class="iconfontPrimaryBox">
								<span class="iconfont">&#xe6a0;</span>
							</span>
						</span>
						<div class="displayFlex-flex home-main-title-text">
							<p class="title">{{$t('homePage.formAllNumber')}}</p>
							<p class="textNum">
								<span>{{equipmentData.equipmentAllData}}</span>
								<span class="num">{{$t('homePage.formAssetUnit')}}</span>
							</p>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="home-main-alert-box home-shadowBox displayFlex-self"
							 style="cursor: pointer" @click="toMonitoringAndControlPage">
						<span class="iconfontErrorBg">
						  <span class="iconfontErrorBox">
							<span class="iconfont ">&#xe69f;</span>
						  </span>
						</span>
						<div class="displayFlex-flex home-main-title-text">
							<p class="title">{{$t('homePage.formAlarmNumber')}}</p>
							<p class="textNum">
								<span>{{equipmentData.equipmentAlarmData}}</span>
								<span class="num">{{$t('homePage.formAssetUnit')}}</span>
							</p>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="home-main-alert-box home-shadowBox displayFlex-self"
							 style="cursor: pointer" @click="toCurrentAlarmPage">
						<span class="iconfontWarnBg">
						  <span class="iconfontWarnBox">
							<span class="iconfont">&#xe6a1;</span>
						  </span>
						</span>
						<div class="displayFlex-flex home-main-title-text">
							<p class="title">{{$t('homePage.formTodayAlarmNumber')}}</p>
							<p class="textNum">
								<span>{{equipmentData.newAlarmCount}}</span>
								<span class="num">{{$t('homePage.formAlarmUnit')}}</span>
							</p>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="home-main-alert-box home-shadowBox displayFlex-self"
							 style="cursor: pointer" @click="toHistoryAlarmPage">
						<span class="iconfontSuccessBg">
						  <span class="iconfontSuccessBox">
							<span class="iconfont">&#xe6a2;</span>
						  </span>
						</span>
						<div class="displayFlex-flex home-main-title-text">
							<p class="title">{{$t('homePage.formTodayReturnAlarmNumber')}}</p>
							<p class="textNum">
								<span>{{equipmentData.recoverCount}}</span>
								<span class="num">{{$t('homePage.formAlarmUnit')}}</span>
							</p>
						</div>
					</div>
				</el-col>
			</el-row>
			<!--图表-->
			<el-row>
				<el-col :span="24">
					<div id="eCharts" class="whiteBg home-shadowBox homePageECharts" v-show="echart"></div>
				</el-col>
			</el-row>
			<!--表格-->
			<div class="marginTop20 marginBottom20 home-shadowBox whiteBg homeTable">
				<div class="home-main-title paddingLeft-20 borderBottomColor">
					{{$t('homePage.formLatestAlertList')}}
				</div>
				<div class="padding20" style="padding-bottom: 10px;">
					<el-table :data="tableData" ref="table" stripe border class="whiteBg" @cell-click="cellClickColumn">
						<!--序号-->
						<el-table-column width="80px" :label="$t('public.index')" header-align="center" align="center">
							<template slot-scope="scope">
						    	<span>
									{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
								</span>
							</template>
						</el-table-column>
						<!--告警发生时间-->
						<el-table-column :label="$t('homePage.columnOccurrenceTime')" header-align="left"
														 width="150px"
														 align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="top-start">
									<div slot="content">
										<span v-if="scope.row.occurrenceTime === null">N/A</span>
										<span v-else>{{scope.row.occurrenceTime | dateFilter}}</span>
									</div>
									<span v-if="scope.row.occurrenceTime === null">N/A</span>
									<span v-else>{{scope.row.occurrenceTime | dateFilter}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column width="70px" :label="$t('homePage.columnAlarmLevel')" header-align="center" align="center">
							<template slot-scope="scope">
								<el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark"
														:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
									<span class="iconfont iconfontError">&#xe64a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark"
														:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
									<span class="iconfont iconfontWarn">&#xe649;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.alarmLevel == 22" effect="dark"
														:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe64f;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.alarmLevel == 11" effect="dark"
														:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe64e;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark"
														:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
									<span class="iconfont iconfontSuccess">&#xe648;</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--设备信息-->
						<el-table-column prop="deviceName" :label="$t('homePage.columnName')"
														 min-width="50px"
														 header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="top-start">
									<div slot="content">
										<span>{{scope.row.deviceName === null ? 'N/A' : scope.row.deviceName}},({{scope.row.ip}})</span>
									</div>
									<span>{{scope.row.deviceName === null ? 'N/A' : scope.row.deviceName}},({{scope.row.ip}})</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--告警内容-->
						<el-table-column :label="$t('homePage.columnAlarmContent')"
														 min-width="80px"
														 header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="left-start">
									<div slot="content" style="width: 150px">
										{{scope.row.currentStatus}}
									</div>
									<span>{{scope.row.currentStatus}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--机房-->
						<el-table-column width="150px" :label="$t('homePage.columnRoom')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.roomName" placement="top-start">
									<div slot="content">
										<span>{{scope.row.roomName === null ? 'N/A' : scope.row.roomName}}</span>
									</div>
									<span>{{scope.row.roomName === null ? 'N/A' : scope.row.roomName}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--机柜-->
						<el-table-column width="150px" :label="$t('homePage.columnRack')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="top-start">
									<div slot="content">
										<span>{{scope.row.rackName === null ? 'N/A' : scope.row.rackName}}</span>
									</div>
									<span>{{scope.row.rackName === null ? 'N/A' : scope.row.rackName}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--位置-->
						<el-table-column width="70px" :label="$t('homePage.columnPosition')" header-align="left"
														 align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark"
														:content="scope.row.rackPosition == null ? 'N/A' : (scope.row.rackPosition)+'U'"
														placement="top-start">
									<span v-if="scope.row.rackPosition== null">N/A</span>
									<span>{{scope.row.rackPosition}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<!--分页-->
					<pages
						:total='options.total'
						:currentPage='options.currentPage'
						:page-size="options.pageSize"
						@handleSizeChangeSub="handleSizeChangeSub"
						@handleCurrentChangeSub="handleCurrentChange"/>
				</div>
			</div>
		</div>
		<!--标签页-->
		<AdministrationTags
			@changePageDeviceId="changePageDeviceId"
			@refreshSetInterval="refreshSetInterval"
			@clearSetInterval="clearSetInterval"
			:active-name="homeActive"
			:page-device-name="pageDeviceName"
			:page-device-id="pageDeviceId"/>
	</Box>
</template>

<script>
	import Box from '../../components/common/Box';
	import AdministrationTags from '../../components/monitor/AdministrationTabs';
	import {dateFilter} from "../../assets/js/filters";

	export default {
		name: "home",
		components: {Box, dateFilter, AdministrationTags},
		data() {
			return {
				echart: true,
				// 分页
				options: {
					total: 0, //总条数
					currentPage: 1, //当前页码
					pageSize: 10, //显示条数
				},
				// 统计集合
				equipmentData: {
					equipmentAllData: '', // 设备总数
					equipmentAlarmData: '', // 告警设备数
					newAlarmCount: '', // 今日新增告警数
					recoverCount: '', //为今日告警恢复数
				},
				//echarts时间
				requesttime: '',
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				tableData: [], //表格数据
				// 柱状图初始化
				option: {
					// 标题相关配置
					title: {
						text: this.$t('homePage.formTitleText'), // 主标题
						subtext: '', // 副标题 显示刷新时间
						top: 5, // 距离顶部
						left: 20, // 左侧距离
						textStyle: { // 主标题属性
							fontSize: 18,
							color: '#333'
						},
						subtextStyle: { // 副标题属性
							fontSize: 14,
							color: '#ccc'
						},
						itemGap: 10, // 主标题与副标题 上下间距
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					// 柱状图 距离顶部距离
					grid: {
						top: 100,
					},
					icon: ['circle'], // 设置图例为圆形
					color: ['#f96563','#27afcd','#359dfb','#8170f5','#4f5e6c','#60d162','#f4bd5b','#6e84bc','#e471e5'],
					// 图例数据
					legend: {
						top: 30,
						data: []
					},
					// 关于下载等功能的一些配置
					toolbox: {
						show: true,
						top: 10,
						right: 30,
						feature: {
							// 视图类型
							magicType: {
								show: true,
								type: ['line', 'bar'],
								title: {
									line: this.$t('homePage.returnLine'),
									bar: this.$t('homePage.returnBar')
								}
							},
							// 还原
							restore: {
								show: true,
								title: this.$t('homePage.restore'),
							},
							// 保存为图片
							saveAsImage: {
								show: true,
								title: this.$t('homePage.download')
							}
						},
					},
					calculable: true,
					// x轴配置
					xAxis: [{
						type: 'category',
						data: []
					}],
					// y轴配置
					yAxis: [{
						type: 'value'
					}],
					// 柱形图数据集合
					series: []
				},
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				// 调用标签页
				homeActive: '', // 点击表格 跳转值 告警事件
				pageDeviceId: '',
				pageDeviceName: '',
			}
		},
		methods: {
			// 表格行点击
			cellClickColumn(row) {
				var _t = this;
				if (row.id !== null) {
					_t.pageDeviceId = row.deviceId;
					_t.pageDeviceName = row.deviceName;
					_t.homeActive = 'two';
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
			},
			// 绘制柱状图
			drawLine() {
				var _t = this;
				var myChart = _t.$echarts.init(document.getElementById("eCharts"));
				myChart.setOption(_t.option);
				// 柱形图的点击事件
				myChart.on('click', function (params) {
					if (typeof params.seriesType === undefined) {
						return;
					} else {
						var alarmStatusMap = _t.tableDataBase.AlarmSeverity;
						var alarmTypeMap = _t.tableDataBase.AssetType;
						// 获取 根据序号 判断 类型 0暂停 1忽略 2正常 3警告 4紧急 5总数
						var dataObject = new Object();
						// 取出 设备状态字段
						for (var key in alarmStatusMap) {
							if (params.seriesName === alarmStatusMap[key]) {
								// 根据name名从字典中取出 设备状态 key
								dataObject.status = key;
							}
						}
						// 点击总数 设备状态 为未定义 设为null 查全部状态
						if (dataObject.status === undefined) {
							dataObject.status = null;
						}
						// 取出设备类型字段
						for (var key in alarmTypeMap) {
							if (params.name === alarmTypeMap[key]) {
								// 根据name名从字典中取出 设备状态 key
								dataObject.nodeId = key;
								dataObject.nodeName = alarmTypeMap[key];
							}
						}
						_t.$router.push({
							name: 'EquipmentMonitoring', params: {
								homeEquipmentData: JSON.stringify(dataObject),
								homeEquipmentStatus: true // 区分是否单独进入设备监测页面
							}
						});
						localStorage.setItem('homeEquipmentData', JSON.stringify(dataObject));
						localStorage.setItem('homeEquipmentStatus', true);
					}
				});
			},
			// 绘制柱状图(new)
			drawLineByType() {
				var _t = this;
				var myChart = _t.$echarts.init(document.getElementById("eCharts"));
				myChart.setOption(_t.option);
				// 柱形图的点击事件
				myChart.on('click', function (params) {
					if (typeof params.seriesType === undefined) {
						return;
					} else {
						var alarmStatusMap = _t.tableDataBase.AlarmSeverity;
						var alarmTypeMap = _t.tableDataBase.AssetType;
						// 获取 根据序号 判断 类型 0暂停 1忽略 2正常 3警告 4紧急 5总数
						var dataObject = new Object();
						// 取出 设备状态字段
						for (var key in alarmStatusMap) {
							if (params.name === alarmStatusMap[key]) {
								// 根据name名从字典中取出 设备状态 key
								dataObject.status = key;
							}
						}
						// 点击总数 设备状态 为未定义 设为null 查全部状态
						if (dataObject.status === undefined) {
							dataObject.status = null;
						}
						// 取出设备类型字段
						for (var key in alarmTypeMap) {
							if (params.seriesName === alarmTypeMap[key]) {
								// 根据name名从字典中取出 设备状态 key
								dataObject.nodeId = key;
								dataObject.nodeName = alarmTypeMap[key];
							}
						}
						_t.$router.push({
							name: 'EquipmentMonitoring', params: {
								homeEquipmentData: JSON.stringify(dataObject),
								homeEquipmentStatus: true // 区分是否单独进入设备监测页面
							}
						});
						localStorage.setItem('homeEquipmentData', JSON.stringify(dataObject));
						localStorage.setItem('homeEquipmentStatus', true);
					}
				});
			},
			// 改变当前页码
			handleCurrentChange(val) {
				var _t = this;
				_t.options.currentPage = val;
				_t.getData();
			},
			// 改变每页显示条数
			handleSizeChangeSub(val) {
				var _t = this;
				_t.options.pageSize = val;
				_t.getData();
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('alarm/alarm/pagelist', {
					jsonString: JSON.stringify({
						page: {
							currentPage: _t.options.currentPage,
							pageSize: _t.options.pageSize
						}
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var resData = res.data.list === null ? [] : res.data.list;
							_t.tableData = resData;
							_t.options.currentPage = res.data.page.currentPage;
							_t.options.total = res.data.page.totalResultSize;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;
							break;
					}
				});
			},
			// 查询表格中状态对应的数据值
			getDictionaryMap() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity", "DeviceMonitorStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.tableDataBase = res.data;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableDataBase = {};
							break;
					}
				});
			},
			//今日新增告警数量接口
			getNewAlarmCount() {
				var _t = this;
				_t.$api.get('/alarm/alarm/newAlarm', {}, function (res) {
					switch (res.status) {
						case 200:
							if (null != res.data) {
								_t.equipmentData.newAlarmCount = res.data.newAlarmCount;
							} else {
								_t.equipmentData.newAlarmCount = 0;
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.equipmentData.newAlarmCount = 0;
							break;
					}
				})
			},
			//今日告警恢复数
			getRecoverCount() {
				var _t = this;
				_t.$api.get('/alarm/alarm/resumeAlarm', {}, function (res) {
					switch (res.status) {
						case 200:
							if (null != res.data) {
								_t.equipmentData.recoverCount = res.data.recoverCount;
							} else {
								_t.equipmentData.recoverCount = 0;
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.equipmentData.recoverCount = 0;
							break;
					}
				})
			},
			//监测概览新接口
			getDeviceSortStatusByType(){
				var _t=this;
				_t.$api.get('asset/assetDevice/deviceSortStatusByType',{},function(res){
					switch (res.status){
						case 200:
							if (res.data && res.data !== null) {
								// 字典状态
								var alarmSeverity = res.data.alarmSeverity;
								// value
								var deviceData = res.data.deviceData;
								// name
								var typeNameMap = res.data.typeNameMap;
								// X轴显示数据
								_t.option.xAxis[0].data = res.data.alarmSeverityList;
								// 给图列赋值
								_t.option.legend.data = res.data.typeList;
								// 设置柱状图副标题为更新时间
								var requestTime = dateFilter(res.requesttime);
								// 设置副标题
								_t.option.title.subtext = requestTime;
								// 组装 y轴数据
								var yAxios = new Array();
								var labelOption = {
									normal: {
										show: true,
										formatter: '{c}',
										align: 'center',
										verticalAlign: 'middle',
										position: 'top',
										/*rotate: 90,*/
									}
								};
								for (var key in deviceData) {
									var obj = new Object();
									obj.type = 'bar';
									obj.name = typeNameMap[key];
									obj.data = deviceData[key];
									obj.label = labelOption;
									yAxios.push(obj);
								}
								_t.option.series = yAxios;
								// 绘制柱状图 并注册点击事件
								_t.drawLineByType();

								// 获取 计算头部 设备数量
								var deviceData = res.data.sourceData === null ? [] : res.data.sourceData;
								var equipmentAllData = 0; // 设备总数
								var equipmentAlarmData = 0; // 告警设备数
								deviceData.forEach((item) => {
									// 计算 统计设备总数 和 告警设备数
									equipmentAllData += item.all;
									equipmentAlarmData += item['66'] + item['99'];
								});
								// 设备总数
								_t.equipmentData.equipmentAllData = equipmentAllData;
								// 告警设备数 紧急和警告的综合
								_t.equipmentData.equipmentAlarmData = equipmentAlarmData;
							}
							break;
						default:
							break;
					}
				})
			},
			//监测概览接口
			getDeviceSortStatus() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/deviceSortStatus', {}, function (res) {
					switch (res.status) {
						case 200:
							var deviceData = res.data.deviceData; // 设备
							var alarmSeverity = res.data.alarmSeverity; // 字典状态
							var requestTime = dateFilter(res.requesttime);
							// 设置柱状图副标题为更新时间
							_t.option.title.subtext = requestTime;
							var equipmentAllData = 0; // 设备总数
							var equipmentAlarmData = 0; // 告警设备数
							// 字段状态 map 转为list
							var alarmSeverityListArr = new Array();
							// 图例
							var legend = new Array();
							for (var key in alarmSeverity) {
								var obj = new Object();
								obj.key = key; // 字典编号 作为 集中状态区分的 关键字
								obj.name = alarmSeverity[key]; // name 为 状态的文案
								obj.type = 'bar'; // 柱状图类型
								obj.stack = obj.name; // 一个 x 上 多个y 合并 stack 名字一样即可
								obj.data = []; // y 轴数据初始化
								alarmSeverityListArr.push(obj);
								legend.push(alarmSeverity[key]); // 添加图例

							}
							// 柱形图 x轴 数据
							var xDataArr = new Array();
							deviceData.forEach((item) => {
								// 计算 统计设备总数 和 告警设备数
								equipmentAllData += item.all;
								equipmentAlarmData += item['66'] + item['99'];
								// x 轴 文案
								xDataArr.push(item['device_type']);
							});
							alarmSeverityListArr.forEach((keyValue) => {
								deviceData.forEach((data) => {
									keyValue.data.push(data[keyValue['key']]);
								});
							});
							// 给x轴赋值
							var xAxis = new Object();
							xAxis.type = 'category';
							xAxis.data = xDataArr;
							_t.option.xAxis[0] = xAxis;
							// 给 y轴赋值
							_t.option.series = alarmSeverityListArr;
							// 图例
							_t.option.legend.data = legend;
							// 设备总数
							_t.equipmentData.equipmentAllData = equipmentAllData;
							// 告警设备数 紧急和警告的综合
							_t.equipmentData.equipmentAlarmData = equipmentAlarmData;
							// 绘制柱状图 并注册点击事件
							_t.drawLine();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.equipmentData.equipmentAllData = 0;
							_t.equipmentData.equipmentAlarmData = 0;
							break;
					}
				})
			},
			//跳转到设备资产页面
			toAassetDeviceMaintenancePage() {
				this.$router.push({name: 'assetDeviceMaintenance'});
			},
			//跳转到监测汇总页面
			toMonitoringAndControlPage() {
				this.$router.push({name: 'monitoringAndControl'});
			},
			//跳转到当前告警页面
			toCurrentAlarmPage() {
				this.$router.push({name: 'alarmCurrent'});
			},
			//跳转到历史告警页面
			toHistoryAlarmPage() {
				this.$router.push({name: 'alarmHistory'});
			},
			// 接收组件中传回的设备id
			changePageDeviceId(val) {
				var _t = this;
				_t.pageDeviceId = val;
			},
			// 启动父组件定时器
			refreshSetInterval(val) {
				var _t = this;
				if (val) {
					// 开启定时器
					_t.refreshPage();
				}
			},
			// 清除父组件定时器
			clearSetInterval(val) {
				var _t = this;
				if (val) {
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
			},
			//页面定时刷新
			refreshPage() {
				var _t = this;
				var rate = 5 * 60; //默认5分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-Home'];
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
						//今日新增告警数
						_t.getNewAlarmCount();
						//今日告警恢复数
						_t.getRecoverCount();

						//监测概览接口
						//_t.getDeviceSortStatus();
						_t.getDeviceSortStatusByType();

						//获取最新告警列表的数据
						_t.getData();
					}
				}, rate * 1000);
			}
		},
		created() {
			var _t = this;

			//获取最新告警列表的数据
			_t.getData();

			//获取表格中用于翻译的字典
			_t.getDictionaryMap();

			//监测概览接口
			//_t.getDeviceSortStatus();
			_t.getDeviceSortStatusByType();

			//今日新增告警数
			_t.getNewAlarmCount();
			//今日告警恢复数
			_t.getRecoverCount();

			_t.$bus.on('getMenu', (val) => {
				if (val) {
					_t.getDictionaryMap();
				}
			});
		},
		mounted() {
			var _t = this;
			// 给body设置自定义属性用于登录过期 提示只执行一次
			document.body.setAttribute('data-return', false);
			//定时刷新页面
			_t.refreshPage();
		},
		beforeDestroy() {
			var _t = this;
			//销毁刷新定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style scoped>
	.home-main {
		padding: 0 20px;
	}

	.home-main-title {
		height: 50px;
		line-height: 50px;
	}

	.home-main-alert-box {
		background-color: #fff;
		border-radius: 4px;
		height: 110px;
		margin-bottom: 20px;
	}

	.home-main-title-text {
		margin-top: 26px;
	}

	.home-main-title-text p.title {
		font-size: 12px;
	}

	.home-main-title-text > p.textNum {
		font-size: 18px;
		font-weight: bold;
		margin-top: 22px;
	}

	.home-main-title-text > p.textNum > span.num {
		font-size: 12px;
	}

	.home-shadowBox {
		box-shadow: 0 0 5px #c1c1c1;
	}

	.homePageECharts {
		height: 500px;
		width: 100%;
	}
</style>
<style>
	.homeBox .box-wrap {
		padding-top: 0 !important;
	}
</style>
